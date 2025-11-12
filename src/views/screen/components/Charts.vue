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

const productionValues = [
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
]

const productionValueOption: echarts.EChartsOption = {
  xAxis: {
    type: 'category',
    splitLine,
    axisLabel,
    data: productionValues.map((d) => d.name),
  },
  grid: {
    top: '5%',
    left: '8%',
    right: '8%',
  },
  tooltip: {},
  yAxis: {
    interval: 100,
    splitLine,
    axisLabel,
    max: 200,
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
    },
    data: productionValues,
  },
}

const feedingData = [
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
]

const feedingOption: echarts.EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
    splitLine,
    axisLabel,
    data: feedingData.map((d) => d.name),
  },
  tooltip: {},
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
    showSymbol: false,
    data: feedingData,
  },
}

const survivalData = [
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
]

const survivalOption: echarts.EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
    splitLine,
    axisLabel,
    data: survivalData.map((d) => d.name),
  },
  tooltip: {},
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
    showSymbol: false,
    data: survivalData,
  },
}
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
      <Echarts style="margin-top: 24px" :option="productionValueOption" />
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
      <FeedingRateView :option="feedingOption" />
    </Panel>
    <Panel class="chart">
      <template #header>
        <PanelHeader>
          <SurvivalRateIcon />
          <span>成活率</span>
          <template #unit>
            <span>元</span>
          </template>
        </PanelHeader>
      </template>
      <Echarts style="width: 470px; height: 160px; margin-top: 24px" :option="survivalOption" />
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
  }
}
</style>
