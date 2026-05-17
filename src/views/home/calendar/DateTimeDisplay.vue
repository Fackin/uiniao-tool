<template>
    <div class="date-time-container">
      <!-- Date Display -->
      <div class="date-display">
        <div class="date">{{ formattedDate }}</div>
        <div class="day">{{ dayOfWeek }}</div>
      </div>
      
      <!-- Clock Toggle -->
      <div class="clock-toggle">
        <button 
          @click="clockType = 'analog'" 
          :class="{ active: clockType === 'analog' }"
        >
          Analog
        </button>
        <button 
          @click="clockType = 'digital'" 
          :class="{ active: clockType === 'digital' }"
        >
          Digital
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
        <div class="seconds">{{ seconds }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
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
  
  // Computed properties for date
  const formattedDate = computed(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return currentTime.value.toLocaleDateString('zh-CN', options);
  });
  
  const dayOfWeek = computed(() => {
    const options = { weekday: 'long' };
    return currentTime.value.toLocaleDateString('zh-CN', options);
  });
  
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
    background-color: #f8f9fa;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
  }
  
  /* Date Display */
  .date-display {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .date {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
  }
  
  .day {
    font-size: 1.2rem;
    color: #666;
    margin-top: 0.3rem;
  }
  
  /* Clock Toggle */
  .clock-toggle {
    display: flex;
    margin-bottom: 1.5rem;
  }
  
  .clock-toggle button {
    background: none;
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .clock-toggle button.active {
    background-color: #4a6fa5;
    color: white;
    border-color: #4a6fa5;
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
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
    background-color: #e74c3c;
  }
  
  .center-dot {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #e74c3c;
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
  }
  
  .time {
    font-size: 3.5rem;
    font-weight: 700;
    color: #333;
    font-family: 'Courier New', monospace;
  }
  
  .seconds {
    font-size: 2rem;
    color: #e74c3c;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    margin-top: 0.5rem;
  }
  
  @media (max-width: 480px) {
    .date-time-container {
      padding: 1.5rem;
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
      font-size: 2.8rem;
    }
    
    .seconds {
      font-size: 1.6rem;
    }
  }
  </style>