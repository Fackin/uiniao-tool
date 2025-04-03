<template>
  <div ref="placeholderRef">
    <Transition name="fade">
      <button
        v-show="isVisible"
        @click="scrollToTop"
        class="back-to-top flex justify-center items-center"
      >
        <IconRocket :onFire="isOnFire" class="h-[40px] w-[40px]" />
      </button>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, watch, ref, onMounted, onUnmounted } from "vue";
import { getScrollParent, unwrapElement } from "seemly";
import IconRocket from "@/components/icons/IconRocket.vue";
import { isDocument } from "./utils";

const isVisible = ref(false);
const isOnFire = ref(false);
const placeholderRef = ref<HTMLDivElement | null>(null);

let scrollElement: HTMLDivElement | Document;

const props = defineProps({
  visibilityHeight: {
    type: Number,
    default: 180,
  },
  listenTo: [String, Object, Function] as PropType<
    string | HTMLElement | Document | (() => HTMLElement | Document)
  >,
});

const init = () => {
  const scrollEll =
    unwrapElement(props.listenTo) || getScrollParent(placeholderRef.value);
  if (!scrollEll) return;
  scrollElement =
    scrollEll === document.documentElement
      ? document
      : (scrollEll as HTMLDivElement | Document);
  console.log(scrollElement, "000----");
  scrollElement.addEventListener("scroll", handleScroll);
  handleScroll();
};
const handleScroll = () => {
  const scrollTop = (
    isDocument(scrollElement) ? document.documentElement : scrollElement
  ).scrollTop;
  if (!scrollTop) return;
  isVisible.value = scrollTop > props.visibilityHeight;
};

const scrollToTop = () => {
  isOnFire.value = true;
  (isDocument(scrollElement)
    ? document.documentElement
    : scrollElement
  ).scrollTo({ top: 0, behavior: "smooth" });
};

watch(
  () => isVisible.value,
  (val) => {
    if (!val) {
      setTimeout(() => {
        isOnFire.value = false;
      }, 500);
    }
  }
);

onMounted(() => {
  init();
});

onUnmounted(() => {
  scrollElement.removeEventListener("scroll", handleScroll);
});
</script>

<style>
/* 按钮样式 */
.back-to-top {
  position: fixed;
  bottom: 50px;
  right: 50px;
  background: var(--color-background);
  color: var(--color-primary);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, opacity 0.3s;
}

/* 悬浮放大 */
.back-to-top:hover {
  background: var(--color-bghover);
  transform: scale(1.1);
}

/* Vue 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
