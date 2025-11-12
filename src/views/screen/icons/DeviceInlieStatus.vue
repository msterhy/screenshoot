<template>
  <span class="device-status"></span>
</template>

<script setup lang="ts">
defineProps<{ inline?: boolean }>()
</script>

<style scoped lang="scss">
.device-status {
  width: 16px;
  height: 16px;
  position: relative;
  display: inline-block;
  background-color: #66bce3;
  opacity: 0.2;
  border-radius: 50px;
  &::after {
    position: absolute;
  }
}
</style>
