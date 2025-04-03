<script setup lang="ts">
import { HeartIcon } from "lucide-vue-next";
import { ref, watchEffect, computed } from "vue";

const props = defineProps({
  iconId: {
    type: [String, Number],
    default: () => "100",
  },
  width: {
    type: [String, Number],
    default: () => "20",
  },
  height: {
    type: [String, Number],
    default: () => "20",
  },
});

// 判断props.width 是否是字符串，如果是则直接使用字符串值，否则拼接为 "px"
// const widthValue = computed(() =>
//   typeof props.width === "string" && props.width.indexOf("px") > -1
//     ? props.width
//     : `${props.width}px`
// );
// const heightValue = computed(() =>
//   typeof props.height === "string" && props.height.indexOf("px") > -1
//     ? props.height
//     : `${props.height}px`
// );

// img 方式
// interface IconFile {
//     default: string;
// }
// 动态导入 SVG
// const icons = import.meta.glob('../assets/icons/qw/*.svg', { eager: true });
// 计算图标路径
// const iconSrc = ref<IconFile>(icons[`../assets/icons/qw/${props.iconId}.svg`] as IconFile);

// 动态导入 SVG 内容
const icons = import.meta.glob("../assets/icons/qw/*.svg", {
  as: "raw",
  eager: true,
});
console.log(icons);
const svgContent = ref("");

const widthValue = ref("20px");
const heightValue = ref("20px");

watchEffect(() => {
  svgContent.value = icons[`../assets/icons/qw/${props.iconId}.svg`] || "";

  widthValue.value =
    typeof props.width === "string" && props.width.indexOf("px") > -1
      ? props.width
      : `${props.width}px`;
  heightValue.value =
    typeof props.height === "string" && props.height.indexOf("px") > -1
      ? props.height
      : `${props.height}px`;
});
</script>

<template>
  <!-- <img class="weather-icon" v-if="iconSrc" :src="iconSrc.default" alt="weather icon" /> // img 方式 -->
  <div v-if="svgContent" v-html="svgContent" class="weather-icon"></div>
</template>
<style scoped>
.weather-icon {
  color: var(--color-primary);
  width: v-bind(widthValue);
  height: v-bind(heightValue);
}
:deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
