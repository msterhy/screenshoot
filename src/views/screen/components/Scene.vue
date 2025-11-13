<template>
  <section class="model-view">
    <div class="scene" ref="container"></div>
    <div class="tooltip" ref="tooltip-container" :class="{ visible: waterDataRecord && !showDetailPanel }">
      <div class="tooltip-item" v-if="waterDataRecord && !showDetailPanel" ref="tooltipElement">
        <div class="tooltip-header">
          <h3>{{ waterDataRecord.name }}</h3>
          <div class="status-indicator"></div>
        </div>
        <div class="tooltip-content">
          <div class="data-row">
            <span class="label">水氧溶:</span>
            <span class="value">{{ waterDataRecord.DO }}</span>
          </div>
          <div class="data-row">
            <span class="label">水温度:</span>
            <span class="value">{{ waterDataRecord.HT }}</span>
          </div>
          <div class="data-row">
            <span class="label">水PH:</span>
            <span class="value">{{ waterDataRecord.PH }}</span>
          </div>
        </div>
      </div>
    </div>
    <DataDetailPanel
      ref="detailPanelRef"
      :data="selectedData"
      :visible="showDetailPanel"
      @close="handleClosePanel"
      @back="handleBackToInitial"
    />
  </section>
</template>

<script lang="ts" setup>
import {
  Mesh,
  Scene,
  Euler,
  Sprite,
  Vector3,
  Vector2,
  Raycaster,
  TextureLoader,
  WebGLRenderer,
  SpriteMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  EquirectangularReflectionMapping,
  Color,
  Box3,
  Object3D,
} from 'three'
import info from '@/assets/screen/info.png'
import waring from '@/assets/screen/waring.png'
import { onMounted, ref, useTemplateRef, onUnmounted, nextTick } from 'vue'
import { EXRLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import DataDetailPanel from './DataDetailPanel.vue'

interface TooltipRecord {
  DO: string
  HT: string
  PH: string
  name: string
}

// Refs
const container = useTemplateRef('container')
const tooltipContainer = useTemplateRef('tooltip-container')
const tooltipElement = useTemplateRef('tooltipElement')
const detailPanelRef = useTemplateRef('detailPanelRef')

// Three.js 变量
let scene: Scene
let renderer: WebGLRenderer
let controls: OrbitControls
let camera: PerspectiveCamera
const cameraPoistion = new Vector3(6, 3, 3)
const cameraRotation = new Euler(0, 0, 0)
const raycaster = new Raycaster()
const pointer = new Vector2()

const markSprites: Sprite[] = []
const waterObjects: Mesh[] = []
const waterDataRecord = ref<TooltipRecord | null>(null)
const selectedData = ref<TooltipRecord | null>(null)
const showDetailPanel = ref(false)
let animationId: number
let currentIntersectedSprite: Sprite | null = null
let lastIntersectedSprite: Sprite | null = null
let clickedSprite: Sprite | null = null

// 相机动画相关
const initialCameraPosition = new Vector3(6, 3, 3)
const initialCameraTarget = new Vector3(0, 0, 0)
let isAnimating = false
let cameraAnimationStartTime = 0
const cameraAnimationDuration = 1500 // 1.5秒
let cameraStartPosition = new Vector3()
let cameraTargetPosition = new Vector3()
let controlsStartTarget = new Vector3()
let controlsTargetTarget = new Vector3()
let panelPositionUpdateFrameCount = 0

// 自动环绕相关
let autoRotateTimer: number | null = null
const autoRotateDelay = 5000 // 用户停止操作后5秒重新启用自动环绕
const autoRotateSpeed = 5 // 自动环绕速度
let isUserInteracting = false // 标记用户是否正在交互
let lastInteractionTime = 0 // 最后一次交互时间

const initScene = () => {
  if (!container.value) return

  scene = new Scene()
  camera = new PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.01,
    5000,
  )
  camera.position.copy(cameraPoistion)

  renderer = new WebGLRenderer({ alpha: true, antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  camera.position.copy(cameraPoistion)
  camera.rotation.copy(cameraRotation)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = true
  
  // 启用自动环绕
  controls.autoRotate = true
  controls.autoRotateSpeed = autoRotateSpeed

  container.value.appendChild(renderer.domElement)
}

const animate = () => {
  if (container.value) {
    const { clientWidth, clientHeight } = container.value
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    // 更新相机动画（动画期间会调用 controls.update()）
    updateCameraAnimation()
    
    // 检查用户交互超时
    checkUserInteractionTimeout()
    
    // 更新控制器（自动环绕需要每帧更新，动画期间已在 updateCameraAnimation 中更新）
    // 确保每帧都调用 update() 以保持平滑的自动环绕
    if (controls && !isAnimating) {
      controls.update()
    }
    
    renderer.render(scene, camera)

    if (currentIntersectedSprite && waterDataRecord.value && !showDetailPanel.value) {
      updateTooltipPosition(currentIntersectedSprite)
    }

    // 更新详情面板位置（在相机动画过程中或面板显示时更新）
    if (showDetailPanel.value && clickedSprite && detailPanelRef.value) {
      // 如果正在动画中，每帧更新；否则降低更新频率
      if (isAnimating) {
        updateDetailPanelPosition(clickedSprite)
        panelPositionUpdateFrameCount = 0
      } else {
        // 非动画状态下，降低更新频率（每10帧更新一次）
        panelPositionUpdateFrameCount++
        if (panelPositionUpdateFrameCount % 10 === 0) {
          updateDetailPanelPosition(clickedSprite)
        }
      }
    }

    animationId = requestAnimationFrame(animate)
  }
}

const createMarkPool = async (url: string, mesh: Mesh) => {
  try {
    const texture = await new TextureLoader().loadAsync(url)
    const spriteMaterial = new SpriteMaterial({
      map: texture,
      transparent: true,
    })
    const sprite = new Sprite(spriteMaterial)
    sprite.scale.set(0.2, 0.2, 0.2)
    sprite.position.copy(new Vector3(mesh.position.x, 1, mesh.position.z))

    sprite.userData = {
      name: mesh.name,
      DO: `${(Math.random() * 20).toFixed(2)} mg/L`,
      HT: `${(Math.random() * 100).toFixed(2)} °C`,
      PH: `${(Math.random() * 20).toFixed(2)}`,
      originalColor: new Color(1, 1, 1),
      highlightColor: new Color(0x11ffff),
      waterMesh: mesh, // 保存对应的水池mesh引用
    }

    scene.add(sprite)
    markSprites.push(sprite)
  } catch (error) {
    console.error('创建标记点失败:', error)
  }
}

const updateTooltipPosition = (sprite: Sprite) => {
  if (!tooltipContainer.value || !tooltipElement.value) return

  const worldPosition = new Vector3()
  sprite.getWorldPosition(worldPosition)

  worldPosition.project(camera)

  const x = (worldPosition.x * 0.5 + 0.5) * window.innerWidth
  const y = (1 - (worldPosition.y * 0.5 + 0.5)) * window.innerHeight

  const tooltipRect = tooltipElement.value.getBoundingClientRect()
  const tooltipWidth = tooltipRect.width
  const tooltipHeight = tooltipRect.height

  let finalX = x + 20 // 在标记点右侧显示
  let finalY = y - tooltipHeight / 2 // 垂直居中

  // 边界检查
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 如果右侧空间不足，显示在左侧
  if (finalX + tooltipWidth > windowWidth) {
    finalX = x - tooltipWidth - 20
  }

  // 上下边界检查
  if (finalY < 10) {
    finalY = 10
  } else if (finalY + tooltipHeight > windowHeight - 10) {
    finalY = windowHeight - tooltipHeight - 10
  }

  tooltipContainer.value.style.left = `${finalX}px`
  tooltipContainer.value.style.top = `${finalY}px`
}

// 计算水池在屏幕上的投影区域
const getPoolScreenBounds = (mesh: Mesh): { minX: number; maxX: number; minY: number; maxY: number } | null => {
  if (!camera || !mesh) return null

  const box = new Box3().setFromObject(mesh)
  const corners = [
    new Vector3(box.min.x, box.min.y, box.min.z),
    new Vector3(box.max.x, box.min.y, box.min.z),
    new Vector3(box.min.x, box.max.y, box.min.z),
    new Vector3(box.max.x, box.max.y, box.min.z),
    new Vector3(box.min.x, box.min.y, box.max.z),
    new Vector3(box.max.x, box.min.y, box.max.z),
    new Vector3(box.min.x, box.max.y, box.max.z),
    new Vector3(box.max.x, box.max.y, box.max.z),
  ]

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const corner of corners) {
    const projected = corner.clone().project(camera)
    const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth
    const screenY = (1 - (projected.y * 0.5 + 0.5)) * window.innerHeight

    minX = Math.min(minX, screenX)
    maxX = Math.max(maxX, screenX)
    minY = Math.min(minY, screenY)
    maxY = Math.max(maxY, screenY)
  }

  // 添加一些边距，确保面板不会太靠近水池
  const margin = 20
  return {
    minX: Math.max(0, minX - margin),
    maxX: Math.min(window.innerWidth, maxX + margin),
    minY: Math.max(0, minY - margin),
    maxY: Math.min(window.innerHeight, maxY + margin),
  }
}

// 检查两个矩形是否重叠
const isOverlapping = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { minX: number; maxX: number; minY: number; maxY: number },
): boolean => {
  return (
    rect1.x < rect2.maxX &&
    rect1.x + rect1.width > rect2.minX &&
    rect1.y < rect2.maxY &&
    rect1.y + rect1.height > rect2.minY
  )
}

