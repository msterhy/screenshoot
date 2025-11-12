<template>
  <section class="model-view">
    <div class="scene" ref="container"></div>
    <div class="tooltip" ref="tooltip-container" :class="{ visible: waterDataRecord }">
      <div class="tooltip-item" v-if="waterDataRecord" ref="tooltipElement">
        <div class="tooltip-header">
          <h3>{{ waterDataRecord.name }}</h3>
          <div class="status-indicator"></div>
        </div>
        <div class="tooltip-content">
          <div class="data-row">
            <span class="label">DO:</span>
            <span class="value">{{ waterDataRecord.DO }}</span>
          </div>
          <div class="data-row">
            <span class="label">HT:</span>
            <span class="value">{{ waterDataRecord.HT }}</span>
          </div>
          <div class="data-row">
            <span class="label">PH:</span>
            <span class="value">{{ waterDataRecord.PH }}</span>
          </div>
        </div>
      </div>
    </div>
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
} from 'three'
import info from '@/assets/screen/info.png'
import waring from '@/assets/screen/waring.png'
import { onMounted, ref, useTemplateRef, onUnmounted, nextTick } from 'vue'
import { EXRLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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

// Three.js 变量
let scene: Scene
let renderer: WebGLRenderer
let controls: OrbitControls
let camera: PerspectiveCamera
const cameraPoistion = new Vector3(6, 2, 3.5)
const cameraRotation = new Euler(0, 0, 0)
const raycaster = new Raycaster()
const pointer = new Vector2()

// 数据
const markSprites: Sprite[] = []
const waterObjects: Mesh[] = []
const waterDataRecord = ref<TooltipRecord | null>(null)
let animationId: number
let currentIntersectedSprite: Sprite | null = null

// 初始化开发工具
const initDevTools = () => {
  // const gui = new GUI()
  // 可以添加一些调试控件
}

// 初始化场景
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

  container.value.appendChild(renderer.domElement)
}

// 动画循环
const animate = () => {
  if (container.value) {
    const { clientWidth, clientHeight } = container.value
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.render(scene, camera)

    // 如果当前有选中的标记点，更新提示框位置
    if (currentIntersectedSprite && waterDataRecord.value) {
      updateTooltipPosition(currentIntersectedSprite)
    }

    animationId = requestAnimationFrame(animate)
  }
}

// 创建标记点
const createMarkPool = async (url: string, mesh: Mesh) => {
  try {
    const texture = await new TextureLoader().loadAsync(url)
    const spriteMaterial = new SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.85,
    })
    const sprite = new Sprite(spriteMaterial)
    sprite.scale.set(0.2, 0.2, 0.2)
    sprite.position.copy(new Vector3(mesh.position.x, 1, mesh.position.z))

    // 为标记点添加用户数据
    sprite.userData = {
      name: mesh.name,
      DO: `${(Math.random() * 20).toFixed(2)} mg/L`,
      HT: `${(Math.random() * 100).toFixed(2)} °C`,
      PH: `${(Math.random() * 20).toFixed(2)}`,
    }

    scene.add(sprite)
    markSprites.push(sprite)
  } catch (error) {
    console.error('创建标记点失败:', error)
  }
}

// 更新提示框位置
const updateTooltipPosition = (sprite: Sprite) => {
  if (!tooltipContainer.value || !tooltipElement.value) return

  // 获取标记点的世界坐标
  const worldPosition = new Vector3()
  sprite.getWorldPosition(worldPosition)

  // 将3D世界坐标转换为屏幕坐标
  worldPosition.project(camera)

  const x = (worldPosition.x * 0.5 + 0.5) * window.innerWidth
  const y = (1 - (worldPosition.y * 0.5 + 0.5)) * window.innerHeight

  // 获取提示框尺寸
  const tooltipRect = tooltipElement.value.getBoundingClientRect()
  const tooltipWidth = tooltipRect.width
  const tooltipHeight = tooltipRect.height

  // 计算最终位置，确保提示框不会超出屏幕
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

// 添加鼠标事件
const addEevent = () => {
  const canvas = renderer.domElement

  canvas.addEventListener('mousemove', (ev) => {
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

      // 如果选中的标记点发生变化
      if (currentIntersectedSprite !== meshSprite) {
        currentIntersectedSprite = meshSprite
        waterDataRecord.value = userData

        // 等待下一帧确保DOM已更新
        nextTick(() => {
          if (waterDataRecord.value) {
            updateTooltipPosition(meshSprite)
          }
        })
      }

      renderer.domElement.style.cursor = 'pointer'
    } else {
      renderer.domElement.style.cursor = 'default'
      waterDataRecord.value = null
      currentIntersectedSprite = null
    }
  })

  // 窗口大小变化时重新定位提示框
  window.addEventListener('resize', () => {
    if (currentIntersectedSprite && waterDataRecord.value) {
      updateTooltipPosition(currentIntersectedSprite)
    }
  })
}

// 加载模型
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

    // 为每个水池对象创建标记点
    for (const mesh of waterObjects) {
      await createMarkPool(Math.random() > 0.5 ? info : waring, mesh)
    }
  } catch (error) {
    console.error('加载模型失败:', error)
  }
}

// 清理资源
const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  if (renderer) {
    renderer.dispose()
  }

  // 移除事件监听器
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
  initDevTools()
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
      background-color: rgba(19, 23, 30, 0.95);
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
