<template>
  <div class="website-background" :class="[`style-${styleType}`]">
    <!-- 基础马赛克背景 -->
    <div class="background-layer mosaic-grid" v-if="styleType === 'grid'"></div>

    <!-- 像素块背景 -->
    <div
      class="background-layer pixel-blocks"
      v-if="styleType === 'blocks'"
    ></div>

    <!-- 动态马赛克 -->
    <div class="background-layer dynamic-mosaic" v-if="styleType === 'dynamic'">
      <div
        v-for="(pixel, index) in dynamicPixels"
        :key="index"
        class="dynamic-pixel"
        :style="getPixelStyle(pixel)"
      ></div>
    </div>

    <!-- 渐变马赛克 -->
    <div
      class="background-layer gradient-mosaic"
      v-if="styleType === 'gradient'"
    ></div>
    <!-- 背景图片 -->
    <div class="background-layer bg-img" v-if="styleType === 'bgimg'"></div>

    <!-- 内容容器 -->
    <div class="content-container overflow-hidden">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import themeManager from "@/utils/theme.ts";

const props = defineProps({
  styleType: {
    type: String,
    default: "grid",
    validator: (value: string) =>
      ["grid", "blocks", "dynamic", "gradient", "bgimg"].includes(value),
  },
  bgImg: {
    type: String,
    default: () => "bg1.jpg",
  },
});

interface Pixel {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  direction: number;
}

// 动态马赛克像素
const dynamicPixels = ref<Pixel[]>([]);
const animationFrame = ref<number | null>(null);

// 使用主题管理器获取颜色
const themeColors = computed(() => themeManager.themeColors.value);

// 初始化动态像素
const initDynamicPixels = () => {
  const pixelCount = Math.floor(
    (window.innerWidth * window.innerHeight) / 10000
  );
  const newPixels: Pixel[] = [];

  for (let i = 0; i < pixelCount; i++) {
    newPixels.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      color: Object.values(themeColors.value).slice(0, 4)[
        Math.floor(Math.random() * 4)
      ],
      opacity: Math.random() * 0.2 + 0.05,
      speed: Math.random() * 0.02 + 0.01,
      direction: Math.random() * Math.PI * 2,
    });
  }

  dynamicPixels.value = newPixels;
};

// 动画更新
const updateDynamicPixels = () => {
  dynamicPixels.value = dynamicPixels.value.map((pixel) => {
    // 更新位置
    pixel.x += Math.cos(pixel.direction) * pixel.speed;
    pixel.y += Math.sin(pixel.direction) * pixel.speed;

    // 边界检查
    if (pixel.x < -10) pixel.x = 110;
    if (pixel.x > 110) pixel.x = -10;
    if (pixel.y < -10) pixel.y = 110;
    if (pixel.y > 110) pixel.y = -10;

    return pixel;
  });

  animationFrame.value = requestAnimationFrame(updateDynamicPixels);
};

// 获取像素样式
const getPixelStyle = (pixel: Pixel) => {
  return {
    left: `${pixel.x}%`,
    top: `${pixel.y}%`,
    width: `${pixel.size}px`,
    height: `${pixel.size}px`,
    backgroundColor: pixel.color,
    opacity: pixel.opacity,
  };
};

// 监听主题变化
watch(
  () => themeManager.currentTheme.value,
  () => {
    if (props.styleType === "dynamic") {
      // 更新动态像素颜色
      dynamicPixels.value = dynamicPixels.value.map((pixel) => {
        pixel.color = Object.values(themeColors.value).slice(0, 4)[
          Math.floor(Math.random() * 4)
        ];
        return pixel;
      });
    }
  }
);

// 监听样式变化
watch(
  () => props.styleType,
  (newStyle) => {
    if (newStyle === "dynamic") {
      initDynamicPixels();
      if (!animationFrame.value) {
        animationFrame.value = requestAnimationFrame(updateDynamicPixels);
      }
    } else if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value);
      animationFrame.value = null;
    }
  }
);

watch(() => props.bgImg, (newBg) => {
  const bgImgElement = document.querySelector('.bg-img') as HTMLElement;
  if (bgImgElement) {
    bgImgElement.style.backgroundImage = `url(${newBg})`;
  }
})

onMounted(() => {
  if (props.styleType === "dynamic") {
    initDynamicPixels();
    animationFrame.value = requestAnimationFrame(updateDynamicPixels);
  }

  window.addEventListener("resize", initDynamicPixels);
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }

  window.removeEventListener("resize", initDynamicPixels);
});
</script>

<style>
.website-background {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* 背景层 */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

/* 网格马赛克 */
.mosaic-grid {
  background-image: linear-gradient(
      to right,
      var(--color-primary) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, var(--color-secondary) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.05;
}

.mosaic-grid::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(var(--color-tertiary) 1px, transparent 1px),
    radial-gradient(var(--color-quaternary) 1px, transparent 1px);
  background-size: 80px 80px;
  background-position: 0 0, 40px 40px;
  opacity: 0.1;
}

/* 像素块 */
.pixel-blocks {
  background: linear-gradient(
      45deg,
      var(--color-primary) 25%,
      transparent 25%,
      transparent 75%,
      var(--color-primary) 75%
    ),
    linear-gradient(
      45deg,
      var(--color-secondary) 25%,
      transparent 25%,
      transparent 75%,
      var(--color-secondary) 75%
    ),
    linear-gradient(
      45deg,
      var(--color-tertiary) 25%,
      transparent 25%,
      transparent 75%,
      var(--color-tertiary) 75%
    ),
    linear-gradient(
      45deg,
      var(--color-quaternary) 25%,
      transparent 25%,
      transparent 75%,
      var(--color-quaternary) 75%
    );
  background-size: 40px 40px;
  background-position: 0 0, 20px 0, 0 20px, 20px 20px;
  opacity: 0.05;
}

/* 动态马赛克 */
.dynamic-mosaic {
  overflow: hidden;
}

.dynamic-pixel {
  position: absolute;
  border-radius: 2px;
  transition: opacity 0.5s ease;
}

/* 渐变马赛克 */
.gradient-mosaic {
  background: linear-gradient(
      135deg,
      var(--color-primary),
      var(--color-quaternary)
    ),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 30px,
      rgba(255, 255, 255, 0.1) 30px,
      rgba(255, 255, 255, 0.1) 60px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 30px,
      rgba(255, 255, 255, 0.1) 30px,
      rgba(255, 255, 255, 0.1) 60px
    );
  background-blend-mode: overlay;
  opacity: 0.1;
}

/* 背景图片 */
.bg-img {
  background-image: url("@/assets/img/bg/bg1.jpg");
  background-size: cover;
  background-position: center;
  opacity: 0.5;
  filter: blur(2px);
  z-index: -1;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.5s ease, background-image 0.5s ease-in-out;
  transition-delay: 0.5s;
  animation: fadeIn 1s ease forwards;
  animation-delay: 1s;
  opacity: 0;
  pointer-events: none;
  user-select: none;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 内容容器 */
.content-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .mosaic-grid {
    background-size: 15px 15px;
  }

  .mosaic-grid::before {
    background-size: 60px 60px;
    background-position: 0 0, 30px 30px;
  }

  .pixel-blocks {
    background-size: 30px 30px;
    background-position: 0 0, 15px 0, 0 15px, 15px 15px;
  }
}

@media (max-width: 480px) {
  .mosaic-grid {
    background-size: 10px 10px;
  }

  .mosaic-grid::before {
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
  }

  .pixel-blocks {
    background-size: 20px 20px;
    background-position: 0 0, 10px 0, 0 10px, 10px 10px;
  }
}
</style>