// 智能定位面板，避免遮挡水池
const findBestPanelPosition = (
  panelWidth: number,
  panelHeight: number,
  poolBounds: { minX: number; maxX: number; minY: number; maxY: number } | null,
): { x: number; y: number } => {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const margin = 20

  // 候选位置：右侧、左侧、顶部、底部
  const candidates = [
    // 右侧
    {
      x: windowWidth - panelWidth - margin,
      y: (windowHeight - panelHeight) / 2,
      priority: 1,
    },
    // 左侧
    {
      x: margin,
      y: (windowHeight - panelHeight) / 2,
      priority: 2,
    },
    // 顶部居中
    {
      x: (windowWidth - panelWidth) / 2,
      y: margin,
      priority: 3,
    },
    // 底部居中
    {
      x: (windowWidth - panelWidth) / 2,
      y: windowHeight - panelHeight - margin,
      priority: 4,
    },
    // 右上角
    {
      x: windowWidth - panelWidth - margin,
      y: margin,
      priority: 5,
    },
    // 右下角
    {
      x: windowWidth - panelWidth - margin,
      y: windowHeight - panelHeight - margin,
      priority: 6,
    },
    // 左上角
    {
      x: margin,
      y: margin,
      priority: 7,
    },
    // 左下角
    {
      x: margin,
      y: windowHeight - panelHeight - margin,
      priority: 8,
    },
  ]

  // 如果没有水池边界信息，直接返回右侧位置
  if (!poolBounds) {
    return candidates[0]
  }

  // 检查每个候选位置，找到不遮挡水池的最佳位置
  for (const candidate of candidates) {
    const panelRect = {
      x: candidate.x,
      y: candidate.y,
      width: panelWidth,
      height: panelHeight,
    }

    // 检查是否与水池重叠
    if (!isOverlapping(panelRect, poolBounds)) {
      return candidate
    }
  }

  // 如果所有位置都重叠，选择重叠面积最小的位置
  // 这里简化处理，返回右侧位置（通常是最佳选择）
  return candidates[0]
}

