<template>
  <div class="dropdown-container">
    <!-- 触发按钮 -->
    <div ref="triggerRef" @click="toggleDropdown">
      <slot name="trigger"></slot>
    </div>

    <!-- 下拉菜单 -->
    <div
      v-if="visible"
      ref="dropdownRef"
      class="dropdown"
      :style="{ zIndex: 999 }"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { createPopper } from "@popperjs/core";

const visible = ref(false);
const triggerRef = ref(null);
const dropdownRef = ref(null);
let popperInstance = null;

const toggleDropdown = () => {
  visible.value = !visible.value;
  if (visible.value) {
    createPopperInstance();
  } else {
    destroyPopperInstance();
  }
};

const createPopperInstance = () => {
  if (triggerRef.value && dropdownRef.value) {
    popperInstance = createPopper(triggerRef.value, dropdownRef.value, {
      placement: "bottom-start",
      modifiers: [
        { name: "preventOverflow", options: { boundary: "viewport" } },
        { name: "flip", options: { fallbackPlacements: ["top-start"] } },
      ],
    });
  }
};

const destroyPopperInstance = () => {
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
};

// 监听 `visible` 变化，当关闭时销毁 Popper
watch(visible, (newValue) => {
  if (!newValue) {
    destroyPopperInstance();
  }
});

// 点击外部自动关闭
const handleClickOutside = (event) => {
  if (
    triggerRef.value &&
    dropdownRef.value &&
    !triggerRef.value.contains(event.target) &&
    !dropdownRef.value.contains(event.target)
  ) {
    visible.value = false;
  }
};

// 监听事件
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  destroyPopperInstance();
});
</script>

<style scoped>
.dropdown {
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 150px;
  position: absolute;
  padding: 8px;
  border-radius: 4px;
}

.dropdown-container {
  display: inline-block;
}
</style>
