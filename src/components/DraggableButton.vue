<template>
  <div
    ref="draggableRef"
    class="draggable-button"
    :style="draggableButton"
    @click="handleClick"
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @touchstart="startDrag"
    @touchend="stopDrag"
  >
    <slot :is-parent-dragging="isParentDragging"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";

// 从本地存储获取位置信息
const loadPosition = () => {
  const savedPosition = localStorage.getItem("draggable-position");
  if (savedPosition) {
    return JSON.parse(savedPosition);
  }
  return { x: 100, y: 100 };
};

// 保存位置信息到本地存储
const savePosition = (x: number, y: number) => {
  localStorage.setItem("draggable-position", JSON.stringify({ x, y }));
};

const draggableRef = ref<HTMLDivElement | null>(null);
const position = ref(loadPosition());
const isDragging = ref(false);
const startPos = ref({ x: 0, y: 0 });

// 计算位置样式
const draggableButton = computed(() => {
  const defaultStyle = {
    position: "fixed",
    left: `${position.value.x}px`,
    right: "auto",
    top: `${position.value.y}px`,
    bottom: "auto",
    cursor: isDragging.value ? "grabbing" : "grab",
    zIndex: 1000,
  } as any;
  if (position.value.x < 0) {
    defaultStyle.left = "0px";
    defaultStyle.right = `${-position.value.x}px`;
  }
  if (position.value.y < 0) {
    defaultStyle.top = "0px";
    defaultStyle.bottom = `${-position.value.y}px`;
  }
  return defaultStyle;
});

// 组件挂载
onMounted(() => {
  if (draggableRef.value) {
    // 确保不超出屏幕边界
    const { innerWidth, innerHeight } = window;
    const buttonRect = draggableRef.value.getBoundingClientRect();

    position.value.x = Math.min(
      position.value.x,
      innerWidth - buttonRect.width
    );
    position.value.y = Math.min(
      position.value.y,
      innerHeight - buttonRect.height
    );
  }
});
const startDrag = (e: any) => {
  //   e.stopPropagation(); // 阻止事件冒泡
  // 鼠标和触摸事件处理
  const clientX = e.clientX ?? e.touches[0].clientX;
  const clientY = e.clientY ?? e.touches[0].clientY;

  console.log("开始拖拽父组件", isDragging.value);
//   isDragging.value = true;
  startPos.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y,
  };
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDragTouch);
  document.addEventListener("mouseup", stopDrag, { once: true });
  document.addEventListener("touchend", stopDrag);
};

const onDrag = (e: MouseEvent) => {
  // 移动超过5像素才认为是拖拽
  const dx = Math.abs(e.clientX - startPos.value.x);
  const dy = Math.abs(e.clientY - startPos.value.y);

  if (dx > 5 || dy > 5) {
    isDragging.value = true;
    // 执行拖拽逻辑
    console.log("正在拖拽父组件");

    position.value.x = e.clientX - startPos.value.x;
    position.value.y = e.clientY - startPos.value.y;
  }
  //   if (!isDragging.value) return;
  //   position.value.x = e.clientX - startPos.value.x;
  //   position.value.y = e.clientY - startPos.value.y;

  //   const buttonRect = draggableButton.value.getBoundingClientRect();
  //   const maxX = window.innerWidth - buttonRect.width;
  //   const maxY = window.innerHeight - buttonRect.height;

  //   //边界检查增强版
  //   position.value = {
  //     x: Math.max(0, Math.min(e.clientX - startPos.value.x, maxX)),
  //     y: Math.max(0, Math.min(e.clientY - startPos.value.y, maxY)),
  //   };
};
const onDragTouch = (e: any) => {
  if (!isDragging.value) return;
  e.preventDefault();
  onDrag({
    clientX: e.touches[0].clientX,
    clientY: e.touches[0].clientY,
  } as MouseEvent);
};
const stopDrag = (e: any) => {
  if (isDragging.value) {
    e.stopPropagation(); // 阻止事件冒泡
  }
  console.log("停止拖拽父组件--isDragging‰" , isDragging.value );
  if (isDragging.value){
      console.log("停止拖拽父组件");
      setTimeout(() => {
          isDragging.value = false;
          console.log("停止拖拽父组件--isDragging‰" , isDragging.value );
      }, 50);
  }
  savePosition(position.value.x, position.value.y);
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("touchmove", onDragTouch);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
};

const handleClick = (e: any) => {
  console.log("点击父组件");
  e.stopPropagation(); // 阻止事件冒泡
};

// 暴露给子组件判断是否拖拽中
const isParentDragging = () => isDragging.value;
</script>

<style scoped>
.draggable-button {
  /* background-color: #f0f0f0; */
  border: none;
  /* border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); */
  user-select: none;
}
</style>