const updateDetailPanelPosition = (sprite: Sprite) => {
  if (!detailPanelRef.value) return

  const panelElement = detailPanelRef.value.$el as HTMLElement
  if (!panelElement) return

  const panelRect = panelElement.getBoundingClientRect()
  const panelWidth = panelRect.width || 600
  const panelHeight = panelRect.height || 400

  // 获取对应的水池mesh
  const waterMesh = (sprite.userData as any).waterMesh as Mesh | undefined

  // 计算水池在屏幕上的投影区域
  const poolBounds = waterMesh ? getPoolScreenBounds(waterMesh) : null

  // 找到最佳面板位置
  const bestPosition = findBestPanelPosition(panelWidth, panelHeight, poolBounds)

  panelElement.style.left = `${bestPosition.x}px`
  panelElement.style.top = `${bestPosition.y}px`
}

const handleClosePanel = () => {
  showDetailPanel.value = false
  selectedData.value = null
  clickedSprite = null
  if (lastIntersectedSprite) {
    unhighlightSprite(lastIntersectedSprite)
  }
  // 返回初始视角
  resetCameraToInitial()
  // 关闭面板后，延迟启用自动环绕
  enableAutoRotateDelayed()
}

const handleBackToInitial = () => {
  // 只返回视角，不关闭面板
  resetCameraToInitial()
}

