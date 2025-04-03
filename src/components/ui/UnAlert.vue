<script setup lang="ts">
import { useAlert, type Alert } from "@/hooks/useAlert";

const { alerts, removeAlert } = useAlert();

// 样式映射
const alertStyles: Record<Alert["type"], string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-5 left-1/2 transform -translate-x-1/2 space-y-2 z-50">
      <transition-group name="fade">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="[
            'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm',
            alertStyles[alert.type],
          ]"
        >
          <span>{{ alert.message }}</span>
          <button
            @click="removeAlert(alert.id)"
            class="ml-auto text-white font-bold"
          >
            ×
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
