<template>
  <div
    class="date-time-container"
    :class="{ 'calendar-expanded': showMonthCalendar }"
  >
    <!-- Enhanced Calendar-like Date Display -->
    <div
      class="calendar-display"
      @click="toggleMonthCalendar"
      :style="{ '--accent-color': seasonInfo.color }"
    >
      <div class="calendar-header">
        <div class="calendar-month">{{ monthName }}</div>
        <div class="calendar-year">{{ year }}</div>
      </div>

      <div class="calendar-body">
        <div class="calendar-day-number">{{ dayNumber }}</div>
        <div class="calendar-day-info">
          <div class="calendar-weekday">{{ dayOfWeek }}</div>
          <div class="calendar-season">
            <component :is="seasonIcon" class="season-icon" />
            <span>{{ seasonText }}</span>
          </div>
        </div>
      </div>

      <div class="calendar-footer">
        <div class="calendar-hint">
          <ChevronDown
            :class="['hint-icon', { 'rotate-icon': showMonthCalendar }]"
          />
          <span>{{ showMonthCalendar ? "收起日历" : "展开日历" }}</span>
        </div>
      </div>
    </div>

    <!-- Expandable Month Calendar -->
    <Transition name="expand">
      <div v-if="showMonthCalendar" class="month-calendar">
        <div class="month-calendar-header">
          <button class="month-nav-btn" @click="changeMonth(-1)">
            <ChevronLeft />
          </button>
          <div class="month-title">
            {{ calendarMonthName }} {{ calendarYear }}
          </div>
          <button class="month-nav-btn" @click="changeMonth(0)">
            <CalendarCheck />
          </button>
          <button class="month-nav-btn" @click="changeMonth(1)">
            <ChevronRight />
          </button>
        </div>

        <div class="weekday-header">
          <div v-for="day in weekdays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>

        <div class="days-grid">
          <div
            v-for="{ day, currentMonth, isToday } in calendarDays"
            :key="`${calendarYear}-${calendarMonth}-${day}`"
            class="day-cell"
            :class="{
              'current-month': currentMonth,
              'other-month': !currentMonth,
              today: isToday,
            }"
          >
            {{ day }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- Greeting Message -->
    <div class="greeting">
      <span>{{ greeting }}</span>
    </div>

    <!-- Clock Toggle -->
    <div class="clock-toggle">
      <button
        @click="clockType = 'analog'"
        :class="{ active: clockType === 'analog' }"
      >
        <Clock class="toggle-icon" />
        指针时钟
      </button>
      <button
        @click="clockType = 'digital'"
        :class="{ active: clockType === 'digital' }"
      >
        <Timer class="toggle-icon" />
        数字时钟
      </button>
    </div>

    <!-- Clock Display -->
    <Transition name="fade" mode="out-in">
      <!-- Analog Clock -->
      <div v-if="clockType === 'analog'" key="analog" class="analog-clock">
        <div class="clock-face">
          <div class="hour-marks">
            <div
              v-for="n in 12"
              :key="n"
              class="hour-mark"
              :style="hourMarkStyle(n)"
            ></div>
          </div>
          <div class="hand hour-hand" :style="hourHandStyle"></div>
          <div class="hand minute-hand" :style="minuteHandStyle"></div>
          <div class="hand second-hand" :style="secondHandStyle"></div>
          <div class="center-dot"></div>
        </div>
      </div>

      <!-- Digital Clock -->
      <div v-else key="digital" class="digital-clock">
        <div class="time">{{ formattedTime }}</div>
        <div class="seconds-container">
          <div class="seconds">{{ seconds }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  Clock,
  Timer,
  Sun,
  Cloud,
  Leaf,
  Snowflake,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from "lucide-vue-next";

// State
const currentTime = ref(new Date());
const clockType = ref("analog"); // 'analog' or 'digital'
const showMonthCalendar = ref(false);
const calendarMonth = ref(new Date().getMonth());
const calendarYear = ref(new Date().getFullYear());
let timer = null;

// Update time every second
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

// Toggle month calendar
const toggleMonthCalendar = () => {
  showMonthCalendar.value = !showMonthCalendar.value;
  // Reset to current month when opening
  if (showMonthCalendar.value) {
    calendarMonth.value = currentTime.value.getMonth();
    calendarYear.value = currentTime.value.getFullYear();
  }
};

// Change month in calendar
const changeMonth = (delta) => {
  if (delta === 0) {
    calendarMonth.value = new Date().getMonth();
    calendarYear.value = new Date().getFullYear();
    return;
  }
  let newMonth = calendarMonth.value + delta;
  let newYear = calendarYear.value;

  if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  } else if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }

  calendarMonth.value = newMonth;
  calendarYear.value = newYear;
};

