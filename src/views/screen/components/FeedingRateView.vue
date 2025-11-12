<template>
  <div class="feedingRateView">
    <div class="feeding-text-view">
      <div>
        <div>饲料转化率(%)</div>
        <div class="device-value">98</div>
      </div>
      <div>
        <div>投喂量(kg)</div>
        <div class="device-value">1348</div>
      </div>
    </div>
    <div class="chart-container">
      <Echarts :option="option" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Echarts from './Echarts.vue'
defineProps<{ option?: echarts.EChartsOption }>()
</script>

<style scoped lang="scss">
.feedingRateView {
  column-gap: 12px;
  display: grid;
  font-size: 18px;
  margin-top: 24px;
  grid-template-columns: 117px 358px;
  .feeding-text-view {
    width: 117px;
    display: flex;
    row-gap: 24px;
    white-space: nowrap;
    flex-direction: column;
  }
  .chart-container {
    width: 358px;
    height: 165px;
    // border: 1px solid #acf;
  }

  .device-value {
    font-size: 24px;
    color: var(--ds-text-blue-color);
  }
}
</style>
