<script setup>
import { ref } from "vue";
// import Timeline from "@/components/Timeline.vue";
import DynastyTimeline from "@/components/DynastyTimeline.vue";
// import DynastyTimeline1 from "@/components/DynastyTimeline1.vue";
// import Map from '@/components/Map.vue';

const dynastyDetail = ref(null);

const handleSelectDynasty = (dynasty) => {
  console.log("Selected Dynasty:", dynasty);
  dynastyDetail.value = dynasty;
};
</script>

<template>
  <div>
    <DynastyTimeline title="中国历史朝代时间线" />
    <!-- <DynastyTimeline1 title="中国历史朝代时间线" /> -->
  </div>
</template>

<style scoped></style>
