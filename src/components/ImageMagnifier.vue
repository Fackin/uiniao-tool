<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";

const props = withDefaults(
  defineProps<{
    imageUrl: string;
    zoom?: number;
    mode?: "magnify" | "shrink" | "blur" | "funny" | "mosaic";
    blurAmount?: number; // 模糊程度
    funnyType?: "squeeze" | "stretch" | "wave"; // 哈哈镜类型
    mosaicSize?: number; // 马赛克大小
  }>(),
  {
    zoom: 2,
    mode: "magnify",
    blurAmount: 5, // 默认模糊度
    funnyType: "squeeze",
    mosaicSize: 10, // 默认马赛克大小
  }
);

const showMagnifier = ref(false);
const container = ref<HTMLElement>();
const imageRef = ref<HTMLImageElement>();
const imageWidth = ref(0);
const imageHeight = ref(0);

const lens = reactive({
  width: 100,
  height: 100,
});

// 创建马赛克效果的 canvas
const canvasRef = ref<HTMLCanvasElement | null>(null);
const mosaicImageData = ref<string | null>(null);

// 检测是否为移动设备
const isMobile = ref(false);

onMounted(() => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
});

const magnifierPos = reactive({
  x: 0,
  y: 0,
  bgX: 0,
  bgY: 0,
});

