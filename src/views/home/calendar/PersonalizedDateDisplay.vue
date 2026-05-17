<template>
    <div class="date-time-container">
      <!-- Enhanced Date Display -->
      <div class="date-display">
        <div class="greeting">{{ greeting }}</div>
        
        <div class="calendar">
          <div class="calendar-month">{{ monthName }}</div>
          <div class="calendar-day">{{ dayNumber }}</div>
          <div class="calendar-info">
            <div class="calendar-year">{{ year }}年</div>
            <div class="calendar-weekday">{{ dayOfWeek }}</div>
          </div>
        </div>
        
        <div class="season-indicator">
          <div class="season-icon">
            <component :is="seasonIcon" />
          </div>
          <div class="season-text">{{ seasonText }}</div>
        </div>
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
      
      <!-- Analog Clock -->
      <div v-if="clockType === 'analog'" class="analog-clock">
        <div class="clock-face">
          <div class="hour-marks">
            <div v-for="n in 12" :key="n" class="hour-mark" :style="hourMarkStyle(n)"></div>
          </div>
          <div class="hand hour-hand" :style="hourHandStyle"></div>
          <div class="hand minute-hand" :style="minuteHandStyle"></div>
          <div class="hand second-hand" :style="secondHandStyle"></div>
          <div class="center-dot"></div>
        </div>
      </div>
      
      <!-- Digital Clock -->
      <div v-else class="digital-clock">
        <div class="time">{{ formattedTime }}</div>
        <div class="seconds-container">
          <span class="seconds-label">秒</span>
          <div class="seconds">{{ seconds }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { Clock, Timer, Sun, Cloud, Leaf, Snowflake } from 'lucide-vue-next';
  
  // State
  const currentTime = ref(new Date());
  const clockType = ref('analog'); // 'analog' or 'digital'
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
  
  // Greeting based on time of day
  const greeting = computed(() => {
    const hour = currentTime.value.getHours();
    if (hour < 6) return '夜深了，注意休息';
    if (hour < 9) return '早上好，开始新的一天';
    if (hour < 12) return '上午好，工作顺利';
    if (hour < 14) return '中午好，记得午休';
    if (hour < 18) return '下午好，继续加油';
    if (hour < 22) return '晚上好，放松一下';
    return '夜深了，注意休息';
  });
  
  // Computed properties for date
  const monthName = computed(() => {
    const options = { month: 'long' };
    return currentTime.value.toLocaleDateString('zh-CN', options);
  });
  
  const dayNumber = computed(() => {
    return currentTime.value.getDate();
  });
  
  const year = computed(() => {
    return currentTime.value.getFullYear();
  });
  
  const dayOfWeek = computed(() => {
    const options = { weekday: 'long' };
    return currentTime.value.toLocaleDateString('zh-CN', options);
  });
  
  // Season information
  const seasonInfo = computed(() => {
    const month = currentTime.value.getMonth();
    
    if (month >= 2 && month <= 4) {
      return { 
        text: '春季', 
        icon: Sun,
        color: '#76c893'
      };
    } else if (month >= 5 && month <= 7) {
      return { 
        text: '夏季', 
        icon: Sun,
        color: '#f94144'
      };
    } else if (month >= 8 && month <= 10) {
      return { 
        text: '秋季', 
        icon: Leaf,
        color: '#f9844a'
      };
    } else {
      return { 
        text: '冬季', 
        icon: Snowflake,
        color: '#4d96ff'
      };
    }
  });
  
  const seasonText = computed(() => seasonInfo.value.text);
  const seasonIcon = computed(() => seasonInfo.value.icon);
  
  // Computed properties for digital clock
  const formattedTime = computed(() => {
    const hours = currentTime.value.getHours().toString().padStart(2, '0');
    const minutes = currentTime.value.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });
  
  const seconds = computed(() => {
    return currentTime.value.getSeconds().toString().padStart(2, '0');
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
  .date-time-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    border-radius: 1.5rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
    max-width: 450px;
    margin: 0 auto;
    transition: all 0.3s ease;
  }
  
  .date-time-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06);
  }
  
  /* Enhanced Date Display */
  .date-display {
    width: 100%;
    margin-bottom: 2rem;
  }
  
  .greeting {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 500;
    letter-spacing: 1px;
  }
  
  .calendar {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 1.5rem;
  }
  
  .calendar-month {
    font-size: 1.4rem;
    font-weight: 600;
    color: #444;
    margin-right: 1rem;
  }
  
  .calendar-day {
    font-size: 3.5rem;
    font-weight: 700;
    color: v-bind('seasonInfo.color');
    line-height: 1;
    margin: 0 1.5rem;
    position: relative;
  }
  
  .calendar-day::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: v-bind('seasonInfo.color');
    border-radius: 2px;
  }
  
  .calendar-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .calendar-year {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 0.3rem;
  }
  
  .calendar-weekday {
    font-size: 1.2rem;
    font-weight: 600;
    color: #444;
  }
  
  .season-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .season-icon {
    color: v-bind('seasonInfo.color');
    margin-right: 0.5rem;
  }
  
  .season-text {
    font-size: 1rem;
    color: #666;
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
    background-color: v-bind('seasonInfo.color');
    color: white;
    border-color: v-bind('seasonInfo.color');
  }
  
  .clock-toggle button.active .toggle-icon {
    color: white;
  }
  
  /* Analog Clock */
  .analog-clock {
    position: relative;
    width: 220px;
    height: 220px;
  }
  
  .clock-face {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 
                0 0 0 10px rgba(255, 255, 255, 0.8),
                0 0 0 11px rgba(0, 0, 0, 0.1);
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
    background-color: v-bind('seasonInfo.color');
  }
  
  .center-dot {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: v-bind('seasonInfo.color');
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
  }
  
  .digital-clock::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: v-bind('seasonInfo.color');
  }
  
  .time {
    font-size: 3.8rem;
    font-weight: 700;
    color: #333;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
  }
  
  .seconds-container {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }
  
  .seconds-label {
    font-size: 1rem;
    color: #666;
    margin-right: 0.5rem;
  }
  
  .seconds {
    font-size: 2.2rem;
    color: v-bind('seasonInfo.color');
    font-weight: 700;
    font-family: 'Courier New', monospace;
  }
  
  @media (max-width: 480px) {
    .date-time-container {
      padding: 1.5rem;
    }
    
    .calendar {
      padding: 1rem;
    }
    
    .calendar-day {
      font-size: 3rem;
    }
    
    .analog-clock, .digital-clock {
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
  }
  </style>