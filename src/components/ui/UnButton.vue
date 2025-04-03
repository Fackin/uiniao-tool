<template>
  <button
    class="un-button un-button--variant-elevated rounded-lg"
    :class="[size, { disabled }]"
    @click="handleClick"
    ref="button"
    :style="{ backgroundColor: themeColor, height: `${height}px` }"
  >
    <div class="content">
      <span v-if="icon" class="icon">
        <i :class="icon"></i>
      </span>
      <slot></slot>
      <span class="ripple-container"></span>
    </div>
  </button>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  size: { type: String, default: "medium" }, // 可选 small, medium, large
  disabled: { type: Boolean, default: false },
  color: { type: String, default: "#007bff" }, // 自定义颜色
  icon: { type: String, default: "" }, // 图标类名
  themeColor: { type: String, default: "#007bff" }, // 主题颜色
  height: { type: String, default: () => "40" },
});

const button = ref(null);

const handleClick = (event) => {
  if (props.disabled) return;

  const buttonElement = button.value;
  const rippleContainer = buttonElement.querySelector(".ripple-container");
  const circle = document.createElement("span");

  const rect = buttonElement.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  circle.style.width = circle.style.height = `${size}px`;
  circle.style.left = `${event.clientX - rect.left - size / 2}px`;
  circle.style.top = `${event.clientY - rect.top - size / 2}px`;
  circle.classList.add("ripple");

  rippleContainer.appendChild(circle);
  setTimeout(() => {
    circle.remove();
  }, 600);
};
</script>

<style scoped>
.un-button {
  position: relative;
  overflow: hidden;
  padding: 4px 20px;
  border: none;
  color: white;
  /* border-radius: 4px; */
  cursor: pointer;
  transition: background 0.3s;
}

.un-button + .un-button {
  margin-left: 10px;
}
/* .un-button--variant-elevated {
  background-color: #fff !important;
  color: rgba(0, 0, 0, 0.87);
  box-shadow: 0 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0 2px 2px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0 1px 5px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));
} */

.un-button .content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.un-button:hover {
  filter: brightness(0.9);
}
.un-button.disabled {
  background-color: #ccc !important;
  cursor: not-allowed;
}

.icon {
  display: flex;
  align-items: center;
}

.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

:deep(.ripple-container .ripple) {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple-effect 0.6s linear;
}

@keyframes ripple-effect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
