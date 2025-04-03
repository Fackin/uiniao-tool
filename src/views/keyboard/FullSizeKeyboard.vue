<template>
  <!-- 104-Key Keyboard Layout -->
  <div
    class="keyboard-container bg-gray-200 text-black p-4 rounded-lg shadow-lg flex gap-2"
  >
    <!-- left -->
    <div class="left">
      <!-- Function Keys Row -->
      <div class="flex gap-1 mb-2">
        <template v-for="key in layouts.functionKeys">
          <div v-if="key === 'Esc-aft'" class="w-[40px]"></div>
          <div
            v-if="key === 'F4-aft' || key === 'F8-aft'"
            class="w-[18px]"
          ></div>
          <div
            v-if="key.indexOf('-aft') < 0"
            :key="key"
            :class="[
              'key',
              'function-key',
              { active: pressedKeys.includes(key) },
            ]"
          >
            {{ key }}
          </div>
        </template>
      </div>

      <!-- Number Row -->
      <div class="flex gap-1 mb-2">
        <div
          v-for="key in layouts.numberRow"
          :key="key"
          :class="['key', { active: pressedKeys.includes(key) }]"
        >
          {{ key }}
        </div>
        <div
          :class="[
            'key',
            'backspace-key',
            { active: pressedKeys.includes('Backspace') },
          ]"
        >
          Backspace
        </div>
      </div>

      <!-- QWERTY Row -->
      <div class="flex gap-1 mb-2">
        <div
          :class="['key', 'tab-key', { active: pressedKeys.includes('Tab') }]"
        >
          Tab
        </div>
        <div
          v-for="key in layouts.qwertyRow"
          :key="key"
          :class="[
            'key',
            { active: pressedKeys.includes(key), 'slash-key': key === '\\' },
          ]"
        >
          {{ key }}
        </div>
      </div>

      <!-- ASDF Row -->
      <div class="flex gap-1 mb-2">
        <div
          :class="[
            'key',
            'caps-key',
            { active: pressedKeys.includes('CapsLock') },
          ]"
        >
          Caps
        </div>
        <div
          v-for="key in layouts.asdfRow"
          :key="key"
          :class="['key', { active: pressedKeys.includes(key) }]"
        >
          {{ key }}
        </div>
        <div
          :class="[
            'key',
            'enter-key',
            { active: pressedKeys.includes('Enter') },
          ]"
        >
          Enter
        </div>
      </div>

      <!-- ZXCV Row -->
      <div class="flex gap-1 mb-2">
        <div
          :class="[
            'key',
            'shift-key',
            { active: pressedKeys.includes('ShiftLeft') },
          ]"
        >
          Shift
        </div>
        <div
          v-for="key in layouts.zxcvRow"
          :key="key"
          :class="['key', { active: pressedKeys.includes(key) }]"
        >
          {{ key }}
        </div>
        <div
          :class="[
            'key',
            'shift-key',
            'shift-right-key',
            { active: pressedKeys.includes('ShiftRight') },
          ]"
        >
          Shift
        </div>
      </div>

      <!-- Space Row -->
      <div class="flex gap-1 mb-2">
        <div
          :class="[
            'key',
            'ctrl-key',
            { active: pressedKeys.includes('ControlLeft') },
          ]"
        >
          Ctrl
        </div>
        <div
          :class="[
            'key',
            'win-key',
            { active: pressedKeys.includes('MetaLeft') },
          ]"
        >
          Win
        </div>
        <div
          :class="[
            'key',
            'alt-key',
            { active: pressedKeys.includes('AltLeft') },
          ]"
        >
          Alt
        </div>
        <div
          :class="[
            'key',
            'space-key',
            { active: pressedKeys.includes('Space') },
          ]"
        >
          Space
        </div>
        <div
          :class="[
            'key',
            'alt-key',
            { active: pressedKeys.includes('AltRight') },
          ]"
        >
          Alt
        </div>
        <div
          :class="[
            'key',
            'win-key',
            { active: pressedKeys.includes('MetaRight') },
          ]"
        >
          Win
        </div>
        <div
          :class="[
            'key',
            'menu-key',
            { active: pressedKeys.includes('ContextMenu') },
          ]"
        >
          Menu
        </div>
        <div
          :class="[
            'key',
            'ctrl-key',
            { active: pressedKeys.includes('ControlRight') },
          ]"
        >
          Ctrl
        </div>
      </div>
    </div>
    <!-- right -->
    <div>
      <!-- Navigation and Numpad Section -->
      <div class="flex gap-2">
        <!-- Navigation Cluster -->
        <div class="flex flex-col gap-1">
          <div class="h-[32px] mb-1"></div>
          <div class="flex gap-1 mb-1">
            <div
              :class="[
                'key',
                'nav-key',
                { active: pressedKeys.includes('Insert') },
              ]"
            >
              Ins
            </div>
            <div
              :class="[
                'key',
                'nav-key',
                { active: pressedKeys.includes('Home') },
              ]"
            >
              Home
            </div>
            <div
              :class="[
                'key',
                'nav-key',
                { active: pressedKeys.includes('PageUp') },
              ]"
            >
              PgUp
            </div>
          </div>
          <div class="flex gap-1 mb-1">
            <div
              :class="[
                'key',
                'nav-key',
                { active: pressedKeys.includes('Delete') },
              ]"
            >
              Del
            </div>
            <div
              :class="[
                'key',
                'nav-key',
                { active: pressedKeys.includes('End') },
              ]"
            >
              End
            </div>
            <div
              :class="[
                'key',
                'nav-key',
                { active: pressedKeys.includes('PageDown') },
              ]"
            >
              PgDn
            </div>
          </div>
          <div class="h-[40px]"></div>
          <div class="flex gap-1 mt-2">
            <div class="w-[40px] h-[40px]"></div>
            <div
              :class="[
                'key',
                'arrow-key',
                { active: pressedKeys.includes('ArrowUp') },
              ]"
            >
              ↑
            </div>
            <div class="w-[40px] h-[40px]"></div>
          </div>
          <div class="flex gap-1">
            <div
              :class="[
                'key',
                'arrow-key',
                { active: pressedKeys.includes('ArrowLeft') },
              ]"
            >
              ←
            </div>
            <div
              :class="[
                'key',
                'arrow-key',
                { active: pressedKeys.includes('ArrowDown') },
              ]"
            >
              ↓
            </div>
            <div
              :class="[
                'key',
                'arrow-key',
                { active: pressedKeys.includes('ArrowRight') },
              ]"
            >
              →
            </div>
          </div>
        </div>

        <!-- Numpad -->
        <div class="flex flex-col gap-1">
          <div class="h-[32px] mb-1"></div>
          <div class="flex gap-1 mb-1">
            <div
              :class="[
                'key',
                'numpad-key',
                { active: pressedKeys.includes('NumLock') },
              ]"
            >
              Num
            </div>
            <div
              :class="[
                'key',
                'numpad-key',
                { active: pressedKeys.includes('NumpadDivide') },
              ]"
            >
              /
            </div>
            <div
              :class="[
                'key',
                'numpad-key',
                { active: pressedKeys.includes('NumpadMultiply') },
              ]"
            >
              *
            </div>
            <div
              :class="[
                'key',
                'numpad-key',
                { active: pressedKeys.includes('NumpadSubtract') },
              ]"
            >
              -
            </div>
          </div>
          <div class="flex gap-1">
            <div class="flex flex-col gap-1">
              <div class="flex gap-1 mb-1">
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad7') },
                  ]"
                >
                  7
                </div>
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad8') },
                  ]"
                >
                  8
                </div>
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad9') },
                  ]"
                >
                  9
                </div>
              </div>
              <div class="flex gap-1 mb-1">
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad4') },
                  ]"
                >
                  4
                </div>
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad5') },
                  ]"
                >
                  5
                </div>
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad6') },
                  ]"
                >
                  6
                </div>
              </div>
              <div class="flex gap-1 mb-1">
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad1') },
                  ]"
                >
                  1
                </div>
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad2') },
                  ]"
                >
                  2
                </div>
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('Numpad3') },
                  ]"
                >
                  3
                </div>
              </div>
              <div class="flex gap-1">
                <div
                  :class="[
                    'key',
                    'numpad-zero',
                    { active: pressedKeys.includes('Numpad0') },
                  ]"
                  style="width: 84px"
                >
                  0
                </div>
                <div
                  :class="[
                    'key',
                    'numpad-key',
                    { active: pressedKeys.includes('NumpadDecimal') },
                  ]"
                >
                  .
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div
                :class="[
                  'key',
                  'numpad-plus',
                  'w-[40px]',
                  { active: pressedKeys.includes('NumpadAdd') },
                ]"
                style="height: 88px"
              >
                +
              </div>
              <div
                :class="[
                  'key',
                  'numpad-enter',
                  'w-[40px]',
                  { active: pressedKeys.includes('NumpadEnter') },
                ]"
                style="height: 88px"
              >
                Enter
              </div>
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
    "Esc",
    "Esc-aft",
    "F1",
    "F2",
    "F3",
    "F4",
    "F4-aft",
    "F5",
    "F6",
    "F7",
    "F8",
    "F8-aft",
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
  width: auto;
}