// 缓动函数 - easeInOutCubic
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// 计算水池的bounding box并确定合适的相机位置
const calculateCameraPositionForPool = (mesh: Mesh): { position: Vector3; target: Vector3 } => {
  if (!camera) {
    return {
      position: initialCameraPosition.clone(),
      target: initialCameraTarget.clone(),
    }
  }

  const box = new Box3().setFromObject(mesh)
  const center = box.getCenter(new Vector3())
  const size = box.getSize(new Vector3())
  
  // 计算最大的尺寸，用于确定相机距离
  const maxSize = Math.max(size.x, size.y, size.z)
  
  // 如果尺寸为0，使用默认值
  if (maxSize === 0) {
    return {
      position: center.clone().add(new Vector3(2, 2, 2)),
      target: center,
    }
  }
  
  // 计算合适的相机距离（让水池占据屏幕的60-70%）
  // 使用FOV和屏幕尺寸来计算合适的距离
  const fov = camera.fov * (Math.PI / 180)
  const distance = maxSize / (2 * Math.tan(fov / 2)) * 1.8
  
  // 计算相机位置（从上方和侧方观察，形成45度角）
  const horizontalAngle = Math.PI / 4 // 45度水平角
  const verticalAngle = Math.PI / 6 // 30度垂直角
  
  const cameraPosition = new Vector3(
    center.x + distance * Math.cos(horizontalAngle),
    center.y + distance * Math.sin(verticalAngle) + maxSize * 0.3,
    center.z + distance * Math.sin(horizontalAngle)
  )
  
  return {
    position: cameraPosition,
    target: center,
  }
}

// 开始相机动画
const animateCameraToPool = (mesh: Mesh) => {
  if (!camera || !controls) return
  
  const { position, target } = calculateCameraPositionForPool(mesh)
  
  // 保存当前状态
  cameraStartPosition.copy(camera.position)
  cameraTargetPosition.copy(position)
  controlsStartTarget.copy(controls.target)
  controlsTargetTarget.copy(target)
  
  // 开始动画
  isAnimating = true
  cameraAnimationStartTime = performance.now()
  
  // 禁用控制器和自动环绕，避免用户操作干扰动画
  controls.enabled = false
  disableAutoRotate()
}

// 重置相机到初始位置
const resetCameraToInitial = () => {
  if (!camera || !controls) return
  
  cameraStartPosition.copy(camera.position)
  cameraTargetPosition.copy(initialCameraPosition)
  controlsStartTarget.copy(controls.target)
  controlsTargetTarget.copy(initialCameraTarget)
  
  isAnimating = true
  cameraAnimationStartTime = performance.now()
  controls.enabled = false
  disableAutoRotate()
}

// 更新相机动画
const updateCameraAnimation = () => {
  if (!isAnimating || !camera || !controls) return
  
  const elapsed = performance.now() - cameraAnimationStartTime
  const progress = Math.min(elapsed / cameraAnimationDuration, 1)
  const easedProgress = easeInOutCubic(progress)
  
  // 插值相机位置
  camera.position.lerpVectors(cameraStartPosition, cameraTargetPosition, easedProgress)
  
  // 插值控制器目标
  controls.target.lerpVectors(controlsStartTarget, controlsTargetTarget, easedProgress)
  controls.update()
  
  // 动画完成
  if (progress >= 1) {
    isAnimating = false
    controls.enabled = true
    // 动画完成后，延迟启用自动环绕
    enableAutoRotateDelayed()
  }
}

