<script setup>
import { ref, onMounted } from 'vue';  
// import Timeline from 'vis-timeline/standalone';
// import 'vis-timeline/styles/vis-timeline-graph2d.css';

// import { DataSet } from "vis-data/peer";
// import { Timeline } from "vis-timeline/peer";
import { DataSet } from "vis-data/esnext";
import { Timeline } from "vis-timeline/esnext";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import { dynastyData } from '@/mock';

const emit = defineEmits(['select']);
const timeline = ref(null);

onMounted(() => {
    // 生成时间轴数据
    const times = dynastyData.map((item) => {
        return {
            id: item.id,
            content: item.name,
            start: new Date(item.start_year, 0, 1),
            end: new Date(item.end_year, 11, 31),
        };
    });
    // 初始化时间轴组件
    const timelineInstance = new Timeline(timeline.value, new DataSet(times));
    timelineInstance.on('select', function (properties) {
        console.log('properties', properties);
        emit('select', dynastyData.find(item => item.id === properties.items[0]));
    });
})
</script>

<template>
    <div ref="timeline" class="timeline"></div>
</template>

<style scoped></style>