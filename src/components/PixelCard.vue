<template>
    <div class="pixel-card" :class="{ 'dark-mode': isDarkMode }">
      <!-- 左上角像素装饰 -->
      <!-- <div class="pixel-corner top-left">
        <div class="pixel" v-for="i in 9" :key="`tl-${i}`" 
             :style="{ backgroundColor: getPixelColor(i, 'topLeft') }"></div>
      </div> -->
      
      <!-- 卡片内容 -->
      <div class="card-content">
        <div class="card-icon" :style="{ backgroundColor: iconBgColor }">
          <i :class="iconClass"></i>
        </div>
        
        <h3 class="card-title">{{ title }}</h3>
        
        <p class="card-description">{{ description }}</p>
      </div>
      
      <!-- 右下角像素装饰 -->
      <div class="pixel-corner bottom-right">
        <div class="pixel" v-for="i in 9" :key="`br-${i}`"
             :style="{ backgroundColor: getPixelColor(i, 'bottomRight') }"></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  
  const props = defineProps<{
    title: string;
    description: string;
    iconClass: string;
    iconBgColor?: string;
    primaryColor?: string;
  }>();
  
  // 默认值
  const defaultPrimaryColor = '#2c3e50';
  const primaryColor = computed(() => props.primaryColor || defaultPrimaryColor);
  const iconBgColor = computed(() => props.iconBgColor || primaryColor.value);
  
  // 像素颜色生成
  const getPixelColor = (index: number, position: 'topLeft' | 'bottomRight') => {
    // 创建一个3x3的像素网格，只在特定位置显示颜色
    const patterns = {
      topLeft: [2, 3, 4, 7],
      bottomRight: [3, 5, 7, 9]
    };
    
    const pattern = patterns[position];
    
    if (pattern.includes(index)) {
      // 使用主色调的不同透明度
      const alpha = position === 'topLeft' ? 1 : 0.7;
      return `${primaryColor.value}${alpha === 1 ? '' : Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
    }
    
    return 'transparent';
  };
  
  // 暗色模式检测
  const isDarkMode = ref(false);
  
  onMounted(() => {
    // 检测系统暗色模式
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 监听暗色模式变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      isDarkMode.value = e.matches;
    });
  });
  </script>
  
  <style scoped>
  .pixel-card {
    position: relative;
    width: 100%;
    max-width: 320px;
    min-height: 180px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 24px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .pixel-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .pixel-corner {
    position: absolute;
    display: grid;
    grid-template-columns: repeat(3, 8px);
    grid-template-rows: repeat(3, 8px);
    gap: 2px;
  }
  
  .top-left {
    top: 8px;
    left: 8px;
  }
  
  .bottom-right {
    bottom: 8px;
    right: 8px;
  }
  
  .pixel {
    width: 8px;
    height: 8px;
    transition: background-color 0.3s ease;
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 1;
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: white;
    font-size: 24px;
  }
  
  .card-title {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
  }
  
  .card-description {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #666666;
  }
  
  /* 暗色模式 */
  .dark-mode {
    background-color: #2a2a2a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .dark-mode .card-title {
    color: #ffffff;
  }
  
  .dark-mode .card-description {
    color: #bbbbbb;
  }
  
  .dark-mode:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .pixel-card {
      max-width: 100%;
    }
  }
  </style>