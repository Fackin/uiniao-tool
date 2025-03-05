<script setup>
import { ref, onMounted, watch } from "vue";
import L from "leaflet";

const props = defineProps({
  territory: Object,
});
const map = ref(null);

onMounted(() => {
  map.value = L.map("map").setView([35, 105], 4);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value);

  // 绘制版图
  if (props.territory) {
    L.geoJSON(props.territory).addTo(map.value);
  }
});

watch(
  () => props.territory,
  (newVal) => {
    if (newVal) {
      if (map.value && newVal) {
        map.value.eachLayer((layer) => {
          if (layer instanceof L.GeoJSON) {
            map.value.removeLayer(layer);
          }
        });
        L.geoJSON(newTerritory).addTo(map.value);
      }
    }
  }
);
</script>

<template>
  <div ref="map" class="map"></div>
</template>

<style scoped></style>
