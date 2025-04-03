<template>
  <div class="thumbnail-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-placeholder">
      <span>加载中...</span>
    </div>

    <!-- 最终展示的图片 -->
    <img
      v-else
      :src="displayUrl"
      :alt="alt"
      :style="{
        width: `${width}px`,
        height: `${height}px`,
        objectFit: fit,
      }"
      class="thumbnail-image"
    />
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
// import Compressor from "compressorjs";
import { compressImage } from "@/utils/image";

const props = defineProps({
  src: {
    type: [String, File, Blob],
    required: true,
  },
  alt: {
    type: String,
    default: "thumbnail",
  },
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 200,
  },
  fit: {
    type: String,
    default: "cover", // 可选: contain, fill, none, scale-down
  },
  quality: {
    type: Number,
    default: 0.7, // 压缩质量 (0-1)
    validator: (value) => value >= 0 && value <= 1,
  },
  shouldCompress: {
    type: Boolean,
    default: true, // 是否启用压缩
  },
});

const displayUrl = ref("");
const loading = ref(false);

// 释放 Blob URL 避免内存泄漏
onUnmounted(() => {
  if (displayUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(displayUrl.value);
  }
});

// 处理图片（压缩或直接展示）
const processImage = async () => {
  loading.value = true;

  try {
    // 情况 1: 不需要压缩 → 直接使用原图
    if (!props.shouldCompress) {
      displayUrl.value = await getImageUrl(props.src);
      loading.value = false;
      return;
    }

    // 情况 2: 需要压缩 → 使用 compressorjs
    if (props.src instanceof File || props.src instanceof Blob) {
      await compressBlob(URL.createObjectURL(props.src));
    } else if (typeof props.src === "string") {
      // 如果是 URL，先 fetch 获取 Blob
    //   const blob = await fetch(props.src).then((res) => res.blob());
    //   await compressBlob(blob);
      await compressBlob(props.src);
    }
  } catch (error) {
    console.error("图片处理失败:", error);
    displayUrl.value = props.src; // 回退到原图
  } finally {
    console.log("finally------");
    
  }
};

// 压缩 Blob/File 图片
const compressBlob = (blob) => {
  return new Promise((resolve) => {
    try {
      console.log(blob, "blob------");
      compressImage(
        blob,
        props.width,
        props.height,
        props.quality,
        (result) => {
          console.log(result, "result------");
          displayUrl.value = URL.createObjectURL(result);
          loading.value = false;
          resolve();
        }
      );
      resolve();
    } catch (error) {
      console.warn("压缩失败，使用原图:", error);
      displayUrl.value = URL.createObjectURL(blob);
      loading.value = false;
      resolve();
    }
    // new Compressor(blob, {
    //   quality: props.quality,
    //   width: props.width,
    //   height: props.height,
    //   success(result) {
    //     displayUrl.value = URL.createObjectURL(result);
    //     resolve();
    //   },
    //   error(err) {
    //     console.warn("压缩失败，使用原图:", err);
    //     displayUrl.value = URL.createObjectURL(blob);
    //     resolve();
    //   },
    // });
  });
};

// 获取图片 URL（支持 File/Blob/字符串）
const getImageUrl = async (src) => {
  if (src instanceof File || src instanceof Blob) {
    return URL.createObjectURL(src);
  }
  return src; // 直接返回字符串 URL
};

// 监听 src 变化，重新处理图片
watch(() => props.src, processImage, { immediate: true });
</script>

<style scoped>
.thumbnail-container {
  display: inline-block;
  position: relative;
}

.loading-placeholder {
  width: v-bind('props.width + "px"');
  height: v-bind('props.height + "px"');
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
}

.thumbnail-image {
  display: block;
  border-radius: 4px;
  background: #f5f5f5;
}
</style>
