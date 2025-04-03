<template>
  <div class="controls">
    <div class="background-control">
      <label for="background-style">背景样式:</label>
      <un-select
        v-model="backgroundStyle"
        :options="backgroundStyleOptions"
        width="180"
        themeColor="var(--color-primary)"
      />

      <div v-show="backgroundStyle === 'bgimg'" class="flex flex-wrap gap-2 my-2">
        <div v-for="(img, index) in imgs" :key="index" @click="changeBgImg(index)" >
          <un-image
            class="w-[120px] rounded-lg border-red-400"
            :class="{'border-2': backgroundImg === index}"
            :src="img.default"
            :should-compress="false"
            :width="120"
            :height="80"
          />
        </div>
        <!-- <img
          class="w-[120px] rounded-lg"
          v-for="(img, index) in imgs"
          :src="img.default"
          alt="bg img"
          @click="changeBgImg(index)"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, watch, ref, onMounted, toValue } from "vue";
import { compressImage } from "@/utils/image";

const { backgroundStyle, changeBackground, changeBackgroundImg, backgroundImg } = inject("backgroundStyle");

const backgroundStyleOptions = [
  { value: "grid", label: "网格马赛克" },
  { value: "blocks", label: "像素块" },
  { value: "dynamic", label: "动态马赛克" },
  { value: "gradient", label: "渐变马赛克" },
  { value: "bgimg", label: "背景图片" },
];

// img 方式
// interface IconFile {
//     default: string;
// }

// const reader = new FileReader();
//   reader.onload = (e) => {
//     compressImage(e.target.result, 200, 200, 0.7);
//   };
//   reader.readAsDataURL(file);

// 动态导入
const imgs = import.meta.glob("@/assets/img/bg/*.jpg", { eager: true });
// const imgs = import.meta.glob("@/assets/img/bg/*.jpg", {
//   as: "raw",
//   eager: true,
// });
console.log(imgs, "imgs---");
// const bgList = ref([]);
// for (const img in imgs) {
//   if (Object.prototype.hasOwnProperty.call(imgs, img)) {
//     console.log(imgs[img], "imgs[img]");
//     bgList.value.push(compressImage(imgs[img]));
//     // const reader = new FileReader();
//     // reader.onload = (e) => {
//     //   bgList.value.push(compressImage(e.target.result, 200, 200, 0.7));
//     // };
//     // reader.readAsDataURL(imgs[img].default);
//   }
// }
// console.log(bgList.value, "bgList");

const loadAndConvertImages = async () => {
  // 1. 动态导入图片
  const imageModules = import.meta.glob("@/assets/img/bg/*.{jpg,png}", {
    eager: true,
  });
  const imageUrls = Object.values(imageModules).map((module) => module.default);

  const imgLoad = async (file) => {
    const reader = new FileReader();
    let imgUrl = "";
    reader.onload = (e) => {
      imgUrl = compressImage(e.target.result, 200, 200, 0.7);
    };
    reader.readAsDataURL(file);
    return imgUrl;
  };
  // 2. 批量转换为 File 对象
  bgList.value = await Promise.all(
    imageUrls.map(async (url, index) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `bg-${index + 1}.${blob.type.split("/")[1]}`,
        { type: blob.type }
      );
      return {
        img: await imgLoad(file),
        name: `bg-${index + 1}.${blob.type.split("/")[1]}`,
      };
    })
  );
  console.log(bgList.value, "bgList");
};

// imgs.forEach((img, index) => {
//   const imgUrl = img.default;
//   bgList.push(compressImage(imgUrl));
// });
// 计算图标路径
// const iconSrc = ref(icons[`../assets/icons/qw/${props.iconId}.svg`]);
const bgStyle = ref();
const changeBgImg = (img) => {
  // bgImg.value = img;
  console.log(img, "img")
  changeBackgroundImg(img)
}
watch(
  () => backgroundStyle,
  (value) => {
    console.log(value, "value", toValue(value));
    changeBackground(toValue(value));
    //  if (bgStyle.value !== toValue(value)) {
    //    bgStyle.value = toValue(value);
    //  }
  },
  {
    immediate: true,
    deep: true,
  }
);
// watch(
//   () => bgStyle,
//   (value) => {
//     changeBackground(toValue(value));
//   }
// );
onMounted(() => {
  // loadAndConvertImages();
});
</script>

<style scoped>
.theme-switcher {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.theme-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 4px;
}

.theme-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.theme-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.theme-option.active {
  /* border-color: var(--color-text); */
  transform: scale(1.1);
  border-color: var(--color-primary) !important;
}

.theme-check {
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.system-theme-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.system-theme-button:hover {
  background-color: rgba(var(--color-primary-rgb), 0.1);
}

.system-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm0 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0-10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
