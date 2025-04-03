<template>
  <div class="pixel-background">
    <div class="pixel-container">
      <!-- 像素云朵 -->
      <div
        v-for="(cloud, index) in clouds"
        :key="`cloud-${index}`"
        class="pixel-cloud"
        :style="{
          left: `${cloud.x}%`,
          top: `${cloud.y}%`,
          animationDelay: `${cloud.delay}s`,
        }"
      ></div>

      <!-- 像素山脉 -->
      <div class="pixel-mountains">
        <div class="mountain mountain-back"></div>
        <div class="mountain mountain-mid"></div>
        <div class="mountain mountain-front"></div>
      </div>

      <!-- 像素地面 -->
      <div class="pixel-ground">
        <div
          v-for="i in 20"
          :key="`grass-${i}`"
          class="pixel-grass"
          :style="{ left: `${i * 5}%`, height: `${Math.random() * 10 + 5}px` }"
        ></div>
      </div>

      <!-- 内容容器 -->
      <div class="content-container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 生成随机云朵
const clouds = ref([]);

onMounted(() => {
  // 生成10-15个云朵
  const cloudCount = Math.floor(Math.random() * 6) + 10;

  for (let i = 0; i < cloudCount; i++) {
    clouds.value.push({
      x: Math.random() * 100,
      y: Math.random() * 30 + 5,
      delay: Math.random() * 20,
    });
  }
});
</script>

<style scoped>
.pixel-background {
  width: 100%;
  min-height: 100vh;
  background-color: #8bd0ff; /* 复古天空蓝 */
  overflow: hidden;
  position: relative;
  image-rendering: pixelated;
  font-family: "Press Start 2P", system-ui, sans-serif;
}

.pixel-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 像素云朵 */
.pixel-cloud {
  position: absolute;
  width: 60px;
  height: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 30px -10px 0 0 #ffffff, 60px 0 0 10px #ffffff;
  animation: float 30s linear infinite;
}

@keyframes float {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

/* 像素山脉 */
.pixel-mountains {
  position: absolute;
  bottom: 80px;
  width: 100%;
  height: 200px;
}

.mountain {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
}

.mountain-back {
  left: 10%;
  border-width: 0 100px 150px 100px;
  border-color: transparent transparent #4a6d8c transparent;
}

.mountain-mid {
  left: 40%;
  border-width: 0 120px 180px 120px;
  border-color: transparent transparent #3a5d7c transparent;
}

.mountain-front {
  left: 70%;
  border-width: 0 150px 200px 150px;
  border-color: transparent transparent #2a4d6c transparent;
}

/* 像素地面 */
.pixel-ground {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  background-color: #5a9e45; /* 复古草地绿 */
  border-top: 4px solid #3d7a2c;
}

.pixel-grass {
  position: absolute;
  bottom: 80px;
  width: 4px;
  background-color: #5a9e45;
}

/* 内容容器 */
.content-container {
  position: relative;
  z-index: 10;
  padding: 2rem;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 像素边框 */
.pixel-border {
  border: 4px solid #000;
  box-shadow: 4px 4px 0 0 #000;
  image-rendering: pixelated;
}

/* 像素按钮 */
.pixel-button {
  background-color: #ff5555;
  color: white;
  border: none;
  padding: 8px 16px;
  font-family: "Press Start 2P", system-ui, sans-serif;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0 0 #000;
  transition: all 0.1s;
}

.pixel-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 #000;
}

.pixel-button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #000;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .mountain-back {
    left: 0;
    border-width: 0 70px 100px 70px;
  }

  .mountain-mid {
    left: 30%;
    border-width: 0 80px 120px 80px;
  }

  .mountain-front {
    left: 60%;
    border-width: 0 100px 150px 100px;
  }
}
</style>
