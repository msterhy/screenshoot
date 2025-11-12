<template>
  <div class="header-wrapper">
    <div v-if="$slots.default" class="header-title">
      <slot></slot>
    </div>
    <div v-if="$slots.unit" class="header-unit">
      <slot name="unit"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-wrapper {
  display: flex;
  justify-content: space-between;
  .header-title {
    display: flex;
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;
    gap: 8px;
    align-items: center;
    text-shadow: 0 0 6px rgba(102, 188, 227, 0.5);
  }
}
</style>
