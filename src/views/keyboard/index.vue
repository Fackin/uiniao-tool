<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 min-w-[1020px]">
    <h1 class="text-2xl font-bold mb-4">Virtual Keyboard</h1>
    <p class="mb-2 text-white">
      Press keys on your keyboard to interact with the virtual keyboard
    </p>

    <!-- Keyboard Layout Selector -->
    <div class="mb-6">
      <div class="flex gap-2 justify-center">
        <button
          v-for="layout in availableLayouts"
          :key="layout.id"
          @click="currentLayout = layout.id"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            currentLayout === layout.id
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100',
          ]"
        >
          {{ layout.name }}
        </button>
      </div>
    </div>

    <!-- 104-Key Keyboard Layout -->
    <FullSizeKeyboard
      v-if="currentLayout === 'standard'"
      :pressedKeys="pressedKeys"
    />
    <!-- 87-Key Keyboard Layout (Tenkeyless) -->
    <TenkeylessKeyboard
      v-if="currentLayout === 'tenkeyless'"
      :pressedKeys="pressedKeys"
    />
    <!-- MacBook Pro Keyboard Layout -->
    <MacKeyboard
      v-if="currentLayout === 'macbook'"
      :pressedKeys="pressedKeys"
    />

    <div class="mt-6 p-4 bg-white rounded shadow text-black">
      <h2 class="text-lg font-semibold mb-2">Last Key Pressed</h2>
      <div class="text-2xl font-mono">{{ lastKeyPressed || "None" }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import FullSizeKeyboard from "./FullSizeKeyboard.vue";
import TenkeylessKeyboard from "./TenkeylessKeyboard.vue";
import MacKeyboard from "./MacKeyboard.vue";

// Available keyboard layouts
const availableLayouts = [
  { id: "standard", name: "104-Key Standard" },
  { id: "tenkeyless", name: "87-Key TKL" },
  { id: "macbook", name: "MacBook Pro" },
];

// Current selected layout
const currentLayout = ref("standard");

// Track pressed keys
const pressedKeys = ref([]);
const lastKeyPressed = ref("");

// Handle key down event
const handleKeyDown = (event) => {
  event.preventDefault();
console.log(event.code)
  // Prevent default behavior for some keys to avoid browser shortcuts
  if (["Tab", "Space"].includes(event.code)) {
    event.preventDefault();
  }

  // Map key codes to our keyboard representation
  let keyToHighlight;

  if (event.code === "Space") {
    keyToHighlight = "Space";
  } else if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    keyToHighlight = event.code;
  } else if (event.code === "ControlLeft" || event.code === "ControlRight") {
    keyToHighlight = event.code;
  } else if (event.code === "AltLeft" || event.code === "AltRight") {
    keyToHighlight = event.code;
  } else if (event.code === "MetaLeft" || event.code === "MetaRight") {
    keyToHighlight = event.code;
  } else if (
    event.code === "CapsLock" ||
    event.code === "Tab" ||
    event.code === "Backspace" ||
    event.code === "Enter"
  ) {
    keyToHighlight = event.code;
  } else if (event.code === "ContextMenu") {
    keyToHighlight = event.code;
  } else if (event.code.startsWith("Arrow")) {
    keyToHighlight = event.code;
  } else if (
    event.code === "Insert" ||
    event.code === "Delete" ||
    event.code === "Home" ||
    event.code === "End" ||
    event.code === "PageUp" ||
    event.code === "PageDown"
  ) {
    keyToHighlight = event.code;
  } else if (event.code.startsWith("Numpad") || event.code === "NumLock") {
    keyToHighlight = event.code;
  } else if (event.code.startsWith("Key")) {
    // For letter keys (KeyA, KeyB, etc.)
    keyToHighlight = event.code.replace("Key", "");
  } else if (event.code.startsWith("Digit")) {
    // For number keys (Digit1, Digit2, etc.)
    keyToHighlight = event.code.replace("Digit", "");
  } else if (event.code === "Backquote") {
    keyToHighlight = "`";
  } else if (event.code === "Minus") {
    keyToHighlight = "-";
  } else if (event.code === "Equal") {
    keyToHighlight = "=";
  } else if (event.code === "BracketLeft") {
    keyToHighlight = "[";
  } else if (event.code === "BracketRight") {
    keyToHighlight = "]";
  } else if (event.code === "Backslash") {
    keyToHighlight = "\\";
  } else if (event.code === "Semicolon") {
    keyToHighlight = ";";
  } else if (event.code === "Quote") {
    keyToHighlight = "'";
  } else if (event.code === "Comma") {
    keyToHighlight = ",";
  } else if (event.code === "Period") {
    keyToHighlight = ".";
  } else if (event.code === "Slash") {
    keyToHighlight = "/";
  } else if (event.code === "Escape") {
    keyToHighlight = "Esc";
  } else if (event.code.startsWith("F") && !isNaN(event.code.substring(1))) {
    // Function keys (F1, F2, etc.)
    keyToHighlight = event.code;
  }

  if (keyToHighlight && !pressedKeys.value.includes(keyToHighlight)) {
    pressedKeys.value.push(keyToHighlight);
    lastKeyPressed.value = keyToHighlight;
  }
};

