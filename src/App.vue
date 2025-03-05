<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./layout/header.vue";
</script>

<template>
  <Header />
  <div class="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-76px)]">
    <RouterView />
  </div>
</template>

<style scoped>
</style>
