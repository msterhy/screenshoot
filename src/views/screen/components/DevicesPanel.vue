<template>
  <section class="device-panels">
    <!-- 环境面板 -->
    <div class="devices-environment">
      <Panel class="device-panel">
        <template #header>
          <div class="device-header">
            <Temperature />
            <Dot />
          </div>
        </template>
        <div class="device-text">
          <span class="device-value">{{ temperature }}</span>
          <span class="device-unit">℃</span>
        </div>
        <div>环境温度</div>
      </Panel>
      <Panel border-top-color="var(--ds-waring-border-color)" class="device-panel device-waring">
        <template #header>
          <div class="device-header">
            <Humidity />
            <Dot color="var(--ds-waring)" />
          </div>
        </template>
        <div class="device-text">
          <span style="color: var(--ds-waring)" class="device-value">{{ humidity }}</span>
          <span class="device-unit">%</span>
        </div>
        <div>环境湿度</div>
      </Panel>
      <Panel class="device-panel">
        <template #header>
          <div class="device-header">
            <Illumination />
            <Dot />
          </div>
        </template>
        <div class="device-text">
          <span class="device-value">{{ illumination }}</span>
          <span class="device-unit">Lux</span>
        </div>
        <div>照度</div>
      </Panel>
    </div>
    <Panel class="device-record device-common">
      <template #header>
        <PanelHeader>
          <DeviceRecord />
          <span>设备统计</span>
        </PanelHeader>
        <div class="device-record-row">
          <div class="device-record-left">
            <DeviceCamera />
            <div>
              <div>监控探头</div>
              <div class="device-value">24</div>
            </div>
          </div>
          <div class="device-record-right">
            <div class="device-cell">
              <div class="device-statu">在线</div>
              <div class="device-value">23</div>
            </div>
            <div class="device-cell">
              <div class="device-statu unline">离线</div>
              <div class="device-value">1</div>
            </div>
          </div>
        </div>
        <div class="device-record-row">
          <div class="device-record-left">
            <DeviceSensor />
            <div>
              <div>传感器<span style="user-select: none; color: transparent">头</span></div>
              <div class="device-value">100</div>
            </div>
          </div>
          <div class="device-record-right">
            <div class="device-cell">
              <div class="device-statu">在线</div>
              <div class="device-value">88</div>
            </div>
            <div class="device-cell">
              <div class="device-statu unline">离线</div>
              <div>12</div>
            </div>
          </div>
        </div>
      </template>
    </Panel>
    <Panel class="device-waring device-common">
      <PanelHeader>
        <DeviceWaring />
        <span>设备预警</span>
      </PanelHeader>
      <ElScrollbar ref="scrollbarRef" height="230px" style="margin-top: 24px" always>
        <div class="scroll-content">
          <MessageItem v-bind="message" v-for="message in displayMessages" :key="message.title + message.time" />
        </div>
      </ElScrollbar>
    </Panel>
  </section>
</template>
<script setup lang="ts">
import Panel from './Panel.vue'
import Dot from '../icons/Dot.vue'
import PanelHeader from './PanelHeader.vue'
import Humidity from '../icons/Humidity.vue'
import Temperature from '../icons/Temperature.vue'
import DeviceWaring from '../icons/DeviceWaring.vue'
import Illumination from '../icons/Illumination.vue'
import DeviceRecord from '../icons/DeviceRecord.vue'
import DeviceCamera from '../icons/DeviceCamera.vue'
import DeviceSensor from '../icons/DeviceSensor.vue'
import { ElScrollbar } from 'element-plus'
import MessageItem from './MessageItem.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { MessageStatus, type IMessage } from './types'

// 环境数据
const temperature = ref(24)
const humidity = ref(88)
const illumination = ref(12800)

const messages = ref<IMessage[]>([
  {
    time: '10/10 10:11',
    status: MessageStatus.info,
    title: '预警1',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum error omnis harum aut facere fugit laborum velit cumque tempora, adipisci suscipit, enim dicta est natus labore? Error odit aperiam culpa.',
  },
  {
    time: '10/10 10:12',
    status: MessageStatus.waring,
    title: '预警2',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum error omnis harum aut facere fugit laborum velit cumque tempora, adipisci suscipit, enim dicta est natus labore? Error odit aperiam culpa.',
  },
  {
    time: '10/10 10:13',
    status: MessageStatus.waring,
    title: '预警3',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum error omnis harum aut facere fugit laborum velit cumque tempora, adipisci suscipit, enim dicta est natus labore? Error odit aperiam culpa.',
  },
  {
    time: '10/10 10:14',
    status: MessageStatus.waring,
    title: '预警4',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum error omnis harum aut facere fugit laborum velit cumque tempora, adipisci suscipit, enim dicta est natus labore? Error odit aperiam culpa.',
  },
  {
    time: '10/10 10:15',
    status: MessageStatus.info,
    title: '预警5',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum error omnis harum aut facere fugit laborum velit cumque tempora, adipisci suscipit, enim dicta est natus labore? Error odit aperiam culpa.',
  },
  {
    time: '10/10 10:16',
    status: MessageStatus.waring,
    title: '预警6',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum error omnis harum aut facere fugit laborum velit cumque tempora, adipisci suscipit, enim dicta est natus labore? Error odit aperiam culpa.',
  },
])