// Greeting based on time of day
const greeting = computed(() => {
  const hour = currentTime.value.getHours();
  if (hour < 6) return "夜深了，注意休息";
  if (hour < 9) return "早上好，开始新的一天";
  if (hour < 12) return "上午好，工作顺利";
  if (hour < 14) return "中午好，记得午休";
  if (hour < 18) return "下午好，继续加油";
  if (hour < 22) return "晚上好，放松一下";
  return "夜深了，注意休息";
});

// Computed properties for date
const monthName = computed(() => {
  const options = { month: "long" };
  return currentTime.value.toLocaleDateString("zh-CN", options);
});

const dayNumber = computed(() => {
  return currentTime.value.getDate();
});

const year = computed(() => {
  return currentTime.value.getFullYear();
});

const dayOfWeek = computed(() => {
  const options = { weekday: "long" };
  return currentTime.value.toLocaleDateString("zh-CN", options);
});

// Season information
const seasonInfo = computed(() => {
  const month = currentTime.value.getMonth();

  if (month >= 2 && month <= 4) {
    return {
      text: "春季",
      icon: Sun,
      color: "#76c893",
    };
  } else if (month >= 5 && month <= 7) {
    return {
      text: "夏季",
      icon: Sun,
      color: "#f94144",
    };
  } else if (month >= 8 && month <= 10) {
    return {
      text: "秋季",
      icon: Leaf,
      color: "#f9844a",
    };
  } else {
    return {
      text: "冬季",
      icon: Snowflake,
      color: "#4d96ff",
    };
  }
});

const seasonText = computed(() => seasonInfo.value.text);
const seasonIcon = computed(() => seasonInfo.value.icon);

// Calendar data
const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

const calendarMonthName = computed(() => {
  const date = new Date(calendarYear.value, calendarMonth.value, 1);
  const options = { month: "long" };
  return date.toLocaleDateString("zh-CN", options);
});

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1);
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0);

  // Get the day of the week for the first day (0-6)
  const firstDayOfWeek = firstDay.getDay();

  // Add days from previous month
  const prevMonthLastDay = new Date(
    calendarYear.value,
    calendarMonth.value,
    0
  ).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      currentMonth: false,
      isToday: false,
    });
  }

  // Add days from current month
  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === calendarMonth.value &&
    today.getFullYear() === calendarYear.value;

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      day: i,
      currentMonth: true,
      isToday: isCurrentMonth && i === today.getDate(),
    });
  }

  // Add days from next month
  const remainingDays = 42 - days.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      currentMonth: false,
      isToday: false,
    });
  }

  return days;
});

// Computed properties for digital clock
const formattedTime = computed(() => {
  const hours = currentTime.value.getHours().toString().padStart(2, "0");
  const minutes = currentTime.value.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
});

const seconds = computed(() => {
  return currentTime.value.getSeconds().toString().padStart(2, "0");
});

// Computed properties for analog clock
const hourHandStyle = computed(() => {
  const hours = currentTime.value.getHours() % 12;
  const minutes = currentTime.value.getMinutes();
  const rotation = 30 * hours + minutes / 2;
  return { transform: `rotate(${rotation}deg)` };
});

const minuteHandStyle = computed(() => {
  const minutes = currentTime.value.getMinutes();
  const rotation = 6 * minutes;
  return { transform: `rotate(${rotation}deg)` };
});

const secondHandStyle = computed(() => {
  const seconds = currentTime.value.getSeconds();
  const rotation = 6 * seconds;
  return { transform: `rotate(${rotation}deg)` };
});

// Function for hour marks positioning
const hourMarkStyle = (hour) => {
  const rotation = 30 * hour;
  return { transform: `rotate(${rotation}deg)` };
};
</script>

<style scoped>
/* Container */
.date-time-container {
  --transition-speed: 0.4s;
  --border-radius: 1.5rem;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);

  --accent-color: v-bind(seasonInfo.color);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  max-width: 450px;
  margin: 0 auto;
  transition: all var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.date-time-container.calendar-expanded {
  max-width: 500px;
}

