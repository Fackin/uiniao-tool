<template>
  <div class="mosaic-card" :class="{ 'dark-mode': isDarkMode }">
    <div class="card-header">
      <div class="pixel-avatar">
        <div
          v-for="(pixel, index) in avatarPixels"
          :key="index"
          class="pixel"
          :style="{ backgroundColor: pixel }"
        ></div>
      </div>
      <div class="title-container">
        <h3 class="pixel-title">{{ title }}</h3>
        <div class="pixel-subtitle">{{ subtitle }}</div>
      </div>
    </div>

    <div class="card-content">
      <div class="pixel-image">
        <img
          :src="imageUrl"
          alt="Card image"
          ref="imageRef"
          @load="generatePixelImage"
        />
        <div class="pixel-overlay" v-if="pixelatedImageUrl">
          <img :src="pixelatedImageUrl" alt="Pixelated image" />
        </div>
      </div>

      <div class="pixel-text">
        <slot></slot>
      </div>
    </div>

    <div class="card-footer">
      <div class="pixel-button" @click="$emit('action')">
        <span>{{ actionText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";

const props = defineProps<{
  title: string;
  subtitle?: string;
  imageUrl: string;
  actionText?: string;
  pixelSize?: number;
  colorPalette?: string[];
}>();

const emit = defineEmits(["action"]);

const defaultProps = {
  subtitle: "",
  actionText: "查看详情",
  pixelSize: 8,
  colorPalette: [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
  ],
};

// 合并默认值
const subtitle = computed(() => props.subtitle || defaultProps.subtitle);
const actionText = computed(() => props.actionText || defaultProps.actionText);
const pixelSize = computed(() => props.pixelSize || defaultProps.pixelSize);
const colorPalette = computed(
  () => props.colorPalette || defaultProps.colorPalette
);

// 生成随机头像像素
const avatarPixels = ref<string[]>([]);
const generateAvatarPixels = () => {
  const pixels = [];
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * colorPalette.value.length);
    pixels.push(colorPalette.value[randomIndex]);
  }
  avatarPixels.value = pixels;
};

// 生成像素化图片
const imageRef = ref<HTMLImageElement | null>(null);
const pixelatedImageUrl = ref<string | null>(null);

const generatePixelImage = () => {
  if (!imageRef.value) return;

  const img = imageRef.value;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 设置较小的尺寸来创建像素效果
  const scale = pixelSize.value;
  const w = Math.floor(img.width / scale);
  const h = Math.floor(img.height / scale);

  canvas.width = w;
  canvas.height = h;

  // 绘制缩小的图像
  ctx.drawImage(img, 0, 0, w, h);

  // 创建第二个画布，将小图像放大
  const canvas2 = document.createElement("canvas");
  canvas2.width = img.width;
  canvas2.height = img.height;
  const ctx2 = canvas2.getContext("2d");
  if (!ctx2) return;

  // 禁用平滑处理以保持像素感
  ctx2.imageSmoothingEnabled = false;

  // 绘制放大的图像
  ctx2.drawImage(canvas, 0, 0, w, h, 0, 0, img.width, img.height);

  // 转换为数据URL
  pixelatedImageUrl.value = canvas2.toDataURL("image/png");
};

// 检测暗色模式
const isDarkMode = ref(false);
const checkDarkMode = () => {
  console.log('checkDarkMode', window.matchMedia("(prefers-color-scheme: dark)").matches)
  isDarkMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
};

onMounted(() => {
  generateAvatarPixels();
  checkDarkMode();

  // 监听暗色模式变化
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", checkDarkMode);
});

// 监听图片URL变化
watch(
  () => props.imageUrl,
  () => {
    pixelatedImageUrl.value = null;
    // 图片加载后会触发generatePixelImage
  }
);
</script>

<style scoped>
.mosaic-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-family: "Press Start 2P", system-ui, sans-serif;
}

.mosaic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 4px solid #f0f0f0;
}

.pixel-avatar {
  width: 48px;
  height: 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  margin-right: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.pixel {
  width: 100%;
  height: 100%;
}

.title-container {
  flex: 1;
}

.pixel-title {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  color: #333;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.pixel-subtitle {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.card-content {
  padding: 0;
}

.pixel-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.pixel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pixel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.pixel-overlay img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-text {
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #444;
}

.card-footer {
  padding: 16px;
  display: flex;
  justify-content: center;
  border-top: 4px solid #f0f0f0;
}

.pixel-button {
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 14px;
  position: relative;
  transition: all 0.2s;
  clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
}

.pixel-button:hover {
  transform: scale(1.05);
  background-color: #555;
}

.pixel-button:active {
  transform: scale(0.98);
}

/* 暗色模式 */
.dark-mode {
  background-color: #222;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dark-mode .card-header {
  border-bottom-color: #333;
}

.dark-mode .pixel-title {
  color: #eee;
}

.dark-mode .pixel-subtitle {
  color: #aaa;
}

.dark-mode .pixel-text {
  color: #bbb;
}

.dark-mode .card-footer {
  border-top-color: #333;
}

.dark-mode .pixel-button {
  background-color: #555;
}

.dark-mode .pixel-button:hover {
  background-color: #777;
}

@media (max-width: 768px) {
  .mosaic-card {
    max-width: 100%;
  }

  .pixel-title {
    font-size: 16px;
  }

  .pixel-image {
    height: 180px;
  }
}
</style>
