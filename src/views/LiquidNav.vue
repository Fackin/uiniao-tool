<template>
  <div
    class="flex flex-col w-20 h-screen bg-white/10 backdrop-blur-lg p-4 shadow-lg relative"
  >
    <!-- 流体背景 -->
    <!-- <div
      class="absolute left-0 w-full h-12 bg-blue-400 rounded-xl transition-all duration-500"
      :style="{ transform: `translateY(${activeIndex * 72}px)`, opacity: 1 }"
    ></div> -->

    <div
      v-for="(item, index) in items"
      :key="index"
      class="relative flex items-center justify-center p-3 mb-4 rounded-full transition-all cursor-pointer overflow-hidden"
      :class="{ 'bg-teal-400 nav-active': activeIndex === index }"
      @click="setActive(index)"
      @mouseover="hoveredIndex = index"
      @mouseleave="hoveredIndex = null"
    >
      <!-- <img
          :src="item.icon"
          class="relative z-10 w-8 h-8 transition-transform duration-200"
          :class="{ 'scale-125': hoveredIndex === index }"
        /> -->
      <component
        v-if="item.icon"
        :is="item.icon"
        class="relative z-10 w-6 h-6 transition-transform duration-200"
        :class="{ 'scale-125': hoveredIndex === index }"
      />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";

import IconColorCamera from "@/components/icons/IconColorCamera.vue";
import IconDynasty from "@/components/icons/IconHistory.vue";
import IconImageMagnifier from "@/components/icons/IconImageMagnifier.vue";

export default {
  setup() {
    const items = [
      { name: "Home", icon: IconColorCamera },
      { name: "Search", icon: IconDynasty },
      { name: "Settings", icon: IconImageMagnifier },
      { name: "Profile", icon: IconColorCamera },
    ];

    const activeIndex = ref(0);
    const hoveredIndex = ref(null);

    const setActive = (index) => {
      activeIndex.value = index;
    };

    return { items, activeIndex, hoveredIndex, setActive };
  },
};
</script>

<style lang="scss" scoped>
.menu-item {
  transition: background 0.3s ease-in-out;
}
.nav-active {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -10px;
    width: calc(100% + 20px);
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    z-index: -1;
  }
}
</style>
