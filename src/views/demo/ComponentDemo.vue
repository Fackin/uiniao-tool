<template>
  <div class="container">
    <h1>Popover 示例</h1>

    <un-popover placement="bottom" :offset="12">
      <template #trigger>
        <un-button class="btn">基本 Popover</un-button>
      </template>
      <template #content>
        <div class="popover-body">
          <p>这是一个基本的弹出框内容</p>
        </div>
      </template>
    </un-popover>

    <un-popover placement="right" :autoPlacement="true" :maxWidth="200">
      <template #trigger>
        <un-button class="btn">自动调整位置</un-button>
      </template>
      <template #content>
        <div class="popover-body">
          <p>当空间不足时会自动调整位置</p>
        </div>
      </template>
    </un-popover>

    <un-popover ref="popoverRef" placement="top-end" :closeOnClickOutside="false">
      <template #trigger>
        <un-button class="btn">点击外部不关闭</un-button>
      </template>
      <template #content>
        <div class="popover-body">
          <p>这个弹出框需要手动关闭</p>
          <un-button @click="closePopover">关闭</un-button>
        </div>
      </template>
    </un-popover>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const popoverRef = ref(null);
function closePopover() {
  // 可以通过 ref 控制 Popover
  popoverRef.value?.close();
}
</script>

<style>
.btn {
  padding: 8px 16px;
  margin: 0 8px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popover-body {
  padding: 8px;
}

.container {
  padding: 20px;
  text-align: center;
}
</style>
