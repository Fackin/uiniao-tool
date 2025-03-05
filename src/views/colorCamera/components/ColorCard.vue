<script setup lang="ts">
import copyText from "@/utils/copyText.ts";
import { defineProps, defineEmits } from "vue";
import IconClose from "@/components/icons/IconClose.vue";

defineProps<{
  color: string;
}>();

const emit = defineEmits(["delete"]);

</script>

<template>
  <div class="w-[74px] h-[70px] flex flex-col justify-center items-center rounded-lg border relative" @click="copyText(color)">
    <div class="text-red-500 cursor-pointer" @click="emit('delete')">
        <IconClose class="w-[18px] h-[18px] absolute -top-[9px] -right-[9px]"/>
    </div>
    <div class="w-[30px] h-[30px] rounded-sm" :style="{ background: color }"></div>
    <div>{{ color }}</div>
  </div>
</template>

<style scoped></style>
