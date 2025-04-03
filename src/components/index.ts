import type { App, Component } from 'vue'

type ComponentModule = {
  default: Component
}

type ComponentModules = Record<string, ComponentModule>

export default {
  install: (app: App): void => {
    // 自动导入 components/ui 目录下的所有 `.vue` 文件
    const components = import.meta.glob('./ui/*.vue', { eager: true });

    // 遍历注册所有组件
    Object.entries(components as ComponentModules).forEach(([path, module]) => {
      const componentName = path.split('/').pop()?.replace('.vue', '');
      if (componentName && module.default) {
        app.component(componentName, module.default)
      } else {
        console.warn(`Failed to register component from path: ${path}`)
      }
    });
  }
}