<template>
  <div class="bg-gradient max-w-6xl mx-auto">
    <h1 class="text-xl font-bold mb-4 drop-shadow-sm">网站导航</h1>

    <!-- 分类选择器 - 毛玻璃效果 -->
    <div class="mb-4 glassmorphism py-3 rounded-xl">
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = ''"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="selectedCategory === '' ? 'glass-active' : 'glass-inactive'"
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="
            selectedCategory === category.id ? 'glass-active' : 'glass-inactive'
          "
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 网站卡片区域 -->
    <div v-for="category in filteredCategories" :key="category.id" class="mb-8">
      <h2 class="text-md font-semibold mb-4 flex items-center drop-shadow-sm">
        <!-- <component :is="category.icon" class="w-5 h-5 mr-2" /> -->
        <!-- <img :src="category.icon" alt="site.name" class="mx-auto w-5 h-5 mb-2"> -->
        {{ category.name }}
      </h2>

      <div
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
      >
        <a
          v-for="site in getSitesByCategory(category.id)"
          :key="site.id"
          :href="site.url"
          target="_blank"
          class="glassmorphism-card flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:translate-y-[-3px] hover:shadow-lg group"
        >
          <div
            class="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full mb-1 transition-all duration-300 group-hover:bg-white/20"
          >
            <!-- <component :is="site.icon" class="w-5 h-5 text-white" /> -->
            <img :src="site.icon" :alt="site.name" class="w-5 h-5" />
          </div>
          <span class="text-xs font-medium text-center">{{ site.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
//   import {
//     BookOpen,
//     Code,
//     ShoppingCart,
//     Video,
//     Music,
//     Image,
//     FileText,
//     Coffee,
//     Mail,
//     Search,
//     Briefcase,
//     Newspaper,
//     Cloud,
//     Database,
//     Bookmark
//   } from 'lucide-vue-next';

// 分类数据
const categories = [
  // { id: 'productivity', name: '生产力工具', icon: Coffee },
  // { id: 'development', name: '开发工具', icon: Code },
  // { id: 'social', name: '社交媒体', icon: Mail },
  // { id: 'entertainment', name: '娱乐', icon: Video },
  // { id: 'learning', name: '学习资源', icon: BookOpen },
  // { id: 'shopping', name: '购物', icon: ShoppingCart },
  { id: "productivity", name: "生产力工具" },
  { id: "development", name: "开发工具" },
  { id: "social", name: "社交媒体" },
  { id: "entertainment", name: "娱乐" },
  { id: "learning", name: "学习资源" },
  { id: "shopping", name: "购物" },
];

// 网站数据
const websites = [
  // 生产力工具
  {
    id: 1,
    name: "腾讯文档",
    url: "https://docs.qq.com",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=docs.qq.com",
    category: "productivity",
  },
  {
    id: 2,
    name: "石墨文档",
    url: "https://shimo.im",
    icon: "https://shimo.im/favicon.ico",
    category: "productivity",
  },
  {
    id: 3,
    name: "语雀",
    url: "https://www.yuque.com",
    icon: "https://www.yuque.com/favicon.ico",
    category: "productivity",
  },
  {
    id: 4,
    name: "印象笔记",
    url: "https://www.yinxiang.com",
    icon: "https://www.yinxiang.com/favicon.ico",
    category: "productivity",
  },
  {
    id: 5,
    name: "有道云笔记",
    url: "https://note.youdao.com",
    icon: "https://note.youdao.com/favicon.ico",
    category: "productivity",
  },
  {
    id: 6,
    name: "幕布",
    url: "https://mubu.com",
    icon: "https://mubu.com/favicon.ico",
    category: "productivity",
  },

  // 开发工具
  {
    id: 7,
    name: "GitHub",
    url: "https://github.com",
    icon: "https://github.com/favicon.ico",
    category: "development",
  },
  {
    id: 8,
    name: "Gitee",
    url: "https://gitee.com",
    icon: "https://gitee.com/favicon.ico",
    category: "development",
  },
  {
    id: 9,
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    icon: "https://stackoverflow.com/favicon.ico",
    category: "development",
  },
  {
    id: 10,
    name: "掘金",
    url: "https://juejin.cn",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=juejin.cn",
    category: "development",
  },
  {
    id: 11,
    name: "CSDN",
    url: "https://www.csdn.net",
    icon: "https://www.csdn.net/favicon.ico",
    category: "development",
  },
  {
    id: 12,
    name: "V2EX",
    url: "https://www.v2ex.com",
    icon: "https://www.v2ex.com/favicon.ico",
    category: "development",
  },

  // 社交媒体
  {
    id: 13,
    name: "微博",
    url: "https://weibo.com",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=weibo.com",
    category: "social",
  },
  {
    id: 14,
    name: "知乎",
    url: "https://www.zhihu.com",
    icon: "https://www.zhihu.com/favicon.ico",
    category: "social",
  },
  {
    id: 15,
    name: "豆瓣",
    url: "https://www.douban.com",
    icon: "https://www.douban.com/favicon.ico",
    category: "social",
  },
  {
    id: 16,
    name: "微信公众平台",
    url: "https://mp.weixin.qq.com",
    icon: "https://mp.weixin.qq.com/favicon.ico",
    category: "social",
  },

  // 娱乐
  {
    id: 17,
    name: "哔哩哔哩",
    url: "https://www.bilibili.com",
    icon: "https://icons.duckduckgo.com/ip2/www.bilibili.com.ico",
    category: "entertainment",
  },
  {
    id: 18,
    name: "腾讯视频",
    url: "https://v.qq.com",
    icon: "https://icons.duckduckgo.com/ip2/v.qq.com.ico",
    category: "entertainment",
  },
  {
    id: 19,
    name: "爱奇艺",
    url: "https://www.iqiyi.com",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=www.iqiyi.com",
    category: "entertainment",
  },
  {
    id: 20,
    name: "网易云音乐",
    url: "https://music.163.com",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=music.163.com",
    category: "entertainment",
  },
  {
    id: 21,
    name: "QQ音乐",
    url: "https://y.qq.com",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=y.qq.com",
    category: "entertainment",
  },

  // 学习资源
  {
    id: 22,
    name: "中国大学MOOC",
    url: "https://www.icourse163.org",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=www.icourse163.org",
    category: "learning",
  },
  {
    id: 23,
    name: "慕课网",
    url: "https://www.imooc.com",
    icon: "https://www.imooc.com/favicon.ico",
    category: "learning",
  },
  {
    id: 24,
    name: "网易公开课",
    url: "https://open.163.com",
    icon: "https://open.163.com/favicon.ico",
    category: "learning",
  },
  {
    id: 25,
    name: "学堂在线",
    url: "https://www.xuetangx.com",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=www.xuetangx.com",
    category: "learning",
  },

  // 购物
  {
    id: 26,
    name: "淘宝",
    url: "https://www.taobao.com",
    icon: "https://www.taobao.com/favicon.ico",
    category: "shopping",
  },
  {
    id: 27,
    name: "京东",
    url: "https://www.jd.com",
    icon: "https://www.jd.com/favicon.ico",
    category: "shopping",
  },
  {
    id: 28,
    name: "拼多多",
    url: "https://www.pinduoduo.com",
    icon: "https://www.google.com/s2/favicons?sz=64&domain=www.pinduoduo.com",
    category: "shopping",
  },
  {
    id: 29,
    name: "苏宁易购",
    url: "https://www.suning.com",
    icon: "https://www.suning.com/favicon.ico",
    category: "shopping",
  },

  // 生产力工具
  // { id: 1, name: '腾讯文档', url: 'https://docs.qq.com', icon: FileText, category: 'productivity' },
  // { id: 2, name: '石墨文档', url: 'https://shimo.im', icon: FileText, category: 'productivity' },
  // { id: 3, name: '语雀', url: 'https://www.yuque.com', icon: BookOpen, category: 'productivity' },
  // { id: 4, name: '印象笔记', url: 'https://www.yinxiang.com', icon: Bookmark, category: 'productivity' },
  // { id: 5, name: '有道云笔记', url: 'https://note.youdao.com', icon: FileText, category: 'productivity' },
  // { id: 6, name: '幕布', url: 'https://mubu.com', icon: FileText, category: 'productivity' },

  // // 开发工具
  // { id: 7, name: 'GitHub', url: 'https://github.com', icon: Code, category: 'development' },
  // { id: 8, name: 'Gitee', url: 'https://gitee.com', icon: Code, category: 'development' },
  // { id: 9, name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: Code, category: 'development' },
  // { id: 10, name: '掘金', url: 'https://juejin.cn', icon: Bookmark, category: 'development' },
  // { id: 11, name: 'CSDN', url: 'https://www.csdn.net', icon: Code, category: 'development' },
  // { id: 12, name: 'V2EX', url: 'https://www.v2ex.com', icon: Code, category: 'development' },

  // // 社交媒体
  // { id: 13, name: '微博', url: 'https://weibo.com', icon: Mail, category: 'social' },
  // { id: 14, name: '知乎', url: 'https://www.zhihu.com', icon: Search, category: 'social' },
  // { id: 15, name: '豆瓣', url: 'https://www.douban.com', icon: Bookmark, category: 'social' },
  // { id: 16, name: '微信公众平台', url: 'https://mp.weixin.qq.com', icon: Mail, category: 'social' },

  // // 娱乐
  // { id: 17, name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: Video, category: 'entertainment' },
  // { id: 18, name: '腾讯视频', url: 'https://v.qq.com', icon: Video, category: 'entertainment' },
  // { id: 19, name: '爱奇艺', url: 'https://www.iqiyi.com', icon: Video, category: 'entertainment' },
  // { id: 20, name: '网易云音乐', url: 'https://music.163.com', icon: Music, category: 'entertainment' },
  // { id: 21, name: 'QQ音乐', url: 'https://y.qq.com', icon: Music, category: 'entertainment' },

  // // 学习资源
  // { id: 22, name: '中国大学MOOC', url: 'https://www.icourse163.org', icon: BookOpen, category: 'learning' },
  // { id: 23, name: '慕课网', url: 'https://www.imooc.com', icon: Video, category: 'learning' },
  // { id: 24, name: '网易公开课', url: 'https://open.163.com', icon: Video, category: 'learning' },
  // { id: 25, name: '学堂在线', url: 'https://www.xuetangx.com', icon: BookOpen, category: 'learning' },

  // // 购物
  // { id: 26, name: '淘宝', url: 'https://www.taobao.com', icon: ShoppingCart, category: 'shopping' },
  // { id: 27, name: '京东', url: 'https://www.jd.com', icon: ShoppingCart, category: 'shopping' },
  // { id: 28, name: '拼多多', url: 'https://www.pinduoduo.com', icon: ShoppingCart, category: 'shopping' },
  // { id: 29, name: '苏宁易购', url: 'https://www.suning.com', icon: ShoppingCart, category: 'shopping' },
];

// 当前选中的分类
const selectedCategory = ref("");

// 根据选中的分类过滤网站
const filteredCategories = computed(() => {
  if (selectedCategory.value === "") {
    return categories;
  }
  return categories.filter(
    (category) => category.id === selectedCategory.value
  );
});

// 获取特定分类的网站
const getSitesByCategory = (categoryId) => {
  return websites.filter((site) => site.category === categoryId);
};
</script>

<style>
/* :root {
    --color-primary: #8a2be2;
    --color-primary-dark: #6a1cb7;
    --color-secondary: #00bfff;
  } */

/* 渐变背景 */
.bg-gradient {
  /* background: linear-gradient(135deg, #4b0082, #9400d3, #4169e1);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite; */
  color: var(--color-text);
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 毛玻璃效果 - 容器 */
.glassmorphism {
  /* background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
}

/* 毛玻璃效果 - 卡片 */
.glassmorphism-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 毛玻璃效果 - 激活状态的标签 */
.glass-active {
  background: rgba(255, 255, 255, 0.8);
  /* color: white; */
  color: var(--color-primary);
  font-weight: bold;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5) inset;
  border: 0px solid rgba(255, 255, 255, 0.3);
}

/* 毛玻璃效果 - 未激活状态的标签 */
.glass-inactive {
  background: rgba(255, 255, 255, 0.3);
  /* color: rgba(255, 255, 255, 0.8); */
  border: 0px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.glass-inactive:hover {
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
  /* color: white; */
}
</style>
