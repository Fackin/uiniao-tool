<template>
    <div class="pixel-404-container" :class="{ 'dark-mode': isDarkMode }">
      <!-- 像素化背景网格 -->
      <div class="pixel-background">
        <div v-for="i in 100" :key="`bg-${i}`" class="bg-pixel" 
             :style="{ backgroundColor: getRandomBgColor(), opacity: getRandomOpacity() }">
        </div>
      </div>
      
      <!-- 主要内容 -->
      <div class="content-container">
        <!-- 像素化 404 文字 -->
        <div class="pixel-404">
          <div v-for="(row, rowIndex) in pixel404Pattern" :key="`row-${rowIndex}`" class="pixel-row">
            <div v-for="(cell, cellIndex) in row" :key="`cell-${rowIndex}-${cellIndex}`" 
                 class="pixel-cell" :class="{ 'active': cell === 1 }">
            </div>
          </div>
        </div>
        
        <!-- 错误信息 -->
        <h1 class="error-title">页面未找到</h1>
        <p class="error-message">您访问的页面可能已被移除、名称已更改或暂时不可用。</p>
        
        <!-- 像素化按钮 -->
        <div class="action-buttons">
          <button class="pixel-button home-button" @click="goHome">
            <span class="button-text">返回首页</span>
          </button>
          <button class="pixel-button back-button" @click="goBack">
            <span class="button-text">返回上页</span>
          </button>
        </div>
      </div>
      
      <!-- 像素化角色 -->
      <div class="pixel-character">
        <div v-for="(row, rowIndex) in pixelCharacterPattern" :key="`char-row-${rowIndex}`" class="pixel-row">
          <div v-for="(cell, cellIndex) in row" :key="`char-cell-${rowIndex}-${cellIndex}`" 
               class="pixel-cell" :style="{ backgroundColor: getCharacterColor(cell) }">
          </div>
        </div>
      </div>
      
      <!-- 像素化地面 -->
      <div class="pixel-ground">
        <div v-for="i in 20" :key="`ground-${i}`" class="ground-block">
          <div class="ground-top"></div>
          <div class="ground-side"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // 暗色模式检测
  const isDarkMode = ref(false);
  
  onMounted(() => {
    checkDarkMode();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode);
    
    // 添加键盘导航
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
  
  const checkDarkMode = () => {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  // 键盘导航
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Backspace') {
      goBack();
    } else if (e.key === 'Home' || e.key === 'h') {
      goHome();
    }
  };
  
  // 导航方法
  const goHome = () => {
    router.push('/');
  };
  
  const goBack = () => {
    router.back();
  };
  
  // 随机背景颜色
  const bgColors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF'];
  const getRandomBgColor = () => {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  };
  
  const getRandomOpacity = () => {
    return (Math.random() * 0.5 + 0.1).toFixed(2);
  };
  
  // 角色颜色映射
  const characterColors = {
    0: 'transparent',
    1: '#333333', // 轮廓
    2: '#FF5252', // 主色
    3: '#FF9800', // 次色
    4: '#FFEB3B', // 亮色
    5: '#FFFFFF', // 白色
  };
  
  const getCharacterColor = (value: number) => {
    return characterColors[value as keyof typeof characterColors] || 'transparent';
  };
  
  // 404 图案 (简化版)
  const pixel404Pattern = [
    [0,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0],
    [0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0],
    [1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0],
    [1,1,1,1,1,0,1,0,0,1,0,1,1,1,1,1],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0]
  ];
  
  // 像素角色图案 (简化版)
  const pixelCharacterPattern = [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,2,2,2,2,1,0,0,0],
    [0,0,1,2,2,2,2,2,2,1,0,0],
    [0,0,1,2,2,2,2,2,2,1,0,0],
    [0,0,1,2,2,2,2,2,2,1,0,0],
    [0,0,1,1,3,3,3,3,1,1,0,0],
    [0,1,3,3,3,3,3,3,3,3,1,0],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,3,3,3,3,1,3,3,1],
    [1,3,3,5,1,3,3,1,5,3,3,1],
    [0,1,3,3,3,1,1,3,3,3,1,0],
    [0,0,1,3,3,3,3,3,3,1,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0]
  ];
  </script>
  
  <style scoped>
  .pixel-404-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #f8f9fa;
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
  }
  
  /* 像素化背景 */
  .pixel-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    z-index: 0;
  }
  
  .bg-pixel {
    width: 100%;
    height: 100%;
    transition: background-color 3s ease;
  }
  
  /* 内容容器 */
  .content-container {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem;
    max-width: 600px;
  }
  
  /* 像素化 404 */
  .pixel-404 {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
  }
  
  .pixel-row {
    display: flex;
  }
  
  .pixel-cell {
    width: 12px;
    height: 12px;
    margin: 1px;
  }
  
  .pixel-cell.active {
    background-color: #333;
  }
  
  /* 错误信息 */
  .error-title {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
    text-transform: uppercase;
    letter-spacing: -1px;
  }
  
  .error-message {
    font-size: 1rem;
    margin-bottom: 2rem;
    color: #666;
    line-height: 1.5;
  }
  
  /* 像素化按钮 */
  .action-buttons {
    display: flex;
    gap: 1rem;
  }
  
  .pixel-button {
    position: relative;
    padding: 0.75rem 1.5rem;
    border: none;
    background-color: #333;
    color: white;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 70%,
      90% 100%,
      0% 100%
    );
  }
  
  .home-button {
    background-color: #4CAF50;
  }
  
  .back-button {
    background-color: #2196F3;
  }
  
  .pixel-button:hover {
    transform: translateY(-3px);
    filter: brightness(1.1);
  }
  
  .pixel-button:active {
    transform: translateY(0);
  }
  
  .button-text {
    position: relative;
    z-index: 1;
  }
  
  /* 像素化角色 */
  .pixel-character {
    position: absolute;
    bottom: 120px;
    right: 10%;
    z-index: 1;
    transform: scale(3);
    image-rendering: pixelated;
  }
  
  /* 像素化地面 */
  .pixel-ground {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    display: flex;
    z-index: 1;
  }
  
  .ground-block {
    position: relative;
    width: 5%;
    height: 100%;
  }
  
  .ground-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background-color: #8BC34A;
  }
  
  .ground-side {
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #795548;
  }
  
  /* 暗色模式 */
  .dark-mode {
    background-color: #121212;
  }
  
  .dark-mode .error-title {
    color: #f8f9fa;
  }
  
  .dark-mode .error-message {
    color: #adb5bd;
  }
  
  .dark-mode .pixel-cell.active {
    background-color: #f8f9fa;
  }
  
  .dark-mode .ground-top {
    background-color: #558B2F;
  }
  
  .dark-mode .ground-side {
    background-color: #4E342E;
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .pixel-404 {
      transform: scale(0.8);
    }
    
    .error-title {
      font-size: 1.5rem;
    }
    
    .error-message {
      font-size: 0.875rem;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .pixel-character {
      right: 5%;
      transform: scale(2);
    }
  }
  
  @media (max-width: 480px) {
    .pixel-404 {
      transform: scale(0.6);
    }
    
    .pixel-character {
      display: none;
    }
  }
  
  /* 动画效果 */
  @keyframes float {
    0% { transform: translateY(0) scale(3); }
    50% { transform: translateY(-10px) scale(3); }
    100% { transform: translateY(0) scale(3); }
  }
  
  .pixel-character {
    animation: float 3s ease-in-out infinite;
  }
  </style>