// 用于显示的重复消息列表，实现无缝滚动
const displayMessages = computed(() => {
  return [...messages.value, ...messages.value]
})

// 添加自动滚动功能
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
let scrollInterval: number | null = null
let scrollStep = 1

const startAutoScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }

  scrollInterval = setInterval(() => {
    if (scrollbarRef.value) {
      const scrollContainer = scrollbarRef.value.$el.querySelector('.el-scrollbar__wrap')
      if (scrollContainer) {
        const scrollHeight = scrollContainer.scrollHeight
        const clientHeight = scrollContainer.clientHeight
        const maxScrollTop = scrollHeight - clientHeight

        // 实现连续滚动效果
        if (scrollContainer.scrollTop >= maxScrollTop / 2) {
          // 滚动到一半时回到顶部，实现无缝循环
          scrollContainer.scrollTop = 0
        } else {
          // 平滑向下滚动
          scrollContainer.scrollTop += scrollStep
        }
      }
    }
  }, 50) // 更频繁的滚动间隔，实现平滑效果
}

// 更新环境数据的函数
const updateEnvironmentData = () => {
  // 温度在 20-30 度之间随机变化
  temperature.value = Math.round(20 + Math.random() * 10)
  // 湿度在 40-95 之间随机变化
  humidity.value = Math.round(40 + Math.random() * 55)
  // 照度在 10000-15000 之间随机变化
  illumination.value = Math.round(10000 + Math.random() * 5000)
}

onMounted(() => {
  // 组件挂载后开始自动滚动
  startAutoScroll()

  // 开始环境数据更新
  const dataUpdateInterval = setInterval(updateEnvironmentData, 3000) // 每3秒更新一次数据
})

onUnmounted(() => {
  // 组件卸载时清除定时器
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
})
</script>

<style lang="scss" scoped>
.device-panels {
  z-index: 1;
  right: 32px;
  top: 152px;
  height: 888px;
  position: fixed;
  .devices-environment {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    .device-panel {
      width: 170px;
      height: 176px;
      padding: 32px 24px;
      padding-right: 14px;
      .device-header {
        display: flex;
        margin-bottom: 16px;
        justify-content: space-between;
      }
      &.device-waring {
        .device-text {
          color: var(--ds-waring);
        }
      }

      .device-text {
        margin-bottom: 5px;
        color: var(--ds-text-blue-color);
        .device-value {
          font-size: 24px;
          display: inline-block;
          margin-right: 5px;
        }
        .device-unit {
          font-size: 16px;
        }
      }
    }
  }

  .device-value {
    color: var(--ds-text-blue-color);
    font-size: 24px;
  }
  .f-24 {
    font-size: 24px;
  }
  .device-statu {
    position: relative;
    --color: #66bce3;
    &.unline {
      --color: #7b8da3;
    }
    &::before {
      position: absolute;
      top: 50%;
      content: '';
      width: 16px;
      height: 16px;
      border-radius: 50%;
      transform: translate(-1em, -50%);
      background-color: var(--color);
      opacity: 0.2;
    }
    &::after {
      position: absolute;
      content: '';
      width: 10px;
      height: 10px;
      top: 50%;
      border-radius: 50%;
      transform: translate(-2.85em, -50%);
      background-color: var(--color);
    }
  }
  .device-record {
    height: 280px;
    margin-bottom: 12px;
    .device-record-row {
      display: flex;
      margin-top: 24px;
      gap: 40px;
      .device-record-left {
        gap: 16px;
        display: flex;
      }
      .device-record-right {
        gap: 91px;
        height: 72px;
        display: flex;
        flex: 0 0 288px;
        min-width: 288px;
        position: relative;
        padding-top: 6px;
        padding-left: 44px;
        padding-right: 44px;
        padding-bottom: 5px;
        &::before {
          content: '';
          inset: 0;
          opacity: 0.12;
          position: absolute;
          background: linear-gradient(180deg, #7b8da3 0%, rgba(178, 193, 208, 0) 100%);
        }
        &::after {
          top: 50%;
          left: 45%;
          z-index: 1;
          content: '';
          position: absolute;
          transform: translate(-50%, -50%);
          height: 32px;
          width: 1px;
          opacity: 0.2;
          background-color: #7b8da3;
        }
        .device-cell {
          row-gap: 5px;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }

  .device-waring {
    height: 340px;
  }
  .device-common {
    padding: 24px 24px 32px 24px;
  }
}

// 添加滚动内容的样式
.scroll-content {
  transition: transform 0.3s ease;
}
</style>
