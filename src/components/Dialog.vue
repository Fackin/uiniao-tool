<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  visible: boolean;
  title: string;
  width?: number | string;
  height?: number | string;
}>();
const emit = defineEmits(["close"]);
</script>

<template>
  <div
    v-if="visible"
    class="h-full bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 bottom-0 right-0 z-5000"
    @click.stop="emit('close')"
  >
    <div
      @click.stop="() => {}"
      class="bg-white rounded-md w-[360px] min-h-[200px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div class="flex justify-center items-center h-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
