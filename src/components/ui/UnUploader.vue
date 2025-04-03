<template>
  <div
    class="upload-area"
    @dragover.prevent
    @dragenter.prevent
    @drop="handleDrop"
    @click="triggerFileInput"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/png"
      @change="handleFileUpload"
      hidden
    />
    <p v-if="!imagePreview">点击或拖拽上传 PNG 图片</p>
    <img v-if="imagePreview" :src="imagePreview" class="image-preview" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const fileInput = ref(null);
const imagePreview = ref(null);

const emits = defineEmits(["afterUpload"]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  processFile(file);
};

const handleDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  processFile(file);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const processFile = (file) => {
  if (!file || file.type !== "image/png") return alert("请上传 PNG 图片");
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      emits("afterUpload", img);
    };
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped>
.upload-area {
  width: 300px;
  height: 200px;
  border: 2px dashed #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}
.upload-area:hover {
  border-color: var(--color-primary);
  background: var(--color-bghover);
}
.image-preview {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
}
</style>
