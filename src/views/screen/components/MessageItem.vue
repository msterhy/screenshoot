<template>
  <div class="message-item">
    <div class="message-title">
      <div :class="`message-status${status === MessageStatus.info ? '' : ' waring'}`">
        {{ status === MessageStatus.info ? '一般' : '严重' }}
      </div>
      <div>
        <div class="message-item-title-text">{{ title }}</div>
        <div class="message-item-title-time">{{ time }}</div>
      </div>
    </div>
    <div class="message-content multi-line-simulate">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { MessageStatus } from './types'
defineProps<{
  time: string
  title: string
  message: string
  status: 'info' | 'waring'
}>()
</script>

<style scoped lang="scss">
.multi-line-simulate {
  /* 1. 必须：设置一个固定的高度 */
  /* 假设行高是 1.5em，3行就是 4.5em */
  line-height: 24px;
  height: 48px; /* 1.5em * 3 lines */

  /* 2. 必须：隐藏溢出的内容 */
  overflow: hidden;

  /* 3. 必须：为伪元素的绝对定位做准备 */
  position: relative;
}

.multi-line-simulate::after {
  /* 4. 在末尾添加省略号 */
  content: '...';

  /* 5. 绝对定位到右下角 */
  position: absolute;
  bottom: 0;
  right: 0;

  /* 6. （可选）添加一点内边距和背景渐变，让省略号看起来更自然 */
  padding-left: 1em;
  // background: linear-gradient(to right, transparent, white 1em);
}

.message-item {
  height: 64px;
  display: grid;
  color: #f6c2c0;
  padding: 8px 16px;
  position: relative;
  margin-bottom: 16px;
  background-color: rgba(213, 52, 52, 0.1);
  grid-template-columns: calc(96px + 12px + 48px + 24px) 275px;
  // overflow: hidden;
  .message-title {
    gap: 8px;
    gap: 12px;
    display: flex;
    align-items: center;
    .message-status {
      background-color: #ea9d42;
      border-radius: 4px;
      padding: 2px 6px;
      &.waring {
        background-color: #c92a29;
      }
    }
    .message-item-title-text {
      font-size: #ff615b;
    }
  }
}
</style>
