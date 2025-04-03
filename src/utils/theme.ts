import { ref, computed, watch } from 'vue';

// 创建可在应用程序中共享的状态
const currentTheme = ref<string>(localStorage.getItem('theme') || 'light');

interface Theme {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    background: string;
    bghover: string;
    text: string;
    surface: string;
    border: string;
}

interface Themes {
    [key: string]: Theme;
}

// 所有可用主题的定义
const themes: Themes = {
    light: {
        primary: '#4285f4',
        secondary: '#db4437',
        tertiary: '#f4b400',
        quaternary: '#0f9d58',
        background: '#ffffff',
        bghover: 'hsla(207, 100%, 62%, 0.2)',
        text: '#202124',
        surface: '#f8f9fa',
        border: '#dadce0'
    },
    dark: {
        primary: '#8ab4f8',
        secondary: '#f28b82',
        tertiary: '#fdd663',
        quaternary: '#81c995',
        background: '#202124',
        bghover: 'hsla(207, 100%, 62%, 0.2)',
        text: '#e8eaed',
        surface: '#303134',
        border: '#5f6368'
    },
    blue: {
        primary: '#4285f4',
        secondary: '#5e97f6',
        tertiary: '#8ab4f8',
        quaternary: '#c6dafc',
        background: '#e8f0fe',
        bghover: 'hsla(207, 100%, 62%, 0.2)',
        text: '#174ea6',
        surface: '#f8faff',
        border: '#aecbfa'
    },
    green: {
        primary: '#0f9d58',
        secondary: '#137333',
        tertiary: '#1e8e3e',
        quaternary: '#81c995',
        background: '#e6f4ea',
        bghover: 'hsla(160, 100%, 37%, 0.2)',
        text: '#0d652d',
        surface: '#f4faf6',
        border: '#a8dab5'
    },
    purple: {
        primary: '#a142f4',
        secondary: '#b26ef7',
        tertiary: '#c39af8',
        quaternary: '#d4c2f9',
        background: '#f3e8fd',
        bghover: 'hsla(274, 63%, 59%, 0.2)',
        text: '#681da8',
        surface: '#f9f2ff',
        border: '#d7aefb'
    }
};

// 可用主题列表
const availableThemes = Object.keys(themes);

// 当前主题的颜色
const themeColors = computed(() => themes[currentTheme.value] || themes.light);

// 切换主题的方法
const setTheme = (theme: string) => {
    if (availableThemes.includes(theme)) {
        currentTheme.value = theme;
        localStorage.setItem('theme', theme);
        applyThemeToDOM(theme);
    } else {
        console.warn(`Theme "${theme}" is not available.`);
    }
};

// 应用主题到 DOM
const applyThemeToDOM = (theme: string) => {
    // 移除所有主题类
    document.body.classList.remove(...availableThemes.map(t => `theme-${t}`));
    // 添加当前主题类
    document.body.classList.add(`theme-${theme}`);

    // 应用 CSS 变量
    const colors = themes[theme];
    for (const [key, value] of Object.entries(colors)) {
        document.documentElement.style.setProperty(`--color-${key}`, value);
    }
};

// 检测系统主题偏好
const detectSystemTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
};

// 自动应用系统主题
const applySystemTheme = () => {
    setTheme(detectSystemTheme());
};

// 监听主题变化
watch(currentTheme, (newTheme) => {
    applyThemeToDOM(newTheme);
}, { immediate: true });

export default {
    currentTheme,
    themeColors,
    availableThemes,
    setTheme,
    applySystemTheme,
    detectSystemTheme
}; 