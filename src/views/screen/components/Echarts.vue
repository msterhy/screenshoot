<template>
  <div ref="container" class="echart-container"></div>
</template>

<script setup lang="ts">
import { init, use, type EChartsType } from 'echarts'
import { onMounted, shallowRef, useTemplateRef, watchEffect } from 'vue'

interface EchartProps {
  resize?: boolean
  loading?: boolean
  option?: echarts.EChartsOption
}
let chart: EChartsType

const container = useTemplateRef('container')

const props = defineProps<EchartProps>()

const createChart = () => {
  chart = init(container.value)
  chart.setOption(props.option || {})
}

onMounted(() => {
  createChart()
})
</script>

<style>
.echart-container {
  width: 100%;
  height: 100%;
}
</style>