/* Calendar Display */
.calendar-display {
  width: 100%;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.calendar-display:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.calendar-display:active {
  transform: translateY(0);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background-color: var(--accent-color);
  color: white;
}

.calendar-month {
  font-size: 1.2rem;
  font-weight: 600;
}

.calendar-year {
  font-size: 1rem;
}

.calendar-body {
  display: flex;
  padding: 1.5rem;
  align-items: center;
}

.calendar-day-number {
  font-size: 3.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-right: 1.5rem;
  position: relative;
  min-width: 60px;
  text-align: center;
}

.calendar-day-number::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--accent-color);
  border-radius: 2px;
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.calendar-display:hover .calendar-day-number::after {
  transform: scaleX(1);
}

.calendar-day-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.calendar-weekday {
  font-size: 1.2rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.3rem;
}

.calendar-season {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.season-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.4rem;
  color: var(--accent-color);
}

.calendar-footer {
  padding: 0.8rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
}

.calendar-hint {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
}

.hint-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.4rem;
  transition: transform 0.3s ease;
}

.rotate-icon {
  transform: rotate(180deg);
}

/* Month Calendar */
.month-calendar {
  width: 100%;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.month-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.month-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
}

.month-nav-btn {
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  color: #666;
  transition: background-color 0.2s ease;
}

.month-nav-btn:hover {
  background-color: #eee;
  color: #333;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0.5rem;
  background-color: #f9f9f9;
}

.weekday {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  padding: 0.5rem 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  padding: 0.5rem;
}

.day-cell {
  text-align: center;
  padding: 0.6rem 0;
  font-size: 0.9rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px auto;
  transition: all 0.2s ease;
}

.day-cell.current-month {
  color: #333;
}

.day-cell.other-month {
  color: #ccc;
}

.day-cell.today {
  background-color: var(--accent-color);
  color: white;
  font-weight: 600;
}

.day-cell.current-month:not(.today):hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

/* Greeting */
.greeting {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
  animation: fadeInUp 0.5s ease;
}

/* Clock Toggle */
.clock-toggle {
  display: flex;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.clock-toggle button {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  border-radius: 0.8rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: #555;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.toggle-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

.clock-toggle button.active {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.clock-toggle button.active .toggle-icon {
  color: white;
}

.clock-toggle button:hover:not(.active) {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

/* Analog Clock */
.analog-clock {
  position: relative;
  width: 220px;
  height: 220px;
  animation: fadeIn 0.5s ease;
}

.clock-face {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 0 0 0 10px rgba(255, 255, 255, 0.8),
    0 0 0 11px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease;
}

.analog-clock:hover .clock-face {
  transform: scale(1.05);
}

.hour-marks {
  position: absolute;
  width: 100%;
  height: 100%;
}

.hour-mark {
  position: absolute;
  width: 2px;
  height: 10px;
  background-color: #333;
  left: 50%;
  top: 5px;
  transform-origin: 1px 105px;
}

.hand {
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform-origin: 50% 100%;
  background-color: #333;
  transition: transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44);
}

.hour-hand {
  width: 6px;
  height: 60px;
  margin-left: -3px;
  border-radius: 3px;
  background-color: #333;
}

.minute-hand {
  width: 4px;
  height: 80px;
  margin-left: -2px;
  border-radius: 2px;
  background-color: #555;
}

.second-hand {
  width: 2px;
  height: 90px;
  margin-left: -1px;
  border-radius: 1px;
  background-color: var(--accent-color);
}

.center-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: var(--accent-color);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Digital Clock */
.digital-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 220px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.5s ease;
}

.digital-clock::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: var(--accent-color);
}

.time {
  font-size: 3.8rem;
  font-weight: 700;
  color: #333;
  font-family: "Courier New", monospace;
  letter-spacing: 2px;
  position: relative;
}

.time::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #eee;
}

.seconds-container {
  margin-top: 1.5rem;
}

.seconds {
  font-size: 2.2rem;
  color: var(--accent-color);
  font-weight: 700;
  font-family: "Courier New", monospace;
  animation: pulse 1s infinite;
}

/* Animations */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  opacity: 1;
  margin-bottom: 1.5rem;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 480px) {
  .date-time-container {
    padding: 1.5rem;
  }

  .calendar-body {
    padding: 1rem;
  }

  .calendar-day-number {
    font-size: 3rem;
  }

  .analog-clock,
  .digital-clock {
    width: 180px;
    height: 180px;
  }

  .hour-mark {
    transform-origin: 1px 85px;
  }

  .hour-hand {
    height: 50px;
  }

  .minute-hand {
    height: 65px;
  }

  .second-hand {
    height: 75px;
  }

  .time {
    font-size: 3rem;
  }

  .seconds {
    font-size: 1.8rem;
  }

  .day-cell {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}
</style>
