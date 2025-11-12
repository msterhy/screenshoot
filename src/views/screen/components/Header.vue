<template>
  <header class="header-view">
    <div class="title">
      <span class="time">12:00:00</span>
      <span class="year">2025/10/10</span>
    </div>
  </header>
  <div class="shadow"></div>
</template>

<style lang="scss" scoped>
.header-view {
  top: 0;
  width: 100%;
  height: 96px;
  z-index: 1;
  position: absolute;
  background-color: #2d3640;
  background-image: url('@/assets/screen/header-bg.png');
  .time {
    font-size: 32px;
    font-weight: 400;
    margin-right: 10px;
    color: var(--ds-text-color);
  }
  .year {
    margin-top: 11px;
    display: inline-block;
  }
  .title {
    top: 28px;
    right: 31px;
    position: absolute;
  }
}
.shadow {
  top: 93px;
  width: 100%;
  height: 24px;
  opacity: 0.6;
  position: fixed;
  background-color: #000;
  filter: blur(27.182817459106445px);
}
</style>
