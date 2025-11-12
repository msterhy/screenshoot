<template>
  <ScaleScreen
    :box-style="{
      fontSize: '18px',
      '--ds-info': '#6AD67E',
      '--ds-waring': '#ff615b',
      '--ds-text-color': '#B8CCE2',
      '--ds-text-blue-color': '#66BCE3',
      color: 'var(--ds-text-color)',
      backgroundImage: `url(${screenBg})`,
      // fontFamily: `Alibaba PuHuiTi`,
      '--ds-waring-border-color': '#C92A29',
    }"
    :width="2240"
    :height="1280"
  >
    <Logo />
    <Header />
    <Scene />
    <DevicePanel />
    <Charts />
  </ScaleScreen>
</template>

<script setup lang="ts">
import 'element-plus/dist/index.css'
import Logo from './components/Logo.vue'
import Scene from './components/Scene.vue'
import Charts from './components/Charts.vue'
import Header from './components/Header.vue'
import ScaleScreen from '@/components/screen'
import screenBg from '@/assets/screen/bg.png'
import DevicePanel from './components/DevicesPanel.vue'
</script>
