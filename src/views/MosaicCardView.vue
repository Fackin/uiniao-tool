<template>
    <div class="cards-container">
      <MosaicCard
        title="像素艺术"
        subtitle="复古游戏风格"
        imageUrl="/images/pixel-art.jpg"
        actionText="探索更多"
        :pixelSize="10"
        @action="handleAction"
      >
        像素艺术起源于早期电子游戏，由于硬件限制而诞生。如今，它成为了一种独特的艺术风格，深受复古游戏爱好者喜爱。
      </MosaicCard>
    </div>
  </template>
  
  <script setup>
  import MosaicCard from '@/components/MosaicCard.vue';
  
  const handleAction = () => {
    console.log('Card action clicked');
  };
  </script>