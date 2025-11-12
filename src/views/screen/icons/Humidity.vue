<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
    <g filter="url(#filter0_d_0_185)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28.9944 6.95893C28.9944 6.95893 28.4822 6.34961 28.2817 6.17014C28.0811 5.99066 27.8229 6.00009 27.8229 6.00009C27.4994 6.00009 27.3443 6.19138 27.3443 6.19138C27.3443 6.19138 27.035 6.51258 26.7257 6.87153C26.4165 7.23051 23.6429 10.4046 23.6429 12.1144C23.6429 13.8243 24.5996 14.8351 25.0345 15.1846C25.4694 15.5341 26.4165 16.2049 27.8229 16.2143C29.2293 16.2238 30.3208 15.4397 30.5914 15.2035C30.862 14.9674 32 13.9471 32 12.1334C32 10.3196 28.9944 6.95893 28.9944 6.95893ZM16.824 7.34626C16.356 6.90571 15.7534 6.9289 15.7534 6.9289C14.9987 6.9289 14.6366 7.39843 14.6366 7.39843C14.6366 7.39843 13.915 8.18679 13.1934 9.06789C12.4718 9.94902 6 17.7399 6 21.9367C6 26.1336 8.23243 28.6146 9.24719 29.4725C10.2619 30.3304 12.4718 31.9767 15.7534 31.9999C19.035 32.0231 21.582 30.0986 22.2134 29.5189C22.8447 28.9392 25.5 26.435 25.5 21.9831C25.5 17.5312 18.487 9.28239 18.487 9.28239C18.487 9.28239 17.2918 7.78684 16.824 7.34626ZM20.4067 25.3044C20.6518 25.8387 20.0493 26.7516 19.061 27.3432C18.0726 27.9349 17.0727 27.9813 16.8277 27.4469C16.5826 26.9127 17.185 25.9999 18.1734 25.4082C19.1617 24.8166 20.1616 24.77 20.4067 25.3044Z"
        :fill="color || '#F6C2C0'"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_0_185"
        x="0"
        y="0"
        width="38"
        height="38.0001"
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
        <feGaussianBlur stdDeviation="3" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_185" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_185" result="shape" />
      </filter>
    </defs>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ color?: string }>()
</script>
