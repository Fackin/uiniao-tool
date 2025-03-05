<template>
    <div class="dynasty-timeline-container">
      <h2 class="text-2xl font-bold mb-6 text-center">{{ title }}</h2>
      
      <!-- 时间线控制 -->
      <div class="mb-4 flex justify-end">
        <button @click="zoomIn" class="px-3 py-1 bg-gray-200 rounded mr-2 hover:bg-gray-300">
          <i-lucide-zoom-in class="w-5 h-5" />
        </button>
        <button @click="zoomOut" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          <i-lucide-zoom-out class="w-5 h-5" />
        </button>
      </div>
      
      <!-- 时间线容器 -->
      <div class="timeline-scroll-container overflow-x-auto min-h-[200px]">
        <div class="timeline-wrapper" :style="{ width: `${timelineWidth}px` }">
          <!-- 年份标记 -->
          <div class="year-markers relative h-8">
            <div 
              v-for="year in yearMarkers" 
              :key="year" 
              class="absolute text-xs text-gray-600"
              :style="{ left: `${getYearPosition(year)}px` }"
            >
              {{ formatYear(year) }}
              <div class="h-3 border-l border-gray-300 mx-auto"></div>
            </div>
          </div>
          
          <!-- 时间线 -->
          <div class="timeline-line h-1 bg-gray-300 mb-6"></div>
          
          <!-- 朝代块 -->
          <div class="dynasties-container relative">
            <div 
              v-for="(dynasty, index) in dynasties" 
              :key="dynasty.name"
              class="dynasty-block absolute rounded-md cursor-pointer transition-all duration-200 hover:shadow-lg"
              :class="{ 'selected': selectedDynasty === dynasty }"
              :style="{ 
                left: `${getYearPosition(dynasty.startYear)}px`,
                width: `${getDynastyWidth(dynasty)}px`,
                top: `${getDynastyRow(index) * 50}px`,
                backgroundColor: dynasty.color || getRandomColor(index)
              }"
              @click="selectDynasty(dynasty)"
            >
              <div class="dynasty-name p-2 text-white font-medium truncate">
                {{ dynasty.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 朝代详情 -->
      <div v-if="selectedDynasty" class="dynasty-details mt-8 p-4 border rounded-md bg-gray-50">
        <h3 class="text-xl font-bold mb-2">{{ selectedDynasty.name }}</h3>
        <p class="text-gray-700 mb-2">
          {{ formatYear(selectedDynasty.startYear) }} - {{ formatYear(selectedDynasty.endYear) }}
          ({{ selectedDynasty.endYear - selectedDynasty.startYear }} 年)
        </p>
        <p class="text-gray-600">{{ selectedDynasty.description }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 组件属性
  const props = defineProps({
    title: {
      type: String,
      default: '中国历史朝代时间线'
    },
    dynasties: {
      type: Array,
      default: () => [
        { 
          name: '夏朝', 
          startYear: -2070, 
          endYear: -1600,
          description: '中国第一个世袭制朝代，传说中由禹建立。',
          color: '#D32F2F'
        },
        { 
          name: '商朝', 
          startYear: -1600, 
          endYear: -1046,
          description: '中国历史上第一个有直接文字记载的朝代，青铜器文明高度发展。',
          color: '#C2185B'
        },
        { 
          name: '西周', 
          startYear: -1046, 
          endYear: -771,
          description: '周武王灭商建立，建立了完善的宗法制度和分封制度。',
          color: '#7B1FA2'
        },
        { 
          name: '东周', 
          startYear: -770, 
          endYear: -256,
          description: '包括春秋和战国时期，是中国历史上大变革的时代。',
          color: '#512DA8'
        },
        { 
          name: '秦朝', 
          startYear: -221, 
          endYear: -207,
          description: '中国历史上第一个统一的多民族的中央集权国家，由秦始皇建立。',
          color: '#303F9F'
        },
        { 
          name: '西汉', 
          startYear: -202, 
          endYear: 8,
          description: '由刘邦建立，是中国历史上强盛的朝代之一。',
          color: '#1976D2'
        },
        { 
          name: '东汉', 
          startYear: 25, 
          endYear: 220,
          description: '由光武帝刘秀建立，与西汉合称"汉朝"。',
          color: '#0288D1'
        },
        { 
          name: '三国', 
          startYear: 220, 
          endYear: 280,
          description: '魏、蜀、吴三国鼎立的时期，是中国历史上著名的军阀混战时期。',
          color: '#0097A7'
        },
        { 
          name: '西晋', 
          startYear: 265, 
          endYear: 316,
          description: '由司马炎建立，短暂统一了三国。',
          color: '#00796B'
        },
        { 
          name: '东晋', 
          startYear: 317, 
          endYear: 420,
          description: '西晋灭亡后，司马睿在建康建立的政权。',
          color: '#388E3C'
        },
        { 
          name: '南北朝', 
          startYear: 420, 
          endYear: 589,
          description: '中国南方和北方分别建立的多个朝代，是民族融合的重要时期。',
          color: '#689F38'
        },
        { 
          name: '隋朝', 
          startYear: 581, 
          endYear: 618,
          description: '由杨坚建立，结束了南北朝分裂局面，为唐朝的建立奠定了基础。',
          color: '#AFB42B'
        },
        { 
          name: '唐朝', 
          startYear: 618, 
          endYear: 907,
          description: '由李渊建立，是中国历史上最强盛的朝代之一，文化高度繁荣。',
          color: '#FBC02D'
        },
        { 
          name: '五代十国', 
          startYear: 907, 
          endYear: 979,
          description: '唐朝灭亡后，中国又进入了一个分裂割据的时代。',
          color: '#FFA000'
        },
        { 
          name: '北宋', 
          startYear: 960, 
          endYear: 1127,
          description: '由赵匡胤建立，经济文化高度发展。',
          color: '#F57C00'
        },
        { 
          name: '南宋', 
          startYear: 1127, 
          endYear: 1279,
          description: '北宋灭亡后，宋高宗赵构在南方建立的政权。',
          color: '#E64A19'
        },
        { 
          name: '元朝', 
          startYear: 1271, 
          endYear: 1368,
          description: '由蒙古族建立的统一王朝，是中国历史上第一个由少数民族建立的大一统王朝。',
          color: '#5D4037'
        },
        { 
          name: '明朝', 
          startYear: 1368, 
          endYear: 1644,
          description: '由朱元璋建立，是中国历史上最后一个由汉族建立的大一统王朝。',
          color: '#616161'
        },
        { 
          name: '清朝', 
          startYear: 1644, 
          endYear: 1911,
          description: '由满族建立的最后一个封建王朝，也是中国历史上疆域最辽阔的朝代。',
          color: '#455A64'
        }
      ]
    }
  });
  
  // 响应式状态
  const selectedDynasty = ref(null);
  const zoomLevel = ref(1);
  const timelineWidth = computed(() => Math.max(1000, getYearPosition(getMaxYear()) + 100));
  
  // 计算最早和最晚的年份
  const getMinYear = () => {
    return Math.min(...props.dynasties.map(d => d.startYear));
  };
  
  const getMaxYear = () => {
    return Math.max(...props.dynasties.map(d => d.endYear));
  };
  
  // 计算时间跨度
  const timeSpan = computed(() => getMaxYear() - getMinYear());
  
  // 生成年份标记
  const yearMarkers = computed(() => {
    const minYear = getMinYear();
    const maxYear = getMaxYear();
    const span = maxYear - minYear;
    
    // 根据时间跨度确定年份标记的间隔
    let interval;
    if (span > 3000) interval = 500;
    else if (span > 1000) interval = 200;
    else if (span > 500) interval = 100;
    else interval = 50;
    
    const markers = [];
    const startYear = Math.floor(minYear / interval) * interval;
    
    for (let year = startYear; year <= maxYear; year += interval) {
      markers.push(year);
    }
    
    return markers;
  });
  
  // 计算年份在时间线上的位置
  const getYearPosition = (year) => {
    const minYear = getMinYear();
    const totalWidth = (timelineWidth.value || 2000) * zoomLevel.value;
    return ((year - minYear) / timeSpan.value) * totalWidth;
  };
  
  // 计算朝代在时间线上的宽度
  const getDynastyWidth = (dynasty) => {
    const duration = dynasty.endYear - dynasty.startYear;
    return Math.max(100, (duration / timeSpan.value) * timelineWidth.value * zoomLevel.value);
  };
  
  // 确定朝代显示在哪一行（避免重叠）
  const getDynastyRow = (index) => {
    // 简单的行分配算法，可以根据需要优化
    return index % 3;
  };
  
  // 格式化年份显示
  const formatYear = (year) => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    } else {
      return `公元${year}年`;
    }
  };
  
  // 为朝代生成随机颜色（如果没有指定）
  const getRandomColor = (index) => {
    const colors = [
      '#D32F2F', '#C2185B', '#7B1FA2', '#512DA8', '#303F9F',
      '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C',
      '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00',
      '#E64A19', '#5D4037', '#616161', '#455A64'
    ];
    return colors[index % colors.length];
  };
  
  // 事件处理函数
  const selectDynasty = (dynasty) => {
    selectedDynasty.value = dynasty;
  };
  
  const zoomIn = () => {
    zoomLevel.value = Math.min(zoomLevel.value + 0.2, 3);
  };
  
  const zoomOut = () => {
    zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.5);
  };
  </script>
  
  <style scoped>
  .timeline-scroll-container {
    overflow-x: auto;
    padding-bottom: 1rem;
  }
  
  .dynasty-block {
    height: 40px;
    transition: all 0.3s ease;
  }
  
  .dynasty-block:hover {
    transform: translateY(-2px);
  }
  
  .dynasty-block.selected {
    box-shadow: 0 0 0 2px white, 0 0 0 4px #000;
    z-index: 10;
  }
  
  .dynasty-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>