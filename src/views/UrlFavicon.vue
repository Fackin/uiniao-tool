<template>
  <h2>🔍 获取网站 Favicon</h2>
  <div>
    <un-input
      v-model="url"
      placeholder="输入网站 URL，如 google.com"
      themeColor="var(--color-primary)"
      class="mb-2 mr-4"
      style="width: 330px"
    />
    <un-button @click="handleMake" themeColor="var(--color-primary)"
      >获取 Favicon</un-button
    >
    <un-button @click="handleCopy" themeColor="var(--color-primary)"
      >📋 复制
    </un-button>
    <un-button @click="handleDownload" themeColor="var(--color-primary)"
      >📥 下载
    </un-button>
  </div>
  <div v-if="faviconUrl">
    {{ faviconUrl }}
  </div>
  <div v-if="faviconUrl">
    <img :src="faviconUrl" alt="" style="width: 64px; height: 64px" />
  </div>

  <div v-for="fUrl in faviconUrls">
    <div>
      {{ fUrl }}
    </div>
    <div>
      <img :src="fUrl" alt="" style="width: 64px; height: 64px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAlert } from "@/hooks/useAlert";

const url = ref("");
const faviconUrl = ref();
const faviconUrls = ref<string[]>([]);
const { showAlert } = useAlert();

const handleMake = async () => {
  //   const a = await getWebsiteFavicon(url.value);
  //   console.log("faviconUrl:", a);
  //   faviconUrl.value = a;

  const s =
    url.value.indexOf("http") === -1 ? `https://${url.value}` : url.value;
  const parsedUrl = new URL(s);
  getBestFavicon(parsedUrl);
};

// 如果 Google API 失效，回退到 DuckDuckGo API
const getBestFavicon = async (parsedUrl: URL) => {
  const urls = [
    `${parsedUrl.origin}/favicon.ico`,
    `https://www.google.com/s2/favicons?sz=64&domain=${parsedUrl.hostname}`,
    `https://icons.duckduckgo.com/ip2/${parsedUrl.hostname}.ico`,
    `https://api.faviconkit.com/${parsedUrl.hostname}/64`,
  ];

  faviconUrls.value = urls;
  return;

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return url;
    } catch (error) {
      console.warn(`Favicon 获取失败: ${url}`);
    }
  }
  return "null";
};
// 获取网站图标
const getWebsiteFavicon = async (url: string) => {
  url = url.indexOf("http") === -1 ? `https://${url}` : url;
  const parsedUrl = new URL(url);
  const defaultFavicon = `${parsedUrl.origin}/favicon.ico`;
  const googleFaviconAPI = `https://www.google.com/s2/favicons?sz=64&domain=${parsedUrl.hostname}`;

  // 方法 2：解析 HTML 获取 favicon
  async function fetchFaviconFromHTML() {
    try {
      const response = await fetch(url);
      const text = await response.text();

      // 解析 HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      // 查找 <link rel="icon"> 或 <link rel="shortcut icon">
      const iconLink = doc.querySelector(
        "link[rel*='icon']"
      ) as HTMLLinkElement | null;
      if (iconLink && iconLink.href) {
        return new URL(iconLink.href, url).href;
      }
    } catch (error) {
      console.warn("无法解析 HTML 获取 favicon:", error);
    }
    return null;
  }

  // 依次尝试三种方式获取 favicon
  let favicon = await fetchFaviconFromHTML();
  if (!favicon) {
    // 先尝试默认路径 `/favicon.ico`
    try {
      const res = await fetch(defaultFavicon, { method: "HEAD" });
      if (res.ok) {
        favicon = defaultFavicon;
      }
    } catch (error) {
      console.warn("默认 favicon.ico 不存在:", error);
    }
  }
  getBestFavicon(parsedUrl);
  // 如果前两种方法都失败，使用 Google Favicon API
  return favicon || googleFaviconAPI;
};

const handleCopy = () => {
  navigator.clipboard
    .writeText(faviconUrl.value)
    .then(() => {
      showAlert("已复制到剪贴板", "success");
    })
    .catch((err) => {
      showAlert("复制失败", "error");
    });
};

const handleDownload = async () => {
  try {
    // const response = await fetch(faviconUrl.value, { method: "GET" });
    // if (!response.ok) throw new Error("图片下载失败");

    // const blob = await response.blob();
    // const fileType = blob.type.includes("ico") ? "ico" : "png"; // 识别格式
    const fileName = `favicon.png`;

    // 创建临时下载链接
    const link = document.createElement("a");
    link.href = faviconUrl.value;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 释放内存
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("下载失败:", error);
    alert("下载失败，请尝试其他网址");
  }
};
</script>

<style scoped></style>
