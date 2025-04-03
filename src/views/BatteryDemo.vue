<template>
  <div class="battery-page">
    <div class="g-container">
      <div class="g-number">{{ numberDom }}</div>
      <div class="g-contrast">
        <div class="g-circle"></div>
        <ul class="g-bubbles">
          <li v-for="i in 15" :index="i"></li>
        </ul>
      </div>
      <div class="g-text">{{ textDom }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const numberDom = ref("0%");
const textDom = ref();
const getBatteryNum = async () => {
  if (!navigator.getBattery) {
    console.warn("当前浏览器不支持 navigator.getBattery");
    return;
  }
  try {
    const batteryNum = await navigator.getBattery();
    // 获取电池信息
    numberDom.value = `${batteryNum.level * 100}%`;
    // 更新电池电量百分比

    console.log(batteryNum, "batteryNum");
    // 打印电池信息
    let time = batteryNum.dischargingTime;
    // 获取剩余放电时间
    textDom.value = "";
    // 清空文本输入框
    if (time && time != Infinity) {
      // 判断剩余放电时间是否有效
      let hour = Math.floor(time / (60 * 60));
      // 计算剩余时间的小时和分钟
      let min = (time % (60 * 60)) / 60;
      console.log(hour, min);
      // 打印剩余时间的小时和分钟
      textDom.value = !batteryNum.charging
        ? // 根据充电状态和电量更新文本输入框内容
          `已断开电源：剩余电量时间：${hour}小时${min}分钟`
        : batteryNum.level == 1
        ? "已充满"
        : "正在充电";
    }
  } catch (error) {
    console.error("获取电池信息失败", error);
    return;
  }
};
getBatteryNum();
setInterval(getBatteryNum, 5000);
</script>

<style lang="scss" scoped>
.battery-page {
  width: 100%;
  height: 100%;
  display: flex;
  //   background: #000;
  overflow: hidden;
}
.g-number {
  position: absolute;
  width: 300px;
  top: 27%;
  text-align: center;
  font-size: 32px;
  z-index: 10;
  color: #fff;
}

.g-container {
  position: relative;
  width: 300px;
  height: 450px;
  margin: auto;
  background-color: #000;
}

.g-contrast {
  filter: contrast(10) hue-rotate(0);
  width: 300px;
  height: 400px;
  background-color: #000;
  overflow: hidden;
  animation: hueRotate 10s infinite linear;
}

.g-circle {
  position: relative;
  width: 300px;
  height: 300px;
  box-sizing: border-box;
  filter: blur(8px);
  color: #00ff6f;
}

.g-circle::after {
  content: "";
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(0);
  width: 200px;
  height: 200px;
  background-color: #00ff6f;
  border-radius: 42% 38% 62% 49% / 45%;
  animation: rotate 10s infinite linear;
}

.g-circle::before {
  content: "";
  position: absolute;
  width: 176px;
  height: 176px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: #000;
  z-index: 10;
}

.g-bubbles {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 100px;
  height: 40px;
  transform: translate(-50%, 0);
  border-radius: 100px 100px 0 0;
  background-color: #00ff6f;
  filter: blur(5px);
}
.g-text {
  color: #00ff6f;
  text-align: center;
}
li {
  position: absolute;
  border-radius: 50%;
  background: #00ff6f;
}
@for $i from 0 through 15 {
  li:nth-child(#{$i}) {
    $width: 15 + random(15) + px;
    left: 15 + random(70) + px;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $width;
    height: $width;
    animation: moveToTop
      #{random(6) +
      3}s
      ease-in-out -#{random(5000) /
      1000}s
      infinite;
  }
}

@keyframes rotate {
  50% {
    border-radius: 45% / 42% 38% 58% 49%;
  }
  100% {
    transform: translate(-50%, -50%) rotate(720deg);
  }
}

@keyframes moveToTop {
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
    transform: translate(-50%, -180px);
  }
}

@keyframes hueRotate {
  100% {
    filter: contrast(15) hue-rotate(360deg);
  }
}
</style>
