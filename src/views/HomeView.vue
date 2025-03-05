<script setup lang="ts">
import IconColorCamera from "@/components/icons/IconColorCamera.vue";
import IconDynasty from "@/components/icons/IconHistory.vue";
import IconImageMagnifier from "@/components/icons/IconImageMagnifier.vue";

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
    path: "/",
    title: "Home",
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
    path: "/color-camera",
    title: "Color Camera",
    icon: IconColorCamera,
  },
  {
    path: "/dynasty",
    title: "Dynasty",
    icon: IconDynasty,
  },
];
</script>

<template>
  <main class="p-4">
    <nav
      class="grid grid-cols-3 gap-4 items-center sm:grid-cols-4 md:grid-cols-6 xl:flex"
    >
      <div
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
      </div>
    </nav>
  </main>
</template>
<style scoped>
@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}
</style>
