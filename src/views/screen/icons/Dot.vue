<template>
  <div class="dot">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <g :filter="shadow ? 'url(#filter0_d_0_176)' : ''">
        <circle cx="14" cy="14" r="6" :fill="color || '#6AD67E'" />
      </g>
      <defs>
        <filter
          id="filter0_d_0_176"
          x="0"
          y="0"
          width="28"
          height="28"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.415686 0 0 0 0 0.839216 0 0 0 0 0.494118 0 0 0 0.5 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_176" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_176" result="shape" />
        </filter>
      </defs>
    </svg>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ color?: string; shadow?: boolean }>()
</script>
