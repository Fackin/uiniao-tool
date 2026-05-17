<template>
  <div class="forecast-container">
    <div class="forecast-card">
      <h2 class="forecast-title text-xl font-semibold mb-4 flex items-center">
        <CloudIcon class="w-5 h-5 mr-2 text-primary-light" /> Weather Forecast
      </h2>

      <div class="forecast-days">
        <div
          v-for="(day, index) in forecastList"
          :key="index"
          class="day-forecast"
          :class="{ active: index === activeDay }"
          @click="activeDay = index"
        >
          <div class="day-name">{{ dateToWeek(day.fxDate) }}</div>
          <div class="day-name-1">{{ day.fxDate }}</div>
          <div class="weather-icon">
            <!-- <component :is="getWeatherIcon(day.weatherType)" /> -->
            <WeatherIcon :icon-id="day.iconDay" width="30" height="30" />
          </div>
          <div class="weather-name">{{ day.textDay }}</div>
          <div class="temperature-range">
            <span class="high-temp">{{ day.tempMax }}°</span>
            <span class="temp-separator">/</span>
            <span class="low-temp">{{ day.tempMin }}°</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import WeatherIcon from "@/components/WeatherIcon.vue";
import { dateToWeek } from "@/utils/date";

import { Cloud as CloudIcon } from "lucide-vue-next";

defineProps({
  cityCode: {
    type: String,
    default: () => "",
  },
});
// 当前选中的天气卡片
const activeDay = ref(0);


const moreLink = ref();
const forecastList = ref([]);
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
  getForecast();
});
</script>

<style scoped>
.forecast-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-family: "Arial", sans-serif;
  /* background-image: linear-gradient(to bottom right, #87CEEB, #1E90FF); */
  /* min-height: 300px; */
}

.forecast-card {
  /* background: rgba(255, 255, 255, 0.2); */
  background: var(--color-background);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: var(--color-text);
  width: 100%;
  max-width: 800px;
}

.forecast-title {
  text-align: left;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

.forecast-days {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.day-forecast {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  flex: 1;
  min-width: 90px;
}

.day-forecast:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.day-forecast.active {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.day-name {
  font-weight: 600;
  margin-bottom: 4px;
}
.day-name-1 {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.weather-icon {
  margin-bottom: 10px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.weather-name {
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.temperature-range {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.high-temp {
  font-weight: 600;
  color: #ffd700;
}

.temp-separator {
  margin: 0 3px;
  opacity: 0.7;
}

.low-temp {
  color: #e0e0e0;
}

@media (max-width: 768px) {
  .forecast-days {
    justify-content: center;
  }

  .day-forecast {
    min-width: 80px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .forecast-days {
    flex-direction: column;
  }

  .day-forecast {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 15px;
  }

  .day-name {
    margin-bottom: 0;
    width: 40px;
  }

  .weather-icon {
    margin-bottom: 0;
  }

  .weather-name {
    margin-bottom: 0;
    width: 40px;
    text-align: center;
  }
}
</style>
