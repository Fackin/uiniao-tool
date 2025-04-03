<template>
  <!-- MacBook Pro Keyboard Layout -->
  <div
    class="keyboard-container macbook-keyboard bg-gray-800 p-4 rounded-lg shadow-lg"
  >
    <!-- Function Keys Row -->
    <div class="flex gap-1 mb-2">
      <div
        :class="[
          'mac-key',
          'mac-esc',
          { 'mac-active': pressedKeys.includes('Escape') },
        ]"
      >
        esc
      </div>
      <div class="w-[20px]"></div>
      <div
        v-for="key in layouts.functionKeys"
        :key="key"
        :class="[
          'mac-key',
          'mac-function-key',
          { 'mac-active': pressedKeys.includes(key) },
        ]"
      >
        {{ key }}
      </div>
      <div
        :class="[
          'mac-key',
          'mac-power',
          { 'mac-active': pressedKeys.includes('Power') },
        ]"
      >
        ⏻
      </div>
    </div>

    <!-- Number Row -->
    <div class="flex gap-1 mb-2">
      <div
        v-for="key in layouts.numberRow"
        :key="key"
        :class="['mac-key', { 'mac-active': pressedKeys.includes(key) }]"
      >
        {{ key }}
      </div>
      <div
        :class="[
          'mac-key',
          'mac-delete',
          { 'mac-active': pressedKeys.includes('Backspace') },
        ]"
      >
        delete
      </div>
    </div>

    <!-- QWERTY Row -->
    <div class="flex gap-1 mb-2">
      <div
        :class="[
          'mac-key',
          'mac-tab',
          { 'mac-active': pressedKeys.includes('Tab') },
        ]"
      >
        tab
      </div>
      <div
        v-for="key in layouts.qwertyRow"
        :key="key"
        :class="['mac-key', { 'mac-active': pressedKeys.includes(key) }]"
      >
        {{ key }}
      </div>
    </div>

    <!-- ASDF Row -->
    <div class="flex gap-1 mb-2">
      <div
        :class="[
          'mac-key',
          'mac-caps',
          { 'mac-active': pressedKeys.includes('CapsLock') },
        ]"
      >
        caps lock
      </div>
      <div
        v-for="key in layouts.asdfRow"
        :key="key"
        :class="['mac-key', { 'mac-active': pressedKeys.includes(key) }]"
      >
        {{ key }}
      </div>
      <div
        :class="[
          'mac-key',
          'mac-return',
          { 'mac-active': pressedKeys.includes('Enter') },
        ]"
      >
        return
      </div>
    </div>

    <!-- ZXCV Row -->
    <div class="flex gap-1 mb-2">
      <div
        :class="[
          'mac-key',
          'mac-shift',
          { 'mac-active': pressedKeys.includes('ShiftLeft') },
        ]"
      >
        shift
      </div>
      <div
        v-for="key in layouts.zxcvRow"
        :key="key"
        :class="['mac-key', { 'mac-active': pressedKeys.includes(key) }]"
      >
        {{ key }}
      </div>
      <div
        :class="[
          'mac-key',
          'mac-shift',
          { 'mac-active': pressedKeys.includes('ShiftRight') },
        ]"
      >
        shift
      </div>
    </div>

    <!-- Space Row -->
    <div class="flex gap-1 mb-2">
      <div
        :class="[
          'mac-key',
          'mac-fn',
          { 'mac-active': pressedKeys.includes('Fn') },
        ]"
      >
        fn
      </div>
      <div
        :class="[
          'mac-key',
          'mac-control',
          { 'mac-active': pressedKeys.includes('ControlLeft') },
        ]"
      >
        control
      </div>
      <div
        :class="[
          'mac-key',
          'mac-option',
          { 'mac-active': pressedKeys.includes('AltLeft') },
        ]"
      >
        option
      </div>
      <div
        :class="[
          'mac-key',
          'mac-command',
          { 'mac-active': pressedKeys.includes('MetaLeft') },
        ]"
      >
        ⌘
      </div>
      <div
        :class="[
          'mac-key',
          'mac-space',
          { 'mac-active': pressedKeys.includes('Space') },
        ]"
      ></div>
      <div
        :class="[
          'mac-key',
          'mac-command',
          { 'mac-active': pressedKeys.includes('MetaRight') },
        ]"
      >
        ⌘
      </div>
      <div
        :class="[
          'mac-key',
          'mac-option',
          { 'mac-active': pressedKeys.includes('AltRight') },
        ]"
      >
        option
      </div>

      <!-- Arrow Keys -->
      <div class="flex justify-center gap-1">
        <div class="flex flex-col gap-1">
          <div class="flex gap-1">
            <div
              :class="[
                'mac-key',
                'mac-arrow',
                { 'mac-active': pressedKeys.includes('ArrowLeft') },
              ]"
            >
              ←
            </div>
            <div class="flex flex-col justify-between">
              <div
                :class="[
                  'mac-key',
                  'mac-arrow',
                  'h-half',
                  { 'mac-active': pressedKeys.includes('ArrowUp') },
                ]"
              >
                ↑
              </div>
              <div
                :class="[
                  'mac-key',
                  'mac-arrow',
                  'h-half',
                  { 'mac-active': pressedKeys.includes('ArrowDown') },
                ]"
              >
                ↓
              </div>
            </div>
            <div
              :class="[
                'mac-key',
                'mac-arrow',
                { 'mac-active': pressedKeys.includes('ArrowRight') },
              ]"
            >
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define keyboard layouts
const layouts = {
  functionKeys: [
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
  ],
  numberRow: ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  qwertyRow: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  asdfRow: ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
  zxcvRow: ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
};

defineProps({
  pressedKeys: Array,
});
</script>

<style scoped>
.keyboard-container {
  /* max-width: 1000px;
  width: 100%; */
  width: auto;
}
/* MacBook keyboard styling */
.macbook-keyboard {
  background-color: #1a1a1a;
}

.mac-key {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 36px;
  padding: 0 8px;
  background-color: #2a2a2a;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 400;
  transition: all 0.1s ease;
  user-select: none;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}
.mac-key.h-half {
  height: 17px;
}

.mac-function-key {
  height: 24px;
  font-size: 10px;
  background-color: #222222;
}

.mac-esc,
.mac-power {
  height: 24px;
  font-size: 10px;
  background-color: #222222;
}

.mac-delete {
  width: 60px;
  justify-content: flex-end;
  padding-right: 10px;
}

.mac-tab {
  width: 60px;
  justify-content: flex-start;
  padding-left: 10px;
}

.mac-caps {
  width: 68px;
  justify-content: flex-start;
  padding-left: 10px;
}

.mac-return {
  width: 68px;
  justify-content: flex-end;
  padding-right: 10px;
}

.mac-shift {
  width: 88px;
  justify-content: flex-start;
  padding-left: 10px;
}

.mac-fn,
.mac-control,
.mac-option,
.mac-command {
  font-size: 10px;
}

.mac-control,
.mac-option {
  width: 36px;
  font-size: 8px;
}
.mac-command {
  width: 48px;
  font-size: 10px;
}

.mac-space {
  flex-grow: 1;
  min-width: 180px;
}

.mac-arrow {
  font-size: 14px;
}

.mac-active {
  background-color: #555555;
  transform: translateY(1px);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
}
</style>
