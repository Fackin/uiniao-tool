<template>
  <div class="theme-switcher">
    <div class="theme-label">主题</div>
    <div class="theme-options">
      <button 
        v-for="theme in themeManager.availableThemes" 
        :key="theme"
        :class="['theme-option', { active: theme === themeManager.currentTheme.value }]"
        :style="{ backgroundColor: themes[theme].primary, borderColor: themes[theme].border }"
        @click="() => { themeManager.setTheme(theme); }"
        :title="getThemeName(theme)"
      >
        <span class="theme-check" v-if="theme === themeManager.currentTheme.value">✓</span>
      </button>
    </div>
    <button class="system-theme-button" @click="themeManager.applySystemTheme()">
      <i class="system-icon"></i>
      系统主题
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import themeManager from '@/utils/theme.ts';

// 所有主题定义
const themes = {
  light: {
    name: '浅色',
    primary: '#f8f9fa',
    border: '#dadce0'
  },
  dark: {
    name: '深色',
    primary: '#303134',
    border: '#5f6368'
  },
  blue: {
    name: '蓝色',
    primary: '#4285f4',
    border: '#aecbfa'
  },
  green: {
    name: '绿色',
    primary: '#0f9d58',
    border: '#a8dab5'
  },
  purple: {
    name: '紫色',
    primary: '#a142f4',
    border: '#d7aefb'
  }
};

// 获取主题名称
const getThemeName = (theme) => themes[theme]?.name || theme;
</script>

<style scoped>
.theme-switcher {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.theme-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 4px;
}

.theme-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.theme-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.theme-option.active {
  /* border-color: var(--color-text); */
  transform: scale(1.1);
  border-color: var(--color-primary) !important;
}

.theme-check {
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.system-theme-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.system-theme-button:hover {
  background-color: rgba(var(--color-primary-rgb), 0.1);
}

.system-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm0 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0-10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
