<template>
  <!-- 触发元素 -->
  <div ref="referenceRef" @click="togglePopover" class="un-popover-trigger">
    <slot name="trigger"></slot>
  </div>

  <!-- 弹出内容 -->
  <div
    v-show="isOpen"
    ref="floatingRef"
    :style="floatingStyles"
    class="popover-content"
    :class="{
      'popover-enter-active': isOpen,
      'popover-leave-active': !isOpen,
    }"
    @click.stop
  >
    <slot name="content"></slot>
    <div ref="arrowRef" class="arrow" :style="arrowStyles" />
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  size,
  autoPlacement,
  hide,
} from "@floating-ui/vue";

const props = defineProps({
  placement: {
    type: String,
    default: "bottom",
    validator: (value) =>
      [
        "top",
        "top-start",
        "top-end",
        "right",
        "right-start",
        "right-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
      ].includes(value),
  },
  offset: {
    type: Number,
    default: 8,
  },
  arrowPadding: {
    type: Number,
    default: 8,
  },
  autoPlacement: {
    type: Boolean,
    default: false,
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
  closeOnEscape: {
    type: Boolean,
    default: true,
  },
  maxWidth: {
    type: Number,
    default: 300,
  },
  maxHeight: {
    type: Number,
    default: 200,
  },
  open: {
    type: Boolean,
    default: undefined,
  },
});

const emit = defineEmits(["open", "close", "update:open"]);

const isOpen = ref(props.open || false);
const referenceRef = ref(null);
const floatingRef = ref(null);
const arrowRef = ref(null);

const { floatingStyles, arrowStyles } = useFloating(referenceRef, floatingRef, {
  placement: props.placement,
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(props.offset),
    props.autoPlacement ? autoPlacement() : flip(),
    shift({ padding: 8 }),
    arrow({ element: arrowRef, padding: props.arrowPadding }),
    size({
      apply({ availableWidth, availableHeight, elements }) {
        elements.floating.style.maxWidth = `${Math.min(
          availableWidth,
          props.maxWidth
        )}px`;
        elements.floating.style.maxHeight = `${Math.min(
          availableHeight,
          props.maxHeight
        )}px`;
        elements.floating.style.overflow = "auto";
      },
    }),
    hide({ strategy: "referenceHidden" }),
  ],
});

function togglePopover() {
  if (!props.closeOnClickOutside && isOpen.value) return;
  if (props.open !== undefined) {
    emit("update:open", !props.open);
  } else {
    isOpen.value = !isOpen.value;
  }

  if (isOpen.value) {
    emit("open");
  } else {
    emit("close");
  }
}

function closePopover() {
  if (props.open !== undefined) {
    emit("update:open", false);
  } else {
    isOpen.value = false;
  }
  emit("close");
}

function handleClickOutside(event) {
  if (
    isOpen.value &&
    floatingRef.value &&
    !floatingRef.value.contains(event.target) &&
    !referenceRef.value.contains(event.target)
  ) {
    closePopover();
  }
}

function handleKeydown(event) {
  if (event.key === "Escape" && isOpen.value && props.closeOnEscape) {
    closePopover();
  }
}

watch(
  () => props.open,
  (newVal) => {
    if (newVal !== undefined) {
      isOpen.value = newVal;
    }
  }
);

watch(isOpen, (newVal) => {
  if (newVal) {
    if (props.closeOnClickOutside) {
      document.addEventListener("click", handleClickOutside);
    }
    if (props.closeOnEscape) {
      document.addEventListener("keydown", handleKeydown);
    }
  } else {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeydown);
});

defineExpose({
    close: closePopover,
})
</script>

<style scoped>
.un-popover-trigger {
  display: inline-block;
}
.popover-content {
  position: absolute;
  z-index: 9999;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-width: 100px;
  transition: all 0.2s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.popover-enter-active {
  opacity: 1;
  transform: translateY(0);
}

.popover-leave-active {
  opacity: 0;
  transform: translateY(-10px);
}

.arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: rotate(45deg);
  border: 1px solid transparent;
  border-left-color: #e2e8f0;
  border-top-color: #e2e8f0;
}
</style>
