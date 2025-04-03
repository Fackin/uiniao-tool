<template>
  <div class="w-full bg-gradient md:p-8">
    <div class="mx-auto space-y-8">
      <DraggableButton v-slot="slotProps">
        <WeatherButton :is-parent-dragging="slotProps.isParentDragging" />
      </DraggableButton>
      <div class="text-right">
        <WeatherButton />
      </div>
      <!-- Header -->
      <header class="text-center pb-4">
        <h1 class="text-3xl font-bold">My Dashboard</h1>
        <p>{{ currentDate }}</p>
      </header>

      <!-- Search Bar -->
      <div class="glass-card p-6 transition-all hover:shadow-lg">
        <div class="flex flex-col items-center">
          <div class="flex space-x-4 mb-4">
            <button
              v-for="engine in searchEngines"
              :key="engine.name"
              @click="currentEngine = engine"
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                currentEngine.name === engine.name
                  ? 'bg-primary/80  backdrop-blur-sm'
                  : 'bg-white/20 hover:bg-white/30  backdrop-blur-sm',
              ]"
            >
              {{ engine.name }}
            </button>
          </div>
          <div class="w-full max-w-2xl relative">
            <un-input
              v-model="searchQuery"
              placeholder="Search the web..."
              themeColor="var(--color-primary)"
              class="w-full"
              :clearable="true"
              :searchIcon="true"
              @search="performSearch"
            />
            <!-- <input 
                v-model="searchQuery" 
                type="text" 
                class="w-full px-4 py-3 pr-12 rounded-lg bg-white/20 backdrop-blur-sm border  focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent text-white placeholder-white/60"
                placeholder="Search the web..."
                @keyup.enter="performSearch"
              />
              <button 
                @click="performSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 "
              >
                <SearchIcon class="w-5 h-5" />
              </button> -->
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Calendar -->
        <div class="glass-card p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <CalendarIcon class="w-5 h-5 mr-2 text-primary-light" />
            Calendar
          </h2>
          <div class="calendar">
            <div class="grid grid-cols-7 gap-1 mb-2">
              <div
                v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                :key="day"
                class="text-center text-sm font-medium text-white/70"
              >
                {{ day }}
              </div>
            </div>
            <div class="grid grid-cols-7 gap-1">
              <div
                v-for="day in calendarDays"
                :key="day.date"
                :class="[
                  'h-10 flex items-center justify-center rounded-md text-sm',
                  day.isCurrentMonth ? 'text-white' : 'text-white/50',
                  day.isToday
                    ? 'bg-primary/70 backdrop-blur-sm font-bold'
                    : 'hover:bg-white/10',
                ]"
              >
                {{ day.dayOfMonth }}
              </div>
            </div>
          </div>
        </div>

        <!-- Weather Forecast -->
        <div class="glass-card p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <CloudIcon class="w-5 h-5 mr-2 text-primary-light" />
            Weather Forecast
          </h2>
          <div v-if="weather.loading" class="flex justify-center py-8">
            <LoaderIcon class="w-8 h-8 animate-spin text-primary-light" />
          </div>
          <div v-else-if="weather.error" class="text-center py-8">
            <CloudOffIcon class="w-10 h-10 mx-auto mb-2" />
            <p>{{ weather.error }}</p>
          </div>
          <div v-else class="flex flex-col items-center">
            <div class="flex items-center mb-4">
              <div class="text-5xl font-bold mr-4">
                {{ weather.temperature }}°
              </div>
              <div>
                <p class="text-xl">{{ weather.condition }}</p>
                <p class="">{{ weather.location }}</p>
              </div>
            </div>
            <div class="grid grid-cols-4 gap-2 w-full mt-4">
              <div
                v-for="(day, index) in weather.forecast"
                :key="index"
                class="text-center p-2 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                <p class="text-sm text-white/80">{{ day.day }}</p>
                <CloudIcon
                  v-if="day.condition === 'Cloudy'"
                  class="w-6 h-6 mx-auto my-1 text-white/80"
                />
                <SunIcon
                  v-else-if="day.condition === 'Sunny'"
                  class="w-6 h-6 mx-auto my-1 text-yellow-300"
                />
                <CloudRainIcon
                  v-else
                  class="w-6 h-6 mx-auto my-1 text-blue-300"
                />
                <p class="text-sm font-medium text-white">{{ day.temp }}°</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Quote -->
        <div class="glass-card p-6 md:col-span-2">
          <h2 class="text-xl font-semibold mb-4 flex items-center text-white">
            <QuoteIcon class="w-5 h-5 mr-2 text-primary-light" />
            Daily Inspiration
          </h2>
          <div v-if="dailyContent.loading" class="flex justify-center py-8">
            <LoaderIcon class="w-8 h-8 animate-spin text-primary-light" />
          </div>
          <div
            v-else-if="dailyContent.error"
            class="text-center py-8 text-white/70"
          >
            <AlertCircleIcon class="w-10 h-10 mx-auto mb-2 text-white/50" />
            <p>{{ dailyContent.error }}</p>
          </div>
          <div
            v-else-if="dailyContent.type === 'quote'"
            class="text-center py-6 px-4"
          >
            <p class="text-xl italic text-white/90 mb-4">
              "{{ dailyContent.content }}"
            </p>
            <p class="text-white/70">— {{ dailyContent.author }}</p>
          </div>
          <div
            v-else-if="dailyContent.type === 'image'"
            class="flex justify-center"
          >
            <div class="relative max-w-full">
              <img
                :src="dailyContent.imageUrl"
                alt="Daily inspiration"
                class="rounded-lg max-h-80 object-cover"
              />
              <p class="mt-2 text-sm text-white/70 text-center">
                {{ dailyContent.caption }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Search as SearchIcon,
  Calendar as CalendarIcon,
  Cloud as CloudIcon,
  CloudOff as CloudOffIcon,
  CloudRain as CloudRainIcon,
  Sun as SunIcon,
  Quote as QuoteIcon,
  AlertCircle as AlertCircleIcon,
  Loader as LoaderIcon,
} from "lucide-vue-next";
// import { getWeather } from '@/utils/qweather'
import WeatherIcon from "@/components/WeatherIcon.vue";
import WeatherButton from "./WeatherButton.vue";
import DraggableButton from "@/components/DraggableButton.vue";

