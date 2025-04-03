<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  visible: boolean;
  title?: string;
  width?: number | string;
  height?: number | string;
}>();
const emit = defineEmits(["close"]);
</script>

<template>
  <Transition :duration="300" name="nested">
    <div
      v-if="visible"
      class="outer h-full bg-[rgba(0,0,0,0.3)] fixed top-0 left-0 bottom-0 right-0 z-50"
      @click.stop="emit('close')"
    >
      <div
        @click.stop="() => {}"
        class="inner rounded-md w-[300px] h-[calc(100%-20px)] absolute top-[10px] right-[10px] transform shadow-xl"
      >
        <div class="h-full p-4 overflow-auto">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.inner {
  background-color: var(--color-surface);
  /* var(--color-background); */
}

.nested-enter-active, .nested-leave-active {
	transition: all 0.3s ease-in-out;
}
/* delay leave of parent element */
.nested-leave-active {
  transition-delay: 0.3s;
}

/* .nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
} */

/* 应用于嵌套元素的规则 */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

/* .nested-enter-active .inner {
	transition-delay: 0.3s;
} */

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(300px);
  /* opacity: 0.001; */
  /* transition-delay: 0.3s; */
}
</style>
