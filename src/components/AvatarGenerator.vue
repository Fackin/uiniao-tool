<template>
  <div class="container">
    <input v-model="name" placeholder="输入名称" />
    <div class="options">
      <label>
        形状：
        <select v-model="shape">
          <option value="circle">圆形</option>
          <option value="square">方形</option>
          <option value="rounded">圆角</option>
          <option value="pixel">像素风</option>
        </select>
      </label>
      <label> <input type="checkbox" v-model="showBorder" /> 显示边框 </label>
      <label> <input type="checkbox" v-model="showShadow" /> 显示阴影 </label>
    </div>

    <canvas ref="canvas" width="100" height="100" class="hidden"></canvas>

    <div class="avatar-container">
      <canvas
        ref="pixelCanvas"
        width="100"
        height="100"
        v-if="shape === 'pixel'"
      ></canvas>
      <svg
        v-else
        :width="size"
        :height="size"
        :viewBox="`0 0 ${size} ${size}`"
        xmlns="http://www.w3.org/2000/svg"
        class="avatar"
        :class="[shape, { shadow: showShadow }]"
      >
        <rect
          v-if="shape !== 'circle'"
          :width="size"
          :height="size"
          :rx="shape === 'rounded' ? size / 4 : 0"
          :fill="avatarColor"
          :stroke="showBorder ? '#333' : 'none'"
          stroke-width="3"
        />
        <circle
          v-else
          :cx="size / 2"
          :cy="size / 2"
          :r="size / 2"
          :fill="avatarColor"
          :stroke="showBorder ? '#333' : 'none'"
          stroke-width="3"
        />
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="white"
          font-size="40"
          font-weight="bold"
          font-family="Arial, sans-serif"
        >
          {{ initials }}
        </text>
      </svg>
    </div>

    <button @click="downloadAvatar">下载头像</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

const name = ref("VueUser"); // 默认名称
const shape = ref("circle"); // 头像形状
const showBorder = ref(true);
const showShadow = ref(true);
const size = 100; // 头像大小
const pixelCanvas = ref(null);

// 计算头像颜色（基于名称哈希）
const avatarColor = computed(() => {
  let hash = 0;
  for (let i = 0; i < name.value.length; i++) {
    hash = name.value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
});

// 获取名称首字母
const initials = computed(() => {
  return name.value ? name.value.charAt(0).toUpperCase() : "?";
});

// 生成像素头像
const generatePixelAvatar = () => {
  if (!pixelCanvas.value) return;
  const ctx = pixelCanvas.value.getContext("2d");
  const gridSize = 10; // 头像像素大小
  const cols = 10; // 6列像素
  const rows = 10; // 6行像素
  const pixelSize = size / cols; // 每个像素大小
  let hash = 0;

  for (let i = 0; i < name.value.length; i++) {
    hash = name.value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = hash % 99999; // 让相同名称生成相同图案

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = avatarColor.value;

  for (let x = 0; x < cols / 2; x++) {
    for (let y = 0; y < rows; y++) {
      const randomBit = (seed >> (x * rows + y)) & 1; // 随机对称像素
      if (randomBit) {
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        ctx.fillRect(
          (cols - 1 - x) * pixelSize,
          y * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }
};

watch([name, shape], () => {
  if (shape.value === "pixel") {
    generatePixelAvatar();
  }
});

// 下载头像
const downloadAvatar = () => {
  if (shape.value === "pixel") {
    if (!pixelCanvas.value) return;
    const link = document.createElement("a");
    link.download = `${name.value}-pixel-avatar.png`;
    link.href = pixelCanvas.value.toDataURL("image/png");
    link.click();
  } else {
    const svg = document.querySelector(".avatar");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `${name.value}-avatar.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }
};

onMounted(() => {
  if (shape.value === "pixel") {
    generatePixelAvatar();
  }
});
</script>

<style scoped>
.container {
  text-align: center;
  margin: 20px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 10px;
}

.options {
  margin-bottom: 10px;
  font-size: 14px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
}

.avatar {
  display: block;
}

.circle {
  border-radius: 50%;
}

.rounded {
  border-radius: 15px;
}

.shadow {
  filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.2));
}

button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.hidden {
  display: none;
}
</style>