// 停止自动环绕
const disableAutoRotate = () => {
  if (!controls) return
  controls.autoRotate = false
  
  // 清除之前的定时器
  if (autoRotateTimer !== null) {
    clearTimeout(autoRotateTimer)
    autoRotateTimer = null
  }
}

// 延迟启用自动环绕
const enableAutoRotateDelayed = () => {
  // 如果详情面板打开或正在动画中，不启用自动环绕
  if (showDetailPanel.value || isAnimating) {
    return
  }
  
  // 清除之前的定时器
  if (autoRotateTimer !== null) {
    clearTimeout(autoRotateTimer)
  }
  
  // 延迟启用自动环绕
  autoRotateTimer = window.setTimeout(() => {
    if (controls && !showDetailPanel.value && !isAnimating && !isUserInteracting) {
      controls.autoRotate = true
      controls.autoRotateSpeed = autoRotateSpeed
    }
    autoRotateTimer = null
  }, autoRotateDelay)
}

// 处理用户交互
const handleUserInteraction = () => {
  isUserInteracting = true
  lastInteractionTime = performance.now()
  disableAutoRotate()
  enableAutoRotateDelayed()
}

// 检查用户是否停止交互
const checkUserInteractionTimeout = () => {
  const now = performance.now()
  // 如果超过延迟时间没有交互，认为用户已停止操作
  if (isUserInteracting && now - lastInteractionTime > autoRotateDelay) {
    isUserInteracting = false
  }
}

const highlightSprite = (sprite: Sprite) => {
  if (sprite.material instanceof SpriteMaterial) {
    if (!sprite.userData.originalColor) {
      sprite.userData.originalColor = new Color().copy(sprite.material.color)
    }
    sprite.material.color.copy(sprite.userData.highlightColor || new Color(1, 0.5, 0))
  }
}

const unhighlightSprite = (sprite: Sprite) => {
  if (sprite.material instanceof SpriteMaterial && sprite.userData.originalColor) {
    sprite.material.color.copy(sprite.userData.originalColor)
  }
}

