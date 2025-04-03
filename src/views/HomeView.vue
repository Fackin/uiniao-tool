<script setup lang="ts">
import IconColorCamera from "@/components/icons/IconColorCamera.vue";
import IconDynasty from "@/components/icons/IconHistory.vue";
import IconImageMagnifier from "@/components/icons/IconImageMagnifier.vue";
import ShortcutCard from "./home/ShortcutCard.vue"
import ToolsCard from "./home/ToolsCard.vue"
import MainCard from "./home/MainCard.vue"

const menus = [
  {
    path: "/colorful",
    title: "colorful",
  },
  {
    path: "/color-camera",
    title: "Color Camera",
    icon: IconColorCamera,
  },
  {
    path: "/dynasty",
    title: "Dynasty",
    icon: IconDynasty,
  },
  {
    path: "/image-view",
    title: "Image Magnifier",
    icon: IconImageMagnifier,
  },
  {
    path: "/cursor-style",
    title: "Cursor Style",
    icon: IconColorCamera,
  },
  {
    path: "/name-avatar",
    title: "Name Avatar",
    icon: IconDynasty,
  },
  {
    path: "/mosaic-card-view",
    title: "mosaic card view",
  },
  {
    path: "/pixel-card-view",
    title: "pixel-card-view",
    icon: IconColorCamera,
  },
  {
    path: "/pixel-view",
    title: "pixel-view",
    icon: IconDynasty,
  },
  {
    path: "/snake-game",
    title: "Snake Game",
    icon: IconColorCamera,
  },
  {
    path: "/keyboard",
    title: "keyboard",
    icon: IconDynasty,
  },
  {
    path: "/name-avatar1",
    title: "Name Avatar1",
    icon: IconDynasty,
  },
  {
    path: "/png-2-svg",
    title: "Png To Svg",
    icon: IconDynasty,
  },
  {
    path: "/liquid-nav",
    title: "Liquid Nav",
    icon: IconDynasty,
  },
  {
    path: "/battery-demo",
    title: "Battery Demo",
    icon: IconDynasty,
  },
  {
    path: "/url-favicon",
    title: "Url Favicon",
    icon: IconDynasty,
  },
];
</script>

<template>
  <main>
    <nav
    >
      <div id="home" class="grid grid-cols-3 gap-4 items-center sm:grid-cols-4 md:grid-cols-6 xl:flex">
        <MainCard />
        <!-- <div
          v-for="menu in menus"
          class="w-[100px] h-[100px] border rounded-lg m-auto"
        >
          <RouterLink
            :to="menu.path"
            class="w-[100%] h-[100%] flex flex-col justify-center items-center text-[12px]"
          >
            <component
              v-if="menu.icon"
              :is="menu.icon"
              class="w-[32px] h-[32px]"
            />
            {{ menu.title }}
          </RouterLink>
        </div> -->
      </div>
      <div id="search">
        <ShortcutCard />
      </div>
      <div id="tools">
        <!-- <h1>Tools</h1> -->
        <ToolsCard />
      </div>
      <div id="profile" class="h-[300px]">
        <h1>Profile</h1>
      </div>
    </nav>
  </main>
</template>
<style scoped>
@media (hover: hover) {
  a:hover {
    background-color: var(--color-bghover);
    /* // hsla(160, 100%, 37%, 0.2); */
  }
}
</style>
