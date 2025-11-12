<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="40" viewBox="0 0 38 40" fill="none">
    <g filter="url(#filter0_d_0_154)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.0226 23.2358V15.7252C19.0226 15.2686 18.6507 14.8968 18.1941 14.8968H18.1285C17.6828 14.8968 17.3247 15.2577 17.3247 15.7006V23.2358C16.0889 23.594 15.1839 24.6986 15.1839 26.0164C15.1839 27.6268 16.5208 28.931 18.175 28.931C19.8264 28.931 21.1634 27.6241 21.1634 26.0164C21.1606 24.6986 20.2556 23.5967 19.0226 23.2358V23.2358ZM23.4217 19.9084C23.2358 19.7553 23.1265 19.5475 23.1265 19.3342V10.8421C23.1265 8.17088 20.9036 6 18.1722 6C15.4409 6 13.218 8.17088 13.218 10.8421V19.0936C13.218 19.4518 13.0704 19.7826 12.8161 19.9986C11.0253 21.5106 10 23.7061 10 26.0191C10 30.4183 13.6664 34 18.175 34C22.6835 34 26.35 30.4211 26.35 26.0191C26.3472 23.6514 25.2809 21.4231 23.4217 19.9084ZM18.1722 31.4655C15.0827 31.4655 12.5728 29.0212 12.5728 26.0164C12.5728 24.1435 13.5516 22.4211 15.1893 21.4122L15.5858 21.1688C15.7143 21.0895 15.7936 20.9474 15.7936 20.797V10.8421C15.7936 9.56801 16.8626 8.53178 18.175 8.53178C19.4874 8.53178 20.5564 9.56801 20.5564 10.8421V20.797C20.5564 20.9474 20.6357 21.0895 20.7642 21.1688L21.1606 21.4122C22.7984 22.4211 23.7744 24.1408 23.7744 26.0164C23.7717 29.0212 21.2591 31.4655 18.1722 31.4655V31.4655Z"
        :fill="color || '#B8CCE2'"
      />
    </g>
    <g filter="url(#filter1_d_0_154)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M26 8C26 7.44772 26.4477 7 27 7H31C31.5523 7 32 7.44772 32 8C32 8.55228 31.5523 9 31 9H27C26.4477 9 26 8.55228 26 8ZM26 12C26 11.4477 26.4477 11 27 11H31C31.5523 11 32 11.4477 32 12C32 12.5523 31.5523 13 31 13H27C26.4477 13 26 12.5523 26 12ZM27 15C26.4477 15 26 15.4477 26 16C26 16.5523 26.4477 17 27 17H31C31.5523 17 32 16.5523 32 16C32 15.4477 31.5523 15 31 15H27Z"
        :fill="color || '#B8CCE2'"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_0_154"
        x="4"
        y="0"
        width="28.35"
        height="40"
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
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.4 0 0 0 0 0.737255 0 0 0 0 0.890196 0 0 0 0.5 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_154" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_154" result="shape" />
      </filter>
      <filter
        id="filter1_d_0_154"
        x="20"
        y="1"
        width="18"
        height="22"
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
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.4 0 0 0 0 0.737255 0 0 0 0 0.890196 0 0 0 0.5 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_154" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_154" result="shape" />
      </filter>
    </defs>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ color?: string }>()
</script>
