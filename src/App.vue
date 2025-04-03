<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import { RouterView } from "vue-router";
import Header from "./layout/header.vue";
import Nav from "./layout/nav.vue";
import WebsiteBackground from "@/layout/WebsiteBackground.vue";

// 背景样式
const backgroundStyle = ref(localStorage.getItem("backgroundStyle") || "grid");
const backgroundImg = ref();

const themeVisible = ref(false);

onMounted(() => {
  // 从本地存储加载背景样式
  const savedStyle = localStorage.getItem("backgroundStyle");
  if (
    savedStyle &&
    ["grid", "blocks", "dynamic", "gradient", "bgimg"].includes(savedStyle)
  ) {
    backgroundStyle.value = savedStyle;
  }

  const savedBgImg = localStorage.getItem("backgroundImg");
  if (savedBgImg) {
    backgroundImg.value = savedBgImg;
  }
});

const changeBackground = (style: string) => {
  console.log(style, 'changeBackground');
  backgroundStyle.value = style;
  localStorage.setItem("backgroundStyle", style);
};

const changeBackgroundImg = (img: string) => {
  backgroundImg.value = img;
  localStorage.setItem("backgroundImg", img);
};

provide("backgroundStyle", {
  backgroundStyle,
  changeBackground,
  backgroundImg,
  changeBackgroundImg,
});
</script>

<template>
  <un-alert />
  <WebsiteBackground :styleType="backgroundStyle" :bgImg="backgroundImg" class="overflow-hidden">
    <Header />
    <!-- <div class="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-76px)]">
      <RouterView />
    </div> -->
    <div
      class="app-container overflow-hidden h-[calc(100vh-64px)] lg:h-[calc(100vh-76px)]"
    >
      <!-- Main Content Area -->
      <main class="main-content overflow-auto">
        <RouterView />
        <!-- <div class="content-placeholder">
        </div> -->
        <un-back-top class="back-top" />
      </main>
    </div>
    <Nav />
  </WebsiteBackground>
</template>

<style>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
  overflow-y: hidden;
}
</style>
<style scoped>
@import "@/assets/style/theme.css";

* {
  box-sizing: border-box;
  /* margin: 0;
  padding: 0; */
}

.app-container {
  display: flex;
  /* min-height: 100vh; */
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.main-content {
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  /* background-color: #f5f5f5; */
  border-radius: 12px;
  text-align: center;
  padding: 20px;
}

/* Media query for mobile devices */
@media (max-width: 767px) {
  .app-container {
    flex-direction: column;
  }

  .main-content {
    margin-left: 0;
    margin-bottom: 70px;
  }
  :deep(.back-top .back-to-top) {
    right: 20px;
    bottom: 100px;
  }
}

/* Media query for desktop */
@media (min-width: 768px) {
  .main-content {
    margin-left: 100px;
  }
}
</style>