// Search functionality
const searchEngines = [
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "Bing", url: "https://www.bing.com/search?q=" },
  { name: "Baidu", url: "https://www.baidu.com/s?wd=" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
];
const currentEngine = ref(searchEngines[0]);
const searchQuery = ref("");

const performSearch = () => {
  if (searchQuery.value.trim()) {
    window.open(
      currentEngine.value.url + encodeURIComponent(searchQuery.value),
      "_blank"
    );
  }
};

// Date and Calendar
const today = new Date();
const currentDate = computed(() => {
  return today.toLocaleDateString("zh-CN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const calendarDays = computed(() => {
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Get some days from previous month to fill the calendar
  const daysFromPrevMonth = firstDayOfMonth;
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

  const days = [];

  // Add days from previous month
  for (
    let i = daysInPrevMonth - daysFromPrevMonth + 1;
    i <= daysInPrevMonth;
    i++
  ) {
    days.push({
      date: `${prevMonthYear}-${prevMonth + 1}-${i}`,
      dayOfMonth: i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Add days from current month
  const currentDay = today.getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: `${year}-${month + 1}-${i}`,
      dayOfMonth: i,
      isCurrentMonth: true,
      isToday: i === currentDay,
    });
  }

  // Add days from next month to complete the grid (up to 42 cells)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length;

  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: `${nextMonthYear}-${nextMonth + 1}-${i}`,
      dayOfMonth: i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return days;
});

// Weather data (simulated API call)
const weather = ref({
  loading: true,
  error: null,
  temperature: null,
  condition: null,
  location: null,
  forecast: [],
});

// Daily content (quote or image)
const dailyContent = ref({
  loading: true,
  error: null,
  type: null,
  content: null,
  author: null,
  imageUrl: null,
  caption: null,
});

// Fetch weather data
const fetchWeather = async () => {
  weather.value.loading = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data (in a real app, you would fetch from a weather API)
    weather.value = {
      loading: false,
      error: null,
      temperature: 23,
      condition: "晴朗",
      location: "北京",
      forecast: [
        { day: "周一", temp: 24, condition: "Sunny" },
        { day: "周二", temp: 22, condition: "Cloudy" },
        { day: "周三", temp: 20, condition: "Rainy" },
        { day: "周四", temp: 21, condition: "Cloudy" },
      ],
    };
  } catch (error) {
    weather.value = {
      loading: false,
      error: "无法获取天气数据",
      temperature: null,
      condition: null,
      location: null,
      forecast: [],
    };
  }
};

// Fetch daily content (quote or image)
const fetchDailyContent = async () => {
  dailyContent.value.loading = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Randomly choose between quote and image
    const contentType = Math.random() > 0.5 ? "quote" : "image";

    if (contentType === "quote") {
      // Mock quote data (in a real app, you would fetch from an API like quotes.rest)
      dailyContent.value = {
        loading: false,
        error: null,
        type: "quote",
        content: "生活中最重要的不是你所处的位置，而是你所朝的方向。",
        author: "奥利弗·温德尔·霍姆斯",
      };
    } else {
      // Mock image data
      dailyContent.value = {
        loading: false,
        error: null,
        type: "image",
        imageUrl:
          "https://source.unsplash.com/random/800x400/?nature,inspiration",
        caption: "每日灵感图片",
      };
    }
  } catch (error) {
    dailyContent.value = {
      loading: false,
      error: "无法获取每日内容",
      type: null,
      content: null,
      author: null,
      imageUrl: null,
      caption: null,
    };
  }
};

// const getWeather = (cityCode) => {
//   fetch("http://localhost:3000/weather/3d?location=101010100", {
//     "no-cor": true,
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data, "getWeather----");
//     });
// };

onMounted(() => {
  fetchWeather();
  fetchDailyContent();
  // getWeather("101010100");
});
</script>

<style>
/* :root {
    --color-primary: #6366f1;
    --color-primary-light: #a5b4fc;
  } */

.bg-gradient {
  color: var(--color-text);
  /* background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); */
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.bg-primary {
  background-color: var(--color-primary);
}

.bg-primary\/70 {
  background-color: rgba(99, 102, 241, 0.7);
}

.bg-primary\/80 {
  background-color: rgba(99, 102, 241, 0.8);
}

.text-primary {
  color: var(--color-primary);
}

.text-primary-light {
  color: var(--color-primary-light);
}

.focus\:ring-primary\/70:focus {
  --tw-ring-color: rgba(99, 102, 241, 0.7);
}

/* Ensure text is readable on glass backgrounds */
.glass-card input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>
