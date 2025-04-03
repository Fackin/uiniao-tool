<script setup>
import { ref, computed, onMounted } from "vue";
import CameraPick from "@/components/Camera.vue";
import ColorCard from "./components/ColorCard.vue";
import UDialog from "@/components/Dialog.vue";
import { rgbToHex } from "@/utils";

const curColor = ref("");
const colorHistory = ref([]);
const historyVisible = ref(false);
const noPermission = ref(false);
const noSupport = ref(false);

const onColor = (color) => {
  console.log("color", color, rgbToHex(color));
  curColor.value = rgbToHex(color.r, color.g, color.b);
};

const handleSave = () => {
  console.log("save", curColor.value);
  colorHistory.value.push(curColor.value);
};

const lastestColor = computed(() => {
  return colorHistory.value[colorHistory.value.length - 1];
});

onMounted(() => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 4096 },
          height: { ideal: 2160 },
        },
      })
      .then((stream) => {
      })
      .catch((err) => {
        console.error("navigator.mediaDevices.getUserMedia error: ", err);
        noPermission.value = true;
      });
  } else {
    console.error("navigator.mediaDevices is not supported");
    noSupport.value = true;
  }
})
</script>

<template>
  <div class="max-w-[400px] my-10 mx-auto" v-if="noPermission"> Permission denied</div>
  <div class="max-w-[400px] my-10 mx-auto" v-if="noSupport">not supported</div>
  <div
    v-if="!noPermission && !noSupport"
    class="relative h-[calc(100vh-64px)] lg:h-[calc(100vh-76px)] lg:min-h-[600px] min-h-[600px] max-w-[400px] my-0 mx-auto"
  >
    <!-- <div class="overflow-hidden">
      <div class="flex items-center flex-row-reverse gap-2 px-4 pt-4 h-[86px] overflow-auto">
        <ColorCard v-for="(cur, index) in colorHistory" :color="cur" @delete="() => {colorHistory && colorHistory.splice(index, 1)}" />
      </div>
    </div> -->
    <div class="relative p-4">
      <div class="w-[1px] h-[1px] bg-black absolute top-1/2 left-1/2">
        <!-- 倒三角形 -->
        <div class="triangle"></div>
        <div class="p-2 bg-white absolute -top-[48px] -left-[54px] rounded-md flex gap-2">
          <span class="block w-6 h-6" :style="{ background: curColor }"></span>
          {{ curColor }}
        </div>
      </div>
      <CameraPick @color="onColor" />
    </div>
    <div
      class="flex items-center justify-between absolute bottom-0 w-full p-4 pb-6 "
    >
      <div class="w-10 h-10 rounded bg-black" :style="{background: lastestColor}" @click="historyVisible = true"></div>
      <div
        class="w-20 h-20 flex items-center border-black dark:border-white rounded-full border-4 p-1 cursor-pointer"
        @click="handleSave"
      >
        <div class="w-16 h-16 rounded-full bg-black dark:bg-white"></div>
      </div>
      <div class="w-10 h-10 rounded bg-transparent"></div>
    </div>
    <UDialog :visible="historyVisible" @close="historyVisible = false">
      <div class="w-full p-2 grid grid-cols-4 gap-4 max-h-[400px] overflow-auto">
        <ColorCard v-for="(cur, index) in colorHistory" :color="cur" @delete="() => {colorHistory && colorHistory.splice(index, 1)}" />
      </div>
    </UDialog>
  </div>
</template>
<style>
.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #000;
}
.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
  position: absolute;
  bottom: 0; /* 根据需要调整位置 */
  left: 50%;
  transform: translateX(-50%);
}
@media (min-width: 1024px) {
  /* .color-camera { */
  /* min-height: 100vh; */
  /* } */
}
</style>
