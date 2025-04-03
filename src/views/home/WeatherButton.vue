<template>
  <!--  @mouseleave="() => (isOpen = false)" -->
  <div class="weather-container">
    <div
      class="weather-widget"
      :class="{ 'widget-hover': isMore }"
      @click.stop="handleClickMore"
    >
      <div class="weather-left">
        <div class="weather-icon">
          <WeatherIcon :icon-id="weatherIcon" width="30" height="30" />
        </div>
      </div>
      <div class="weather-divider"></div>
      <div class="weather-info" @click.stop="handleOpenCard">
        <div class="temperature">{{ temperature }}°</div>
        <div class="location-info">
          <div class="location">{{ location }}</div>
          <div class="date">{{ date }}</div>
        </div>
      </div>
      <div class="setting-button" @click.stop="handleSetting">
        <Settings class="w-4 h-4" />
      </div>
    </div>
    <div v-if="isOpen" ref="dropdown" class="dropdown-box">
      <WeatherCard :list="forecastList" :link="moreLink" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import WeatherIcon from "@/components/WeatherIcon.vue";
import WeatherCard from "./WeatherCard.vue";
import { Settings } from "lucide-vue-next";

// Weather data
const temperature = ref("22");
const location = ref("Beijing");
const date = ref("2025/01/01");
const weatherIcon = ref("100");

const isOpen = ref(false);
const isMore = ref(false);
const moreLink = ref();
const forecastList = ref([]);

const dropdown = ref();

const props = defineProps({
  isParentDragging: Function,
});

const handleClickMore = (e) => {
  console.log(props.isParentDragging());
  if (props.isParentDragging()) {
    e.stopPropagation();
    return;
  }
  console.log("子组件点击事件");
  isMore.value = !isMore.value;
  if (!isMore.value) {
    isOpen.value = false;
  }
};

const handleOpenCard = () => {
  if (props.isParentDragging()) {
    e.stopPropagation();
    return;
  }
  isOpen.value = !isOpen.value;
};

// 监听外部点击，关闭下拉框
const handleClickOutside = (event) => {
  console.log("handleClickOutside", event.target);
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
    document.removeEventListener("click", handleClickOutside);
  }
};

// Method to refresh weather data
const handleSetting = () => {
  // In a real application, you would fetch weather data from an API here
  console.log("Refreshing weather data...");
  // For demo purposes, we'll just simulate a refresh with a slight delay
  setTimeout(() => {
    console.log("Weather data refreshed!");
  }, 500);
};

/**
 * 获取指定城市的天气信息
 *
 * @param cityCode 城市代码，此函数未使用
 * @returns 无返回值
 */
const getWeather = (cityCode) => {
  fetch("http://localhost:3000/weather/now?location=101010100", {
    "no-cor": true,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "getWeather----");
      if (data && data.data && data.data.now) {
        temperature.value = data.data.now.temp;
        weatherIcon.value = data.data.now.icon;
        // location.value = data.data.now.location;
        date.value = new Date(data.data.now.obsTime).toLocaleDateString();
      }
    });
};

/**
 * 获取指定城市的天气信息
 *
 * @param cityCode 城市代码，此函数未使用
 * @returns 无返回值
 */
const getForecast = (cityCode) => {
  fetch("http://localhost:3000/weather/7d?location=101010100")
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "getWeather--7--");
      moreLink.value = data.data.fxLink;
      if (data && data.data && data.data.daily) {
        forecastList.value = data.data.daily;
      }
    });
};

onMounted(() => {
  // Simulate fetching weather data
  console.log("Fetching initial weather data...");
  getWeather();
});

watch(
  () => isOpen.value,
  (val) => {
    if (val) {
      // nextTick(() => {
      console.log("toggleDropdown addEventListener");
      getForecast();
      window.document.addEventListener("click", handleClickOutside);
      // });
    } else {
      console.log("toggleDropdown removeEventListener");
      document.removeEventListener("click", handleClickOutside);
    }
  }
);

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.weather-container {
  display: inline-block;
  position: relative;
}
.dropdown-box {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  width: max-content;
  /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */
  border-radius: 8px;
  overflow: hidden;
}

.weather-widget {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 8px 15px;
  /* box-shadow: 0 6px 12px rgba(31, 38, 135, 0.1); */
  box-shadow: 0px 0px 1px 1px rgb(0 0 0 / 10%), 0px 0px 1px 2px rgb(0 0 0 / 5%),
    0px 0px 1px 1px rgb(255 252 252 / 60%) inset,
    1.5px 1px 1px 1px rgb(202 202 202 / 18%) inset;
  /* border: 1px solid rgba(255, 255, 255, 0.6); */
  color: var(--color-text);
  /* width: 300px; */
  width: 60px;
  height: 60px;
  overflow: hidden;
  cursor: pointer;
  transition: width 0.5s ease-in-out;
}
.widget-hover {
  width: auto;
  background: rgba(255, 255, 255, 0.3);
}
/* .weather-container:hover .weather-widget {
  width: auto;
  background: rgba(255, 255, 255, 0.3);
} */

.weather-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
}

.weather-divider {
  width: 1px;
  height: 58px;
  /* background: var(--color-text);
  opacity: 0.1; */
  margin: -9px 15px;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.6) 10%,
    rgba(255, 255, 255, 0.8) 30%,
    rgba(255, 255, 255, 0.1)
  );
  box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.1), 2px 0 0 0 rgba(0, 0, 0, 0.05);
}

.weather-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  /* flex: 1; */
}

.temperature {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 2px;
}

.location-info {
  display: flex;
  flex-direction: column;
}

.location {
  font-size: 14px;
  font-weight: 500;
}

.date {
  font-size: 12px;
  opacity: 0.8;
}

.setting-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 8px;
}

.setting-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 400px) {
  .weather-widget {
    width: 100%;
    padding: 8px 15px;
  }

  .temperature {
    font-size: 24px;
  }

  .location {
    font-size: 12px;
  }

  .date {
    font-size: 10px;
  }
}
</style>
