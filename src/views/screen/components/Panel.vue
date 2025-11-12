<template>
  <div
    :style="{
      borderTopColor: borderTopColor || '#66BCE3',
    }"
    class="panel"
  >
    <div class="panel-header">
      <slot name="header"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  borderTopColor?: string
}>()
</script>

<style scoped lang="scss">
.panel {
  border-top: 2px solid;
  background-color: rgba(19, 23, 30, 0.75);
}
</style>
