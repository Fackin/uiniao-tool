<template>
  <header class="app-header">
    <h1 class="app-title">马赛克风格网站</h1>

    <div class="controls">
      <div class="background-control">
        <label for="background-style">背景样式:</label>
        <select
          id="background-style"
          v-model="backgroundStyle"
          @change="handleChange"
        >
          <option value="grid">网格马赛克</option>
          <option value="blocks">像素块</option>
          <option value="dynamic">动态马赛克</option>
          <option value="gradient">渐变马赛克</option>
        </select>
      </div>

      <ThemeSwitcher class="theme-control" />
    </div>
  </header>

  <main class="app-content">
    <div class="content-card">
      <h2>欢迎使用马赛克风格网站模板</h2>
      <p>
        这是一个具有多种主题和背景样式的网站模板。您可以通过顶部的控制面板切换不同的主题和背景效果。
      </p>

      <div class="features">
        <div class="feature-item">
          <h3>多主题支持</h3>
          <p>
            支持浅色、深色、蓝色、绿色和紫色五种主题，可以根据个人喜好或品牌需求进行切换。
          </p>
        </div>

        <div class="feature-item">
          <h3>多种背景样式</h3>
          <p>
            提供网格马赛克、像素块、动态马赛克和渐变马赛克四种背景样式，满足不同的视觉需求。
          </p>
        </div>

        <div class="feature-item">
          <h3>响应式设计</h3>
          <p>完全响应式设计，在不同设备上都能提供良好的用户体验。</p>
        </div>
      </div>
    </div>
  </main>

  <footer class="app-footer">
    <p>马赛克风格网站模板 &copy; 2023</p>
  </footer>
</template>

<script setup>
import { inject } from "vue";
import ThemeSwitcher from "@/layout/ThemeSwitcher.vue";

const { backgroundStyle, changeBackground } = inject("backgroundStyle");
const handleChange = (event) => {
  changeBackground(event.target.value);
};
</script>

<style>

.app-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  flex-direction: column;
  /* align-items: flex-start; */
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.controls {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.background-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.background-control label {
  font-size: 14px;
  font-weight: 500;
}

.background-control select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
}

.app-content {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.content-card {
  background-color: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 800px;
  width: 100%;
  border: 1px solid var(--color-border);
}

.content-card h2 {
  color: var(--color-primary);
  margin-bottom: 16px;
  font-size: 24px;
}

.content-card > p {
  margin-bottom: 24px;
  font-size: 16px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.feature-item {
  padding: 16px;
  background-color: rgba(var(--color-primary-rgb), 0.05);
  border-radius: 6px;
  border-left: 3px solid var(--color-primary);
}

.feature-item h3 {
  color: var(--color-primary);
  margin-bottom: 8px;
  font-size: 18px;
}

.feature-item p {
  font-size: 14px;
}

.app-footer {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: var(--color-text);
  opacity: 0.7;
  border-top: 1px solid var(--color-border);
}

.theme-control {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .controls {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .background-control {
    width: 100%;
  }

  .background-control select {
    flex-grow: 1;
  }

  .content-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .app-content {
    padding: 16px;
  }

  .content-card {
    padding: 16px;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style>