/* Standard keyboard styling */
.key {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 40px;
  padding: 0 8px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.1s ease;
  user-select: none;
}

.function-key {
  font-size: 12px;
  min-width: 40px;
  height: 32px;
  background-color: #f0f0f0;
}

.tab-key {
  width: 60px;
  justify-content: flex-start;
  padding-left: 10px;
}

.caps-key {
  width: 70px;
  justify-content: flex-start;
  padding-left: 10px;
}

.backspace-key {
  width: 84px;
  font-size: 12px;
}

.slash-key {
  width: 64px;
}

.enter-key {
  width: 98px;
}

.shift-key {
  width: 90px;
  justify-content: flex-start;
  padding-left: 10px;
}

.shift-right-key {
  width: 122px;
}

.ctrl-key,
.alt-key,
.win-key,
.menu-key {
  width: 50px;
  font-size: 12px;
}

.space-key {
  flex-grow: 1;
  min-width: 200px;
}

.nav-key,
.arrow-key,
.numpad-key {
  font-size: 12px;
  padding: 0 4px;
}

.nav-key {
  font-size: 10px;
  padding: 0 4px;
}

.active {
  background-color: #4f46e5;
  color: white;
  transform: translateY(2px);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.bg-primary {
  background-color: #4f46e5;
}
</style>
