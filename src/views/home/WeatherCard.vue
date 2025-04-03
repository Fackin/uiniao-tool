<template>
  <div class="forecast-container">
    <div class="forecast-card">
      <h2 class="forecast-title">{{ title }}</h2>

      <div class="forecast-days">
        <div
          v-for="(day, index) in list"
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
import { ref, computed, h } from "vue";
import WeatherIcon from "@/components/WeatherIcon.vue";
import { dateToWeek } from "@/utils/date";

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  link: {
    type: String,
    default: () => "",
  },
});
// 标题
const title = ref("7天天气预报");

// 当前选中的天气卡片
const activeDay = ref(0);

// 天气数据
const forecastData = ref([
  {
    dayName: "周一",
    weatherType: "sunny",
    weatherName: "晴",
    highTemp: 28,
    lowTemp: 18,
  },
  {
    dayName: "周二",
    weatherType: "partly-cloudy",
    weatherName: "多云",
    highTemp: 26,
    lowTemp: 17,
  },
  {
    dayName: "周三",
    weatherType: "cloudy",
    weatherName: "阴",
    highTemp: 24,
    lowTemp: 16,
  },
  {
    dayName: "周四",
    weatherType: "rainy",
    weatherName: "小雨",
    highTemp: 22,
    lowTemp: 15,
  },
  {
    dayName: "周五",
    weatherType: "stormy",
    weatherName: "雷雨",
    highTemp: 20,
    lowTemp: 14,
  },
  {
    dayName: "周六",
    weatherType: "partly-cloudy",
    weatherName: "多云",
    highTemp: 23,
    lowTemp: 16,
  },
  {
    dayName: "周日",
    weatherType: "sunny",
    weatherName: "晴",
    highTemp: 25,
    lowTemp: 17,
  },
]);

