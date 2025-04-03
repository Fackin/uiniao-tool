<template>
    <div class="cards-container">
      <PixelCard
        title="数据分析"
        description="通过高级算法分析您的数据，提供可视化报告和深入洞察。"
        iconClass="fas fa-chart-bar"
        iconBgColor="#4CAF50"
      />
      
      <PixelCard
        title="云存储"
        description="安全可靠的云端存储解决方案，随时随地访问您的文件。"
        iconClass="fas fa-cloud"
        iconBgColor="#2196F3"
      />
      
      <PixelCard
        title="智能助手"
        description="AI驱动的智能助手，帮助您自动化日常任务，提高工作效率。"
        iconClass="fas fa-robot"
        iconBgColor="#9C27B0"
      />
    </div>
  </template>
  
  <script setup>
  import PixelCard from '@/components/PixelCard.vue';
  </script>
  
  <style>
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    padding: 24px;
  }
  </style>