<script setup>
import { ref } from 'vue';
import Timeline from '@/components/Timeline.vue';
// import Map from '@/components/Map.vue';

const dynastyDetail = ref(null);

const handleSelectDynasty = (dynasty) => {
    console.log('Selected Dynasty:', dynasty);
    dynastyDetail.value = dynasty;
};
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold text-center my-4">中国朝代时间轴</h1>
        <Timeline @select="handleSelectDynasty" />
        <div v-if="dynastyDetail">
            <h2>{{ dynastyDetail.name }}</h2>
            <p>{{ dynastyDetail.capital }}</p>
            <!-- <Map :territory="dynastyDetail.territory" /> -->
        </div>
    </div>
</template>

<style scoped></style>