// 天气图标组件
const getWeatherIcon = (type) => {
  // 根据天气类型返回对应的SVG图标
  const icons = {
    sunny: () =>
      h(
        "svg",
        {
          width: "36",
          height: "36",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z",
            fill: "#FFD700",
          }),
          h("path", {
            d: "M12 1V3M12 21V23M23 12H21M3 12H1M20.071 3.929L18.657 5.343M5.343 18.657L3.929 20.071M20.071 20.071L18.657 18.657M5.343 5.343L3.929 3.929",
            stroke: "#FFD700",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ]
      ),
    "partly-cloudy": () =>
      h(
        "svg",
        {
          width: "36",
          height: "36",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M8 11.5C5.23858 11.5 3 9.26142 3 6.5C3 3.73858 5.23858 1.5 8 1.5C10.7614 1.5 13 3.73858 13 6.5C13 7.0368 12.9158 7.55494 12.7605 8.04373C12.5015 8.01489 12.2383 8 11.9722 8C8.21376 8 5.16597 10.9082 5.00266 14.5H4.5C2.567 14.5 1 12.933 1 11C1 9.067 2.567 7.5 4.5 7.5H4.77953C5.4276 4.15869 8.41613 1.5 12 1.5C15.866 1.5 19 4.63401 19 8.5C19 9.0368 18.9158 9.55494 18.7605 10.0437C18.5015 10.0149 18.2383 10 17.9722 10C14.2138 10 11.166 12.9082 11.0027 16.5H10.5C8.567 16.5 7 14.933 7 13C7 11.067 8.567 9.5 10.5 9.5H10.7795C11.4276 6.15869 14.4161 3.5 18 3.5",
            fill: "#FFD700",
          }),
          h("path", {
            d: "M17.5 22C20.5376 22 23 19.5376 23 16.5C23 13.4624 20.5376 11 17.5 11C14.4624 11 12 13.4624 12 16.5C12 19.5376 14.4624 22 17.5 22Z",
            fill: "#E0E0E0",
          }),
        ]
      ),
    cloudy: () =>
      h(
        "svg",
        {
          width: "36",
          height: "36",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M22 15C22 18.866 18.866 22 15 22H6C2.68629 22 0 19.3137 0 16C0 12.6863 2.68629 10 6 10C6.25756 10 6.51207 10.0164 6.76201 10.0483C7.4969 7.16937 10.0973 5 13.1579 5C16.7211 5 19.6175 7.89634 19.6175 11.4579C19.6175 11.9608 19.5685 12.4514 19.4755 12.9252C20.9971 13.0741 22.2139 13.8933 22.8289 15.0921",
            fill: "#E0E0E0",
          }),
        ]
      ),
    rainy: () =>
      h(
        "svg",
        {
          width: "36",
          height: "36",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M20 15.5C20 18.5376 17.5376 21 14.5 21H7.5C4.46243 21 2 18.5376 2 15.5C2 12.4624 4.46243 10 7.5 10C7.67 10 7.83 10.0164 8 10.0483C8.55 7.7 10.72 6 13.25 6C16.15 6 18.5 8.35 18.5 11.25C18.5 11.67 18.46 12.08 18.37 12.47C19.4 12.67 20.25 13.3 20.7 14.17",
            fill: "#E0E0E0",
          }),
          h("path", {
            d: "M7 16.5V19.5M11 16.5V19.5M15 16.5V19.5",
            stroke: "#4682B4",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ]
      ),
    stormy: () =>
      h(
        "svg",
        {
          width: "36",
          height: "36",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M19 9.9C19 13.15 16.35 15.8 13.1 15.8H5.9C2.65 15.8 0 13.15 0 9.9C0 6.65 2.65 4 5.9 4C6.14 4 6.37 4.02 6.6 4.05C7.25 1.32 9.7 -0.5 12.65 -0.5C16.05 -0.5 18.8 2.25 18.8 5.65C18.8 6.1 18.75 6.55 18.65 6.95C18.95 7.15 19.2 7.4 19.4 7.65",
            fill: "#E0E0E0",
          }),
          h("path", {
            d: "M13 11L9 17H15L11 23",
            stroke: "#FFD700",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ]
      ),
    snowy: () =>
      h(
        "svg",
        {
          width: "36",
          height: "36",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M20 15.5C20 18.5376 17.5376 21 14.5 21H7.5C4.46243 21 2 18.5376 2 15.5C2 12.4624 4.46243 10 7.5 10C7.67 10 7.83 10.0164 8 10.0483C8.55 7.7 10.72 6 13.25 6C16.15 6 18.5 8.35 18.5 11.25C18.5 11.67 18.46 12.08 18.37 12.47C19.4 12.67 20.25 13.3 20.7 14.17",
            fill: "#E0E0E0",
          }),
          h("circle", {
            cx: "7",
            cy: "18",
            r: "1",
            fill: "white",
          }),
          h("circle", {
            cx: "11",
            cy: "18",
            r: "1",
            fill: "white",
          }),
          h("circle", {
            cx: "15",
            cy: "18",
            r: "1",
            fill: "white",
          }),
        ]
      ),
  };

  return icons[type] || icons["sunny"];
};

// /**
//  * 获取指定城市的天气信息
//  *
//  * @param cityCode 城市代码，此函数未使用
//  * @returns 无返回值
//  */
// const getWeather = (cityCode) => {
//   fetch("http://localhost:3000/weather/7d?location=101010100", {
//     "no-cor": true,
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data, "getWeather--7--");
//     //   if (data && data.data && data.data.now) {
//     //     temperature.value = data.data.now.temp;
//     //     weatherIcon.value = data.data.now.icon;
//     //     // location.value = data.data.now.location;
//     //     date.value = new Date(data.data.now.obsTime).toLocaleDateString();
//     //   }
//     });
// };

// onMounted(() => {
//   // Simulate fetching weather data
//   console.log("Fetching initial weather data...");
//   getWeather();
// });
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
  text-align: center;
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
