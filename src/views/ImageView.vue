<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ImageMagnifier from "@/components/ImageMagnifier.vue";

const currentMode = ref<'magnify' | 'shrink' | 'blur' | 'funny'>('magnify');
const funnyType = ref<'squeeze' | 'stretch' | 'wave'>('squeeze');
const blurAmount = ref(5);
const zoom = ref(2);

// 默认图片
const imageUrl = ref('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_Repaired.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_Repaired.jpg');

// 处理图片上传
const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    imageUrl.value = URL.createObjectURL(file);
  }
};

const modes = [
  { value: 'magnify', label: '放大镜' },
  { value: 'shrink', label: '缩小镜' },
  { value: 'blur', label: '模糊镜' },
  { value: 'funny', label: '哈哈镜' }
];

const funnyTypes = [
  { value: 'squeeze', label: '挤压' },
  { value: 'stretch', label: '拉伸' },
  { value: 'wave', label: '波浪' }
];


// 检测是否为移动设备
const isMobile = ref(false);

onMounted(() => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
});




const handleModeChange = (mode: string) => {
  currentMode.value = mode as any;
  if (mode === 'funny') {
    funnyType.value = 'squeeze';
    zoom.value = 1;
  } else if (mode === 'blur') {
    blurAmount.value = 5;
    zoom.value = 1;
  } else {
    zoom.value = 2;
  }
};
</script>

<template>
  <div class="demo-container" :class="{ mobile: isMobile }">
    <!-- 移动端标题 -->
    <h1 class="mobile-title" v-if="isMobile">图片特效工具</h1>

    <div class="controls" :class="{ 'mobile-controls': isMobile }">
      <!-- 模式选择 -->
      <div class="control-section">
        <h3>模式选择</h3>
        <div class="control-group">
          <div class="button-group">
            <button 
              v-for="mode in modes" 
              :key="mode.value"
              :class="{ active: currentMode === mode.value }"
              @click="handleModeChange(mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- 效果参数 -->
      <div class="control-section" v-if="currentMode === 'funny'">
        <h3>哈哈镜效果</h3>
        <div class="control-group">
          <div class="button-group">
            <button 
              v-for="type in funnyTypes" 
              :key="type.value"
              :class="{ 'active': funnyType === type.value }"
              @click="() => { funnyType = type.value as any }"
            >
              {{ type.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- 滑块控制 -->
      <div class="control-section" v-if="currentMode === 'blur'">
        <h3>模糊程度</h3>
        <div class="slider-group">
          <input 
            type="range" 
            v-model="blurAmount" 
            min="1" 
            max="10" 
            step="1"
          >
          <span class="slider-value">{{ blurAmount }}</span>
        </div>
      </div>

      <div class="control-section" v-if="currentMode === 'magnify' || currentMode === 'shrink'">
        <h3>缩放倍数</h3>
        <div class="slider-group">
          <input 
            type="range" 
            v-model="zoom" 
            min="1" 
            max="4" 
            step="0.5"
          >
          <span class="slider-value">{{ zoom }}x</span>
        </div>
      </div>

      <!-- 图片上传 -->
      <div class="control-section">
        <h3>更换图片</h3>
        <div class="upload-group">
          <label for="image-upload" class="upload-button">
            选择图片
            <input 
              id="image-upload"
              type="file" 
              accept="image/*" 
              @change="handleImageUpload"
              class="file-input"
            >
          </label>
        </div>
      </div>
    </div>

    <div class="image-container" :class="{ 'mobile-image': isMobile }">
      <ImageMagnifier
        :imageUrl="imageUrl"
        :zoom="zoom"
        :mode="currentMode"
        :blurAmount="blurAmount"
        :funnyType="funnyType"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  overflow: auto;
}

.demo-container.mobile {
  padding: 10px;
}

.mobile-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.controls {
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-controls {
  padding: 15px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.control-section {
  margin-bottom: 20px;
}

.control-section h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 1rem;
}

.control-group {
  /* margin-bottom: 15px; */
  display: flex;
  align-items: center;
  gap: 10px;
}

/* .control-group:last-child {
  margin-bottom: 0;
}

label {
  min-width: 100px;
  font-weight: bold;
} */

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.mobile button {
  padding: 6px 12px;
  font-size: 0.85rem;
}

button:hover {
  background: #f0f0f0;
}

button.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 3px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #1890ff;
  border-radius: 50%;
  cursor: pointer;
}

.slider-value {
  min-width: 40px;
  text-align: center;
  font-size: 0.9rem;
}

.upload-group {
  display: flex;
  justify-content: center;
}

.upload-button {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  background: #1890ff;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.upload-button:hover {
  background: #40a9ff;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.mobile-image {
  min-height: 300px;
  padding: 10px;
  margin: 0 -10px;
  border-radius: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .control-group {
    flex-direction: column;
    align-items: stretch;
  }

  .button-group {
    justify-content: center;
  }

  .slider-group {
    flex-direction: column;
    gap: 10px;
  }

  .slider-value {
    text-align: center;
  }

  .control-section {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }

  .control-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .mobile-controls {
    margin: -10px -10px 10px -10px;
    border-radius: 0;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .mobile-controls {
    background: #1f1f1f;
  }

  .control-section h3 {
    color: #fff;
  }

  button {
    background: #2f2f2f;
    border-color: #3f3f3f;
    color: #fff;
  }

  button:hover {
    background: #3f3f3f;
  }

  .image-container {
    background: #1f1f1f;
  }
}
</style>