const addEevent = () => {
  const canvas = renderer.domElement

  // 监听鼠标拖动开始和移动（只在按下鼠标时）
  let isMouseDown = false
  canvas.addEventListener('mousedown', () => {
    isMouseDown = true
    if (!isAnimating && controls.enabled) {
      handleUserInteraction()
    }
  })

  canvas.addEventListener('mouseup', () => {
    isMouseDown = false
  })

  canvas.addEventListener('mouseleave', () => {
    isMouseDown = false
  })

  // 监听滚轮事件
  canvas.addEventListener('wheel', () => {
    if (!isAnimating && controls.enabled) {
      handleUserInteraction()
    }
  }, { passive: true })

  // 鼠标移动事件 - 显示tooltip 和检测用户交互
  canvas.addEventListener('mousemove', (ev) => {
    // 检测用户交互（仅在按下鼠标时）
    if (isMouseDown && !isAnimating && controls.enabled) {
      lastInteractionTime = performance.now()
      if (!isUserInteracting) {
        handleUserInteraction()
      }
    }

    // 显示 tooltip
    if (showDetailPanel.value) return // 如果详情面板已打开，不显示tooltip

    const rect = canvas.getBoundingClientRect()
    const mouseXInCanvas = ev.clientX - rect.left
    const mouseYInCanvas = ev.clientY - rect.top

    pointer.x = (mouseXInCanvas / rect.width) * 2 - 1
    pointer.y = -(mouseYInCanvas / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(markSprites)

    if (intersects.length > 0) {
      const intersect = intersects[0]
      const meshSprite = intersect!.object as Sprite
      const userData = meshSprite.userData as TooltipRecord
      if (currentIntersectedSprite !== meshSprite) {
        if (lastIntersectedSprite && lastIntersectedSprite !== meshSprite) {
          unhighlightSprite(lastIntersectedSprite)
        }

        currentIntersectedSprite = meshSprite
        lastIntersectedSprite = meshSprite
        waterDataRecord.value = userData

        highlightSprite(meshSprite)

        nextTick(() => {
          if (waterDataRecord.value) {
            updateTooltipPosition(meshSprite)
          }
        })
      }

      renderer.domElement.style.cursor = 'pointer'
    } else {
      if (currentIntersectedSprite) {
        unhighlightSprite(currentIntersectedSprite)
        currentIntersectedSprite = null
      }

      renderer.domElement.style.cursor = 'default'
      waterDataRecord.value = null
    }
  })

  // 点击事件 - 显示详情面板
  canvas.addEventListener('click', (ev) => {
    const rect = canvas.getBoundingClientRect()
    const mouseXInCanvas = ev.clientX - rect.left
    const mouseYInCanvas = ev.clientY - rect.top

    pointer.x = (mouseXInCanvas / rect.width) * 2 - 1
    pointer.y = -(mouseYInCanvas / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(markSprites)

    if (intersects.length > 0) {
      const intersect = intersects[0]
      const meshSprite = intersect!.object as Sprite
      const userData = meshSprite.userData as TooltipRecord

      // 如果点击的是同一个sprite，关闭面板；否则打开新面板
      if (clickedSprite === meshSprite && showDetailPanel.value) {
        handleClosePanel()
      } else {
        clickedSprite = meshSprite
        selectedData.value = userData
        showDetailPanel.value = true

        // 打开详情面板时禁用自动环绕
        disableAutoRotate()

        // 高亮选中的sprite
        if (lastIntersectedSprite && lastIntersectedSprite !== meshSprite) {
          unhighlightSprite(lastIntersectedSprite)
        }
        highlightSprite(meshSprite)
        lastIntersectedSprite = meshSprite

        // 获取对应的水池mesh并开始相机动画
        const waterMesh = (meshSprite.userData as any).waterMesh as Mesh
        if (waterMesh) {
          animateCameraToPool(waterMesh)
        }

        // 更新面板位置
        nextTick(() => {
          if (showDetailPanel.value && clickedSprite) {
            updateDetailPanelPosition(clickedSprite)
          }
        })
      }
    } else {
      // 点击空白区域，关闭面板
      if (showDetailPanel.value) {
        handleClosePanel()
      }
    }
  })

  window.addEventListener('resize', () => {
    if (currentIntersectedSprite && waterDataRecord.value && !showDetailPanel.value) {
      updateTooltipPosition(currentIntersectedSprite)
    }
    if (showDetailPanel.value && clickedSprite) {
      updateDetailPanelPosition(clickedSprite)
    }
  })
}

const loaderModel = async () => {
  try {
    const gltf = await new GLTFLoader().loadAsync('./scene.glb')
    const texture = await new EXRLoader().loadAsync('./env1k.exr')

    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = false
        if (object.name.includes('水池0')) {
          waterObjects.push(object)
        }
      }
    })

    texture.mapping = EquirectangularReflectionMapping
    scene.environment = texture
    scene.castShadow = true
    scene.add(gltf.scene)

    for (const mesh of waterObjects) {
      await createMarkPool(Math.random() > 0.5 ? info : waring, mesh)
    }
  } catch (error) {
    console.error('加载模型失败:', error)
  }
}

const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (autoRotateTimer !== null) {
    clearTimeout(autoRotateTimer)
    autoRotateTimer = null
  }
  if (renderer) {
    renderer.dispose()
  }

  const canvas = renderer?.domElement
  if (canvas) {
    canvas.removeEventListener('mousemove', () => {})
  }

  window.removeEventListener('resize', () => {})
}

onMounted(() => {
  initScene()
  animate()
  loaderModel()
  addEevent()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style lang="scss" scoped>
.model-view {
  inset: 0;
  position: fixed;

  .scene {
    position: absolute;
    inset: 0;
  }

  .tooltip {
    position: fixed;
    z-index: 999;
    pointer-events: none;
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;

    &.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .tooltip-item {
      width: 220px;
      padding: 16px;
      position: relative;
      border-top: 3px solid #ea9069;
      background-color: rgba(19, 23, 30, 0.75);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);

      .tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        h3 {
          margin: 0;
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #4caf50;
          animation: pulse 2s infinite;
        }
      }

      .tooltip-content {
        .data-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
          }

          .value {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
