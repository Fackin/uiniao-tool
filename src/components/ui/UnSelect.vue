<template>
  <div class="relative inline-block" :style="{ width: `${width}px` }">
    <!-- 选择框 -->
    <div
      class="select-box flex items-center flex-wrap gap-2 border pl-3 pr-3 pt-1 pb-1 rounded-lg cursor-pointer transition-all"
      :class="isOpen ? 'focused-border-color shadow-lg' : 'border-gray-300'"
      :style="{ height: `${height}px`, 'box-sizing': 'border-box' }"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <!-- 多选模式：显示 Tags -->
      <span
        v-if="multiple"
        v-for="(option, index) in selectedOptions"
        :key="option.value"
        class="tag px-2 py-1 bg-blue-100 rounded-full flex items-center"
      >
        <component :is="option.icon" class="w-4 h-4 mr-1" v-if="option.icon" />
        {{ option.label }}
        <span
          class="ml-2 cursor-pointer hover:text-red-600"
          @click.stop="removeOption(index)"
          >×</span
        >
      </span>

      <!-- 单选模式 -->
      <span v-if="!multiple && selectedOptions.length === 1">
        <component
          :is="selectedOptions[0].icon"
          class="w-5 h-5 mr-2"
          v-if="selectedOptions[0].icon"
        />
        {{ selectedOptions[0].label }}
      </span>

      <!-- 搜索输入框 -->
      <input
        v-model="searchQuery"
        v-if="multiple || selectedOptions.length === 0"
        class="flex-1 border-none outline-none bg-transparent"
        :placeholder="selectedOptions.length === 0 ? '请选择...' : ''"
        @focus="isOpen = true"
      />

      <!-- 下拉箭头 -->
      <svg
        class="w-5 h-5 ml-auto transform transition-transform"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- 下拉菜单 -->
    <transition name="fade">
      <ul
        v-if="isOpen"
        ref="dropdown"
        class="dropdown-menu absolute w-full border rounded-lg shadow-lg mt-2 max-h-60 overflow-auto z-50"
      >
        <!-- 加载中状态 -->
        <li v-if="loading" class="px-4 py-2 text-gray-500">加载中...</li>

        <!-- 无匹配项 -->
        <li
          v-else-if="filteredOptions.length === 0"
          class="px-4 py-2 text-gray-500"
        >
          无匹配项
        </li>

        <!-- 选项列表 -->
        <li
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          class="dropdown-menu-item px-4 py-2 flex items-center cursor-pointer transition-all"
          :class="[
            selectedOptions.some((sel) => sel.value === option.value)
              ? 'active font-semibold'
              : 'hover',
          ]"
          @click="selectOption(option)"
        >
          <component
            :is="option.icon"
            class="w-5 h-5 mr-2"
            v-if="option.icon"
          />
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";

const isOpen = ref(false);
const searchQuery = ref("");
// const multiple = ref(false); // 开启多选模式
const loading = ref(false);
const selectedOptions = ref([]);
const dropdown = ref(null);

const props = defineProps({
  modelValue: {
    type: [String, Array, Object],
    default: () => "",
  },
  multiple: {
    type: Boolean,
    default: () => false,
  },
  width: {
    type: String,
    default: () => "270",
  },
  height: {
    type: String,
    default: () => "40",
  },
  options: {
    type: Array,
    default: () => [],
  },
  themeColor: { type: String, default: "#007bff" }, // 主题颜色
});

const emits = defineEmits(["update:modelValue"]);

// 过滤选项（支持搜索）
const filteredOptions = computed(() => {
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 选择选项（支持多选）
const selectOption = (option) => {
  if (props.multiple) {
    if (!selectedOptions.value.some((o) => o.value === option.value)) {
      selectedOptions.value.push(option);
    }
    emits(
      "update:modelValue",
      selectedOptions.value.map((o) => o.value)
    );
  } else {
    selectedOptions.value = [option];
    emits("update:modelValue", option.value);
    isOpen.value = false;
  }
};

// 删除选中的选项（多选模式）
const removeOption = (index) => {
  selectedOptions.value.splice(index, 1);
};

// 切换下拉框
const toggleDropdown = (e) => {
  e.stopPropagation();

  isOpen.value = !isOpen.value;
  // if (isOpen.value) {
  //   // nextTick(() => {
  //   console.log('toggleDropdown addEventListener')
  //     document.addEventListener("click", handleClickOutside);
  //   // });
  // } else {
  //   console.log('toggleDropdown removeEventListener')
  //   document.removeEventListener("click", handleClickOutside);
  // }
};

// 监听外部点击，关闭下拉框
const handleClickOutside = (event) => {
  console.log('handleClickOutside', event.target)
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
    document.removeEventListener("click", handleClickOutside);
  }
};

// 监听键盘操作
const handleKeydown = (event) => {
  if (event.key === "Enter" && filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[0]);
  } else if (
    event.key === "Backspace" &&
    props.multiple &&
    searchQuery.value === ""
  ) {
    selectedOptions.value.pop();
  }
};

watch(
  () => props.modelValue,
  (value) => {
    console.log(value, "watch");
    if (props.multiple) {
      selectedOptions.value = value
        ? props.options.filter((option) => value.includes(option.value))
        : [];
    } else {
      selectedOptions.value = value
        ? props.options.filter((option) => value === option.value)
        : [];
    }
  },
  { immediate: true }
);

watch(() => isOpen.value, (val) => {
  if (val) {
    // nextTick(() => {
    console.log('toggleDropdown addEventListener')
      window.document.addEventListener("click", handleClickOutside);
    // });
  } else {
    console.log('toggleDropdown removeEventListener')
    document.removeEventListener("click", handleClickOutside);
  }
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.select-box,
.dropdown-menu {
  background-color: var(--color-background);
  /* background-color: var(--color-surface); */
  border-color: var(--color-border);
}
.dropdown-menu-item.active {
  background-color: var(--color-surface);
  /* background-color: var(--color-background); */
}
.dropdown-menu-item:not(.active):hover {
  background-color: var(--color-bghover);
}
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 选项样式 */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  font-size: 0.875rem;
  border-radius: 999px;
}
.focused-border-color {
  border-color: v-bind(themeColor);
}
</style>