// 生成马赛克效果
const generateMosaic = () => {
  if (!imageRef.value || !props.imageUrl) return;

  const img = new Image();
  img.crossOrigin = "Anonymous"; // 处理跨域问题
  img.src = props.imageUrl;

  img.onload = () => {
    if (!canvasRef.value) {
      canvasRef.value = document.createElement("canvas");
    }

    const canvas = canvasRef.value;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置 canvas 尺寸
    canvas.width = img.width;
    canvas.height = img.height;

    // 绘制原始图像
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // 应用马赛克效果
    const size = props.mosaicSize;
    for (let y = 0; y < img.height; y += size) {
      for (let x = 0; x < img.width; x += size) {
        // 获取当前块的颜色
        const data = ctx.getImageData(x, y, 1, 1).data;

        // 填充整个块
        ctx.fillStyle = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${
          data[3] / 255
        })`;
        ctx.fillRect(x, y, size, size);
      }
    }

    // 将处理后的图像转为 data URL
    mosaicImageData.value = canvas.toDataURL("image/png");
  };
};

watch(
  () => props.imageUrl,
  () => {
    // 图片加载完成后获取尺寸
    const img = new Image();
    img.src = props.imageUrl;
    img.onload = () => {
      imageWidth.value = img.width;
      imageHeight.value = img.height;
    };
  },
  {
    immediate: true,
    deep: true,
  }
);

// 监听相关属性变化，重新生成马赛克
watch(
  [() => props.imageUrl, () => props.mosaicSize, () => props.mode],
  () => {
    if (props.mode === "mosaic") {
      generateMosaic();
    }
  },
  { immediate: true }
);

// 统一处理鼠标和触摸事件
const handlePointerMove = (e: MouseEvent | TouchEvent) => {
  if (!container.value) return;

  const rect = container.value.getBoundingClientRect();
  const point = "touches" in e ? e.touches[0] : e;
  const clientX = point.clientX;
  const clientY = point.clientY;

  const mouseX = clientX - rect.left;
  const mouseY = clientY - rect.top;

  // ... 其余计算逻辑保持不变 ...
  let x = mouseX - lens.width / 2;
  let y = mouseY - lens.height / 2;

  x = Math.max(0, Math.min(x, rect.width - lens.width));
  y = Math.max(0, Math.min(y, rect.height - lens.height));

  const scaleX = imageWidth.value / rect.width;
  const scaleY = imageHeight.value / rect.height;
  const effectiveZoom = props.mode === "magnify" ? props.zoom : 1 / props.zoom;

  magnifierPos.x = x;
  magnifierPos.y = y;
  magnifierPos.bgX = -(mouseX * scaleX * effectiveZoom - lens.width / 2);
  magnifierPos.bgY = -(mouseY * scaleY * effectiveZoom - lens.height / 2);
};

// 处理开始触摸/进入事件
const handlePointerEnter = () => {
  showMagnifier.value = true;
};

// 处理结束触摸/离开事件
const handlePointerLeave = () => {
  showMagnifier.value = false;
};

// 计算哈哈镜变形效果
const getFunnyTransform = () => {
  console.log(props.funnyType, "getFunnyTransform");
  switch (props.funnyType) {
    case "squeeze":
      return "scaleX(0.5) scaleY(1.5)";
    // 增加整体缩放，并调整挤压比例
    //   return "scale(1.2) scaleX(0.6) scaleY(1.4)";
    case "stretch":
      return "scaleX(1.5) scaleY(0.5)";
    // 增加整体缩放，并调整拉伸比例
    //   return "scale(1.2) scaleX(1.4) scaleY(0.6)";
    case "wave":
      // return 'perspective(100px) rotateX(10deg)';
      return "perspective(500px) rotateX(15deg) rotateY(10deg) scale(1.2)";
    default:
      return "none";
  }
};

// 计算背景尺寸
const getBackgroundSize = computed(() => {
  return `${
    imageWidth.value * (props.mode === "magnify" ? props.zoom : 1 / props.zoom)
  }px ${
    imageHeight.value * (props.mode === "magnify" ? props.zoom : 1 / props.zoom)
  }px`;
});
</script>

<template>
  <div
    class="magnifier-container"
    ref="container"
    @mousemove="handlePointerMove"
    @touchmove.prevent="handlePointerMove"
    @mouseenter="handlePointerEnter"
    @touchstart="handlePointerEnter"
    @mouseleave="handlePointerLeave"
    @touchend="handlePointerLeave"
    @touchcancel="handlePointerLeave"
  >
    <!-- 原始图片 -->
    <img
      :src="imageUrl"
      ref="imageRef"
      class="original-image"
      :class="{ mobile: isMobile }"
    />

    <!-- 外层容器处理边框 -->
    <div
      v-show="showMagnifier"
      :class="[
        'magnifier-border',
        mode === 'shrink' ? 'shrink' : '',
        mode === 'blur' ? 'blur-border' : '',
        mode === 'funny' ? 'funny' : '',
        mode === 'mosaic' ? 'mosaic-border' : '',
        funnyType === 'wave' ? 'wave' : '',
        { mobile: isMobile },
      ]"
      :style="{
        left: `${magnifierPos.x}px`,
        top: `${magnifierPos.y}px`,
      }"
    >
      <!-- 内层容器处理图片和模糊效果 -->
      <div
        class="magnifier empty-background"
        :style="{
          backgroundImage:
            mode === 'mosaic' && mosaicImageData
              ? `url(${mosaicImageData})`
              : imageUrl
              ? `url(${imageUrl})`
              : 'none',
          backgroundPosition: `${magnifierPos.bgX}px ${magnifierPos.bgY}px`,
          backgroundSize: getBackgroundSize,
          filter: mode === 'blur' ? `blur(${blurAmount}px)` : 'none',
          transform: mode === 'funny' ? getFunnyTransform() : 'none',
          borderRadius:
            mode === 'funny' && funnyType === 'wave'
              ? '70% 30% 30% 70% / 60% 40% 60% 40%'
              : '50%',
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.magnifier-container {
  position: relative;
  display: inline-block;
}

/* 禁用移动端的默认触摸行为 */
.magnifier-container {
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}

.original-image {
  display: block;
  max-width: 100%;
}

/* 移动端样式调整 */
.original-image.mobile {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: none;
}

.magnifier-border {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid #fff;
  border-radius: 50%;
  pointer-events: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.magnifier-border.mobile {
  width: 120px;
  height: 120px;
}

.magnifier {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  will-change: filter;
  backface-visibility: hidden;
  transition: transform 0.1s ease-out;
}

/* 优化移动端性能 */
.magnifier {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

.magnifier-border.shrink {
  border-color: #ff4444;
  box-shadow: 0 0 5px rgba(255, 68, 68, 0.5);
}

.magnifier-border.blur-border {
  border-color: #8a2be2;
  box-shadow: 0 0 5px rgba(138, 43, 226, 0.5);
}

.magnifier-border.funny {
  border-color: #ffa500;
  box-shadow: 0 0 5px rgba(255, 165, 0, 0.5);
}

.magnifier-border.mosaic-border {
  border-color: #9c27b0;
  box-shadow: 0 0 5px rgba(156, 39, 176, 0.5);
}

/* 马赛克效果的像素化处理 */
.mosaic-border .magnifier {
  image-rendering: pixelated; /* 现代浏览器 */
  image-rendering: -moz-crisp-edges; /* Firefox */
  image-rendering: crisp-edges; /* Safari */
}

@keyframes waveEffect {
  0% {
    border-radius: 70% 30% 30% 70% / 60% 40% 60% 40%;
    transform: perspective(500px) rotateX(15deg) rotateY(10deg) scale(1.2);
  }
  33% {
    border-radius: 30% 70% 70% 30% / 40% 60% 40% 60%;
    transform: perspective(500px) rotateX(-15deg) rotateY(-10deg) scale(1.2);
  }
  66% {
    border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
    transform: perspective(500px) rotateX(15deg) rotateY(-10deg) scale(1.2);
  }
  100% {
    border-radius: 70% 30% 30% 70% / 60% 40% 60% 40%;
    transform: perspective(500px) rotateX(15deg) rotateY(10deg) scale(1.2);
  }
}

.funny.wave .magnifier {
  animation: waveEffect 2s ease-in-out infinite;
  transform-origin: center center;
  will-change: transform, border-radius;
}

.empty-background {
  background-color: #fff;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>
