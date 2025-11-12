<script setup lang="ts">
import Dot from '../icons/Dot.vue'
</script>

<template>
  <div class="logo">
    <div class="animate-logo">
      <svg
        class="run"
        xmlns="http://www.w3.org/2000/svg"
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
      >
        <mask id="path-1-inside-1_0_100" fill="white">
          <path
            d="M56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56C43.464 56 56 43.464 56 28Z"
          />
        </mask>
        <path
          d="M56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56C43.464 56 56 43.464 56 28Z"
          fill="#213437"
          fill-opacity="0.9"
        />
        <g
          clip-path="url(#paint0_angular_0_100_clip_path)"
          data-figma-skip-parse="true"
          mask="url(#path-1-inside-1_0_100)"
        >
          <g transform="matrix(0.028 0 0 -0.028 28 28)">
            <foreignObject x="-1071.43" y="-1071.43" width="2142.86" height="2142.86"
              ><div
                xmlns="http://www.w3.org/1999/xhtml"
                style="
                  background: conic-gradient(
                    from 90deg,
                    rgba(98, 163, 140, 1) 0deg,
                    rgba(98, 163, 140, 0.0001) 360deg
                  );
                  height: 100%;
                  width: 100%;
                  opacity: 1;
                "
              ></div
            ></foreignObject>
          </g>
        </g>
        <path
          d="M56 28H54C54 13.6406 42.3594 2 28 2V0V-2C44.5685 -2 58 11.4315 58 28H56ZM28 0V2C13.6406 2 2 13.6406 2 28H0H-2C-2 11.4315 11.4315 -2 28 -2V0ZM0 28H2C2 42.3594 13.6406 54 28 54V56V58C11.4315 58 -2 44.5685 -2 28H0ZM28 56V54C42.3594 54 54 42.3594 54 28H56H58C58 44.5685 44.5685 58 28 58V56Z"
          data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":0.38431373238563538,"g":0.63921570777893066,"b":0.54901963472366333,"a":1.0},"position":0.0},{"color":{"r":0.38431373238563538,"g":0.63921570777893066,"b":0.54901963472366333,"a":9.9999997473787516e-05},"position":1.0}],"stopsVar":[],"transform":{"m00":56.0,"m01":0.0,"m02":0.0,"m10":0.0,"m11":-56.0,"m12":56.0},"opacity":1.0,"blendMode":"NORMAL","visible":true}'
          mask="url(#path-1-inside-1_0_100)"
        />
        <defs>
          <clipPath id="paint0_angular_0_100_clip_path">
            <path
              d="M56 28H54C54 13.6406 42.3594 2 28 2V0V-2C44.5685 -2 58 11.4315 58 28H56ZM28 0V2C13.6406 2 2 13.6406 2 28H0H-2C-2 11.4315 11.4315 -2 28 -2V0ZM0 28H2C2 42.3594 13.6406 54 28 54V56V58C11.4315 58 -2 44.5685 -2 28H0ZM28 56V54C42.3594 54 54 42.3594 54 28H56H58C58 44.5685 44.5685 58 28 58V56Z"
              mask="url(#path-1-inside-1_0_100)"
            />
          </clipPath>
        </defs>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <circle
          cx="20"
          cy="20"
          r="19"
          fill="url(#paint0_linear_0_103)"
          stroke="#B4ECDD"
          stroke-width="2"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17.4123 11.0338C15.311 17.5328 11 20.2727 11 23.7306C11.0795 27.2729 14.0146 30.0779 17.5569 29.9984C20.9859 29.9236 23.7475 27.1597 23.8246 23.7306C23.8246 20.2727 18.0726 11.1687 17.4123 11.0338ZM29.0007 14.752C28.6874 13.3086 25.4584 10 25.1716 10C24.8825 12.8965 23.3258 14.4146 23.6414 15.8605C23.9764 17.3208 25.4246 18.2389 26.8874 17.9256C28.338 17.6437 29.2874 16.2388 29.0079 14.7881C29.0055 14.7761 29.0031 14.7664 29.0007 14.7544V14.752Z"
          fill="#BCF7E1"
        />
        <defs>
          <linearGradient
            id="paint0_linear_0_103"
            x1="5.47824"
            y1="10.9565"
            x2="5.47824"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#132221" />
            <stop offset="1" stop-color="#428D71" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div>
      <div style="font-size: 18px">养殖鱼塘</div>
      <div style="text-transform: uppercase; font-size: 14px">fish pond</div>
    </div>
  </div>
  <div class="dot-container">
    <Dot style="display: flex; align-items: center" shadow>正常</Dot>
    <Dot style="display: flex; align-items: center" shadow color="#EA9069">预警</Dot>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  position: fixed;
  // width: 56px;
  display: flex;
  top: 152px;
  left: 50px;
  z-index: 1;
  align-items: center;
  column-gap: 16px;
  .animate-logo {
    position: relative;
    width: 56px;
    height: 56px;
    .run {
      animation: loading 3s linear infinite;
    }
    svg {
      position: absolute;

      &:last-child {
        top: 8px;
        right: 8px;
        left: 8px;
        bottom: 8px;
      }
    }
  }
}

.dot-container {
  gap: 24px;
  z-index: 1;
  top: 152px;
  right: 695px;
  display: flex;
  position: fixed;
  .dot {
    display: flex;
    align-items: center;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
