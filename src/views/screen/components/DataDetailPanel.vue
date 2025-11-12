<template>
  <div class="data-detail-panel" ref="panelRef" :class="{ visible: visible }">
    <div class="panel-header">
      <h3>{{ data?.name || '数据详情' }}</h3>
      <div class="header-actions">
        <button class="back-btn" @click="handleBack" title="返回全景视图">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button class="close-btn" @click="handleClose" title="关闭">×</button>
      </div>
    </div>
    
    <div class="panel-content">
      <!-- 数据表格 -->
      <div class="data-table-section">
        <h4 class="section-title">实时数据</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>指标</th>
              <th>数值</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>水氧溶 (DO)</td>
              <td>{{ data?.DO || '-' }}</td>
              <td>
                <span class="status-badge normal">正常</span>
              </td>
            </tr>
            <tr>
              <td>水温度 (HT)</td>
              <td>{{ data?.HT || '-' }}</td>
              <td>
                <span class="status-badge normal">正常</span>
              </td>
            </tr>
            <tr>
              <td>水PH值</td>
              <td>{{ data?.PH || '-' }}</td>
              <td>
                <span class="status-badge normal">正常</span>
              </td>
            </tr>
            <tr v-for="item in additionalData" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.value }}</td>
              <td>
                <span :class="['status-badge', item.status]">{{ item.statusText }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 图表区域 -->
      <div class="chart-section">
        <h4 class="section-title">历史趋势</h4>
        <div class="charts-container">
          <div class="chart-item">
            <div class="chart-label">水氧溶趋势</div>
            <Echarts :option="doChartOption" class="mini-chart" />
          </div>
          <div class="chart-item">
            <div class="chart-label">温度趋势</div>
            <Echarts :option="tempChartOption" class="mini-chart" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import Echarts from './Echarts.vue'

interface TooltipRecord {
  DO: string
  HT: string
  PH: string
  name: string
}

interface AdditionalDataItem {
  label: string
  value: string
  status: 'normal' | 'warning' | 'danger'
  statusText: string
}

const props = defineProps<{
  data: TooltipRecord | null
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  back: []
}>()

const panelRef = ref<HTMLElement>()

// 模拟额外数据
const additionalData = computed<AdditionalDataItem[]>(() => {
  if (!props.data) return []
  return [
    {
      label: '氨氮含量',
      value: `${(Math.random() * 5).toFixed(2)} mg/L`,
      status: 'normal',
      statusText: '正常',
    },
    {
      label: '浊度',
      value: `${(Math.random() * 10).toFixed(2)} NTU`,
      status: 'normal',
      statusText: '正常',
    },
    {
      label: '电导率',
      value: `${(Math.random() * 500 + 100).toFixed(2)} μS/cm`,
      status: 'normal',
      statusText: '正常',
    },
  ]
})

// 生成模拟历史数据
const generateHistoryData = (baseValue: number, count: number = 12) => {
  return Array.from({ length: count }, (_, i) => {
    const variation = (Math.random() - 0.5) * baseValue * 0.2
    return {
      name: `${i + 1}月`,
      value: Math.max(0, baseValue + variation),
    }
  })
}

// DO图表配置
const doChartOption = computed<echarts.EChartsOption>(() => {
  const doValue = props.data?.DO ? parseFloat(props.data.DO.replace(' mg/L', '')) : 10
  const historyData = generateHistoryData(doValue)
  
  return {
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.name),
      axisLabel: {
        fontSize: 10,
        color: '#B8CCE2',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#7B8DA3',
          opacity: 0.3,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: '#B8CCE2',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#7B8DA3',
          opacity: 0.3,
        },
      },
    },
    grid: {
      top: '10%',
      left: '10%',
      right: '10%',
      bottom: '15%',
    },
    series: [
      {
        type: 'line',
        data: historyData.map((d) => d.value),
        smooth: true,
        lineStyle: {
          color: '#66BCE3',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(102, 188, 227, 0.3)' },
              { offset: 1, color: 'rgba(102, 188, 227, 0)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 4,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  }
})

// 温度图表配置
const tempChartOption = computed<echarts.EChartsOption>(() => {
  const tempValue = props.data?.HT ? parseFloat(props.data.HT.replace(' °C', '')) : 25
  const historyData = generateHistoryData(tempValue)
  
  return {
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.name),
      axisLabel: {
        fontSize: 10,
        color: '#B8CCE2',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#7B8DA3',
          opacity: 0.3,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: '#B8CCE2',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#7B8DA3',
          opacity: 0.3,
        },
      },
    },
    grid: {
      top: '10%',
      left: '10%',
      right: '10%',
      bottom: '15%',
    },
    series: [
      {
        type: 'line',
        data: historyData.map((d) => d.value),
        smooth: true,
        lineStyle: {
          color: '#9FF3AE',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(159, 243, 174, 0.3)' },
              { offset: 1, color: 'rgba(159, 243, 174, 0)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 4,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  }
})

const handleClose = () => {
  emit('close')
}

const handleBack = () => {
  emit('back')
}

// 监听visible变化，更新位置
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && panelRef.value) {
      // 面板显示时的动画
      nextTick(() => {
        // 位置更新会在Scene.vue中处理
      })
    }
  },
)
</script>

<style lang="scss" scoped>
.data-detail-panel {
  position: fixed;
  z-index: 1000;
  width: 600px;
  max-height: 80vh;
  background: rgba(19, 23, 30, 0.95);
  border-top: 3px solid #66bce3;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  pointer-events: none;
  overflow: hidden;

  &.visible {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: all;
  }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      h3 {
        margin: 0;
        font-size: 18px;
        color: #fff;
        font-weight: 600;
      }

      .header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .back-btn,
      .close-btn {
        background: transparent;
        border: none;
        color: #b8cce2;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
      }

      .back-btn {
        font-size: 16px;
      }

      .close-btn {
        font-size: 28px;
      }
    }

  .panel-content {
    padding: 24px;
    max-height: calc(80vh - 80px);
    overflow-y: auto;

    .section-title {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #66bce3;
      font-weight: 600;
    }

    .data-table-section {
      margin-bottom: 32px;

      .data-table {
        width: 100%;
        border-collapse: collapse;

        thead {
          tr {
            background: rgba(102, 188, 227, 0.1);

            th {
              padding: 12px;
              text-align: left;
              font-size: 14px;
              color: #b8cce2;
              font-weight: 600;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
          }
        }

        tbody {
          tr {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            transition: background 0.2s ease;

            &:hover {
              background: rgba(255, 255, 255, 0.05);
            }

            td {
              padding: 12px;
              font-size: 14px;
              color: #fff;

              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;

                &.normal {
                  background: rgba(76, 175, 80, 0.2);
                  color: #4caf50;
                }

                &.warning {
                  background: rgba(255, 193, 7, 0.2);
                  color: #ffc107;
                }

                &.danger {
                  background: rgba(244, 67, 54, 0.2);
                  color: #f44336;
                }
              }
            }
          }
        }
      }
    }

    .chart-section {
      .charts-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        .chart-item {
          .chart-label {
            font-size: 12px;
            color: #b8cce2;
            margin-bottom: 8px;
          }

          .mini-chart {
            width: 100%;
            height: 150px;
          }
        }
      }
    }
  }

  // 滚动条样式
  .panel-content::-webkit-scrollbar {
    width: 6px;
  }

  .panel-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .panel-content::-webkit-scrollbar-thumb {
    background: rgba(102, 188, 227, 0.5);
    border-radius: 3px;

    &:hover {
      background: rgba(102, 188, 227, 0.7);
    }
  }
}
</style>

