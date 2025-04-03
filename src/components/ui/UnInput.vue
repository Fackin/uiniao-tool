<template>
  <div class="relative inline-block">
    <div
      class="custom-input rounded-lg"
      :class="{ focused, disabled }"
      :style="{ height: `${height}px`, 'box-sizing': 'border-box' }"
    >
      <input
        ref="inputRef"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="focused = true"
        @blur="focused = false"
        @input="emitValue"
      />
      <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex justify-center items-center gap-2">
        <span v-if="clearable && inputValue" class="clear-btn" @click="clearInput"
          >&times;</span
        >
        <button
          v-if="searchIcon"
          @click="search"
        >
          <SearchIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { Search as SearchIcon } from "lucide-vue-next";

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: "请输入内容" },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  themeColor: { type: String, default: "#007bff" }, // 主题颜色
  height: { type: String, default: () => "40" },
  searchIcon: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "search"]);
const inputValue = ref(props.modelValue);
const focused = ref(false);
const inputRef = ref(null);

const emitValue = () => {
  emit("update:modelValue", inputValue.value);
};

const search = () => {
  emit("search");
};

const clearInput = () => {
  inputValue.value = "";
  emitValue();
  inputRef.value.focus();
};

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);
</script>

<style scoped>
.custom-input {
  display: flex;
  align-items: center;
  position: relative;
  /* border: 1px solid #ccc; */
  border: 1px solid var(--color-border);
  /* border-radius: 4px; */
  padding: 8px 12px;
  transition: border-color 0.3s;
  /* background-color: white; */
  background-color: var(--color-background);
}

.custom-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  width: 100%;
}

.custom-input.focused {
  border-color: v-bind(themeColor);
}

.custom-input.disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.clear-btn {
  cursor: pointer;
  color: #999;
  font-size: 18px;
  margin-left: 10px;
  user-select: none;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 2px;
}

.clear-btn:hover {
  color: red;
  background: #ccc;
  border-radius: 18px;
}
</style>
