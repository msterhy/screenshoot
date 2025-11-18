<script setup lang="ts">
import Panel from './Panel.vue'
import Echarts from './Echarts.vue'
import PanelHeader from './PanelHeader.vue'
import ProductionOutputIcon from '../icons/ProductionOutputIcon.vue'
import ProductionValueIcon from '../icons/ProductionValueIcon.vue'
import FeedingRateIcon from '../icons/FeedingRateIcon.vue'
import SurvivalRateIcon from '../icons/SurvivalRateIcon.vue'
import ProductionOutputView from './ProductionOutputView.vue'
import { graphic } from 'echarts'
import FeedingRateView from './FeedingRateView.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const splitLine = {
  show: true,
  lineStyle: {
    color: '#7B8DA3',
  },
}

const axisLabel = {
  fontSize: 16,
  color: '#B8CCE2',
}

// 响应式数据
const productionValues = ref([
  {
    name: '2020',
    value: 135,
  },
  {
    name: '2021',
    value: 150,
  },
  {
    name: '2022',
    value: 140,
  },
  {
    name: '2023',
    value: 145,
  },
  {
    name: '2024',
    value: 165,
  },
  {
    name: '2025',
    value: 125,
  },
])

const productionValueOption: echarts.EChartsOption = {
  xAxis: {
    type: 'category',
    splitLine,
    axisLabel,
    data: productionValues.value.map((d) => d.name),
  },
  grid: {
    top: '5%',
    left: '8%',
    right: '8%',
  },
  tooltip: {
    trigger: 'axis',
    transitionDuration: 0, // 避免tooltip动画影响
  },
  yAxis: {
    interval: 100,
    splitLine,
    axisLabel,
    max: 200,
  },
  animation: true,
  animationDuration: 1200,
  animationEasing: 'cubicOut', // 改为更平滑的缓动函数
  animationDelay: function (idx) {
    return idx * 150; // 增加延迟时间让动画更明显
  },
  series: {
    type: 'bar',
    barWidth: 8,
    itemStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(159, 243, 174, 1)',
        },
        {
          offset: 1,
          color: 'rgba(102, 188, 227, 1)',
        },
      ]),
      borderRadius: [4, 4, 0, 0],
    },
    emphasis: {
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(159, 243, 174, 0.8)',
          },
          {
            offset: 1,
            color: 'rgba(102, 188, 227, 0.8)',
          },
        ]),
        shadowColor: 'rgba(102, 188, 227, 0.5)',
        shadowBlur: 10,
      }
    },
    data: productionValues.value,
  },
}

const feedingData = ref([
  {
    name: '2020',
    value: 110,
  },
  {
    name: '2021',
    value: 125,
  },
  {
    name: '2022',
    value: 150,
  },
  {
    name: '2023',
    value: 165,
  },
  {
    name: '2024',
    value: 175,
  },
  {
    name: '2025',
    value: 150,
  },
])

const feedingOption: echarts.EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
    splitLine,
    axisLabel,
    data: feedingData.value.map((d) => d.name),
  },
  tooltip: {
    trigger: 'axis',
    transitionDuration: 0,
  },
  yAxis: {
    axisLabel: {
      ...axisLabel,
      show: false,
    },
    splitLine,
    axisLine: {
      show: false,
    },
    interval: 50,
  },
  grid: {
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '8%',
  },
  animation: true,
  animationDuration: 1800, // 延长动画时间
  animationEasing: 'cubicInOut', // 更平滑的缓动
  series: {
    type: 'line',
    smooth: true,
    areaStyle: {},
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 1,
        color: 'rgba(159, 223, 243, 0)',
      },
      {
        offset: 0,
        color: 'rgba(102, 188, 227, 1)',
      },
    ]),
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: 3,
    },
    emphasis: {
      lineStyle: {
        width: 4,
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 1,
            color: 'rgba(159, 223, 243, 0.2)',
          },
          {
            offset: 0,
            color: 'rgba(102, 188, 227, 0.5)',
          },
        ]),
      }
    },
    data: feedingData.value,
  },
}

const survivalData = ref([
  {
    name: '2020',
    value: 55,
  },
  {
    name: '2021',
    value: 65,
  },
  {
    name: '2022',
    value: 75,
  },
  {
    name: '2023',
    value: 85,
  },
  {
    name: '2024',
    value: 95,
  },
  {
    name: '2025',
    value: 90,
  },
])

const survivalOption: echarts.EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
    splitLine,
    axisLabel,
    data: survivalData.value.map((d) => d.name),
  },
  tooltip: {
    trigger: 'axis',
    transitionDuration: 0,
  },
  yAxis: {
    axisLabel: {
      ...axisLabel,
    },
    splitLine,
    axisLine: {},
    interval: 50,
  },
  grid: {
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '0%',
  },
  animation: true,
  animationDuration: 1800,
  animationEasing: 'cubicInOut',
  series: {
    type: 'line',
    smooth: true,
    areaStyle: {},
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 1,
        color: 'rgba(79, 222, 187, 0)',
      },
      {
        offset: 0,
        color: 'rgba(79, 222, 187, 1)',
      },
    ]),
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: 3,
    },
    emphasis: {
      lineStyle: {
        width: 4,
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 1,
            color: 'rgba(79, 222, 187, 0.2)',
          },
          {
            offset: 0,
            color: 'rgba(79, 222, 187, 0.5)',
          },
        ]),
      }
    },
    data: survivalData.value,
  },
}