// Handle key up event
const handleKeyUp = (event) => {
  let keyToRemove;

  if (event.code === "Space") {
    keyToRemove = "Space";
  } else if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    keyToRemove = event.code;
  } else if (event.code === "ControlLeft" || event.code === "ControlRight") {
    keyToRemove = event.code;
  } else if (event.code === "AltLeft" || event.code === "AltRight") {
    keyToRemove = event.code;
  } else if (event.code === "MetaLeft" || event.code === "MetaRight") {
    keyToRemove = event.code;
  } else if (
    event.code === "CapsLock" ||
    event.code === "Tab" ||
    event.code === "Backspace" ||
    event.code === "Enter"
  ) {
    keyToRemove = event.code;
  } else if (event.code === "ContextMenu") {
    keyToRemove = event.code;
  } else if (event.code.startsWith("Arrow")) {
    keyToRemove = event.code;
  } else if (
    event.code === "Insert" ||
    event.code === "Delete" ||
    event.code === "Home" ||
    event.code === "End" ||
    event.code === "PageUp" ||
    event.code === "PageDown"
  ) {
    keyToRemove = event.code;
  } else if (event.code.startsWith("Numpad") || event.code === "NumLock") {
    keyToRemove = event.code;
  } else if (event.code.startsWith("Key")) {
    keyToRemove = event.code.replace("Key", "");
  } else if (event.code.startsWith("Digit")) {
    keyToRemove = event.code.replace("Digit", "");
  } else if (event.code === "Backquote") {
    keyToRemove = "`";
  } else if (event.code === "Minus") {
    keyToRemove = "-";
  } else if (event.code === "Equal") {
    keyToRemove = "=";
  } else if (event.code === "BracketLeft") {
    keyToRemove = "[";
  } else if (event.code === "BracketRight") {
    keyToRemove = "]";
  } else if (event.code === "Backslash") {
    keyToRemove = "\\";
  } else if (event.code === "Semicolon") {
    keyToRemove = ";";
  } else if (event.code === "Quote") {
    keyToRemove = "'";
  } else if (event.code === "Comma") {
    keyToRemove = ",";
  } else if (event.code === "Period") {
    keyToRemove = ".";
  } else if (event.code === "Slash") {
    keyToRemove = "/";
  } else if (event.code === "Escape") {
    keyToRemove = "Esc";
  } else if (event.code.startsWith("F") && !isNaN(event.code.substring(1))) {
    keyToRemove = event.code;
  }

  if (keyToRemove) {
    pressedKeys.value = pressedKeys.value.filter((key) => key !== keyToRemove);
  }
};

// Add event listeners when component is mounted
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

// Remove event listeners when component is unmounted
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});
</script>

<style scoped>
.bg-primary {
  background-color: #4f46e5;
}
</style>
