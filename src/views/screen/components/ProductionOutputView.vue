<script setup lang="ts">
import Echarts from './Echarts.vue'

const data = [
  {
    name: '鲈鱼',
    value: 640,
    itemStyle: {
      color: '#AEDDFB',
    },
  },
  {
    name: '鳜鱼',
    value: 220,
    itemStyle: {
      color: '#FFE686',
    },
  },
  {
    name: '对虾',
    value: 120,
    itemStyle: {
      color: '#66BCE3',
    },
  },
]

const option: echarts.EChartsOption = {
  grid: {
    top: '0%',
    right: '0%',
    left: '0%',
    bottom: '0%',
  },
  series: {
    type: 'pie',
    label: {
      show: false,
    },
    radius: [55, 40],
    data: data,
  },
}
</script>

<template>
  <div class="output-vis">
    <Echarts :option="option" />
    <div class="record">
      <div class="row" v-for="item in data">
        <div style="font-size: 18px">
          <span style="margin-left: 23px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <circle cx="6" cy="6" r="4.5" :stroke="item.itemStyle.color" stroke-width="3" />
            </svg>
            <span>{{ item.name }}</span>
          </span>
          <span style="margin: 0px 56px 0px 67px">{{ item.value }}</span>
          <span>{{ item.value }} %</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="304"
          height="9"
          viewBox="0 0 304 9"
          fill="none"
        >
          <path
            opacity="0.6"
            d="M0.33218 0.373657L9.33218 8.37366H303.332"
            stroke="url(#paint0_linear_0_308)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_0_308"
              x1="303.332"
              y1="4.37366"
              x2="0.33218"
              y2="4.37366"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#B2C1D0" stop-opacity="0.01" />
              <stop offset="1" stop-color="#7B8DA3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>
  <div class="output-category">
    <span
      v-for="value in data"
      class="category-item"
      :style="{ backgroundColor: value.itemStyle.color }"
    />
  </div>
</template>

<style scoped lang="scss">
.output-vis {
  width: 100%;
  height: 152px;
  display: grid;
  column-gap: 32px;
  margin-bottom: 12px;
  margin-top: 24px;
  grid-template-columns: 152px 1fr;
  .chart {
    width: 152px;
    height: 152px;
  }
}
.output-category {
  gap: 8px;
  display: flex;
  justify-content: center;
  .category-item {
    width: 8px;
    height: 8px;
    background-color: #aeddfb;
  }
}
</style>