// 定时器引用
let animationInterval: number | null = null

// 平滑数据变化函数
const smoothDataChange = (currentData: any[], newData: any[]) => {
  return currentData.map((item, index) => ({
    ...item,
    value: newData[index].value
  }));
}

// 生成更自然的随机数据
const generateNaturalData = (baseData: any[], maxChange: number, minValue: number, maxValue: number) => {
  return baseData.map(item => {
    // 使用更小的变化幅度，让数据变化更自然
    const change = (Math.random() - 0.5) * maxChange;
    const newValue = Math.max(minValue, Math.min(maxValue, item.value + change));

    return {
      ...item,
      value: Math.round(newValue * 10) / 10 // 保留一位小数，让变化更平滑
    };
  });
}

// 自动变化函数
const startAutoAnimation = () => {
  let animationCount = 0;

  animationInterval = window.setInterval(() => {
    animationCount++;

    // 每3次循环改变一次数据，避免变化太频繁
    if (animationCount % 3 === 0) {
      // 平滑更新产值数据
      const newProductionValues = generateNaturalData(productionValues.value, 15, 80, 200);
      productionValues.value = smoothDataChange(productionValues.value, newProductionValues);

      // 平滑更新饲料投喂效率数据
      const newFeedingData = generateNaturalData(feedingData.value, 12, 80, 200);
      feedingData.value = smoothDataChange(feedingData.value, newFeedingData);

      // 平滑更新成活率数据
      const newSurvivalData = generateNaturalData(survivalData.value, 8, 40, 100);
      survivalData.value = smoothDataChange(survivalData.value, newSurvivalData);

      // 触发响应式更新
      productionValues.value = [...productionValues.value];
      feedingData.value = [...feedingData.value];
      survivalData.value = [...survivalData.value];
    }

  }, 2000); // 每2秒检查一次，但实际数据变化频率较低
}

// 渐变色呼吸效果
const createBreathingGradient = (baseColor: string) => {
  const timestamp = Date.now() / 1000;
  const intensity = 0.5 + 0.3 * Math.sin(timestamp * 2); // 呼吸效果

  return new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: `rgba(159, 243, 174, ${intensity})`,
    },
    {
      offset: 1,
      color: `rgba(102, 188, 227, ${intensity})`,
    },
  ]);
}

// 组件挂载时启动动画
onMounted(() => {
  startAutoAnimation();
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval);
  }
})
</script>

<template>
  <div class="charts">
    <Panel class="chart output">
      <template #header>
        <PanelHeader>
          <ProductionOutputIcon />
          <span>产量</span>
          <template #unit>
            <span>* 公斤</span>
          </template>
        </PanelHeader>
      </template>
      <ProductionOutputView />
    </Panel>
    <Panel class="chart output">
      <template #header>
        <PanelHeader>
          <ProductionValueIcon />
          <span>产值</span>
          <template #unit>
            <span>元</span>
          </template>
        </PanelHeader>
      </template>
      <Echarts
        style="margin-top: 24px"
        :key="`production-${productionValues.map(d => d.value).join('-')}`"
        :option="{
          ...productionValueOption,
          xAxis: {
            ...productionValueOption.xAxis,
            data: productionValues.map(d => d.name)
          },
          series: {
            ...productionValueOption.series,
            data: productionValues
          }
        }"
      />
    </Panel>
    <Panel class="chart">
      <template #header>
        <PanelHeader>
          <FeedingRateIcon />
          <span>饲料投喂效率</span>
          <template #unit>
            <span>元</span>
          </template>
        </PanelHeader>
      </template>
      <FeedingRateView
        :key="`feeding-${feedingData.map(d => d.value).join('-')}`"
        :option="{
          ...feedingOption,
          xAxis: {
            ...feedingOption.xAxis,
            data: feedingData.map(d => d.name)
          },
          series: {
            ...feedingOption.series,
            data: feedingData
          }
        }"
      />
    </Panel>
    <Panel class="chart">
      <template #header>
        <PanelHeader>
          <SurvivalRateIcon />
          <span>成活率</span>
          <template #unit>
            <span>%</span>
          </template>
        </PanelHeader>
      </template>
      <Echarts
        style="width: 470px; height: 160px; margin-top: 24px"
        :key="`survival-${survivalData.map(d => d.value).join('-')}`"
        :option="{
          ...survivalOption,
          xAxis: {
            ...survivalOption.xAxis,
            data: survivalData.map(d => d.name)
          },
          series: {
            ...survivalOption.series,
            data: survivalData
          }
        }"
      />
    </Panel>
  </div>
</template>

<style scoped lang="scss">
.charts {
  gap: 12px;
  left: 32px;
  right: 32px;
  bottom: 32px;
  height: 264px;
  max-height: 264px;
  display: grid;
  grid-template-columns: 535px 535px 535px 535px;
  position: fixed;

  .chart {
    width: 535px;
    height: 264px;
    padding: 16px 24px;

    // 添加悬停效果
    &:hover {
      transform: translateY(-2px);
      transition: transform 0.3s ease;
    }

    // 添加呼吸动画效果
    :deep(.echarts) {
      animation: breathe 4s ease-in-out infinite;
    }
  }
}

@keyframes breathe {
  0%, 100% {
    opacity: 0.95;
  }
  50% {
    opacity: 1;
  }
}
</style>
