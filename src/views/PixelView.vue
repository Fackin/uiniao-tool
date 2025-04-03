<template>
    <PixelBackground>
      <div class="pixel-content">
        <h1 class="pixel-title">复古像素风格</h1>
        <div class="pixel-card">
          <p>这是一个复古像素风格的网站背景</p>
          <button class="pixel-button">点击我</button>
        </div>
      </div>
    </PixelBackground>
  </template>
  
  <script setup>
  import PixelBackground from '@/components/PixelBackground.vue';
  </script>
  
  <style scoped>
  .pixel-content {
    font-family: 'Press Start 2P, system-ui, sans-serif';
    text-align: center;
    color: #fff;
    text-shadow: 2px 2px 0 #000;
  }
  
  .pixel-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    letter-spacing: -1px;
  }
  
  .pixel-card {
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 4px;
    max-width: 500px;
    margin: 0 auto;
    border: 4px solid #fff;
    box-shadow: 8px 8px 0 0 rgba(0, 0, 0, 0.5);
  }
  
  .pixel-button {
    background-color: #ff5555;
    color: white;
    border: none;
    padding: 8px 16px;
    margin-top: 1rem;
    font-family: 'Press Start 2P', system-ui, sans-serif;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 4px 4px 0 0 #000;
    transition: all 0.1s;
  }
  
  .pixel-button:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 0 #000;
  }
  
  .pixel-button:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 0 #000;
  }
  </style>