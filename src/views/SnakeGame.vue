<script setup lang="ts">
import { ref, onMounted } from "vue";

// 坐标类型定义
interface Grid {
  x: number;
  y: number;
}

interface Snake {
  body: Array<Grid>;
  direction: string;
  nextDirection: string;
}

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const gridSize = ref(20);
const tileSize = ref();
const snake = ref<Snake>({
  body: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ],
  direction: "right",
  nextDirection: "right",
});
const food = ref();
const score = ref(0);
const gameOver = ref(false);
const intervalId = ref<number | undefined>(undefined);
const isPaused = ref(false);

// 添加触摸相关的变量
const touchStart = ref({ x: 0, y: 0 });
const touchThreshold = 30; // 触摸灵敏度阈值

// 检测是否为移动设备
const isMobile = ref(false);

const initGame = () => {
  // 游戏初始化逻辑
  console.log("canvas11111");
  if (canvas.value) {
    console.log("canvas", canvas.value);
    ctx.value = canvas.value.getContext("2d");
    tileSize.value = canvas.value?.width / gridSize.value;

    initSnake();
    food.value = generateFood();
    score.value = 0;
    gameOver.value = false;
    intervalId.value = undefined;
  }
};

const initSnake = () => {
  // 蛇的初始化逻辑
  if (!snake.value) return;
  console.log("canvas", canvas.value);
  snake.value.body = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  snake.value.direction = "right";
  snake.value.nextDirection = "right";
};

const generateFood = () => {
  const food = {
    x: Math.floor(Math.random() * gridSize.value),
    y: Math.floor(Math.random() * gridSize.value),
  };

  if (snake.value) {
    // 确保食物不会生成在蛇身上
    for (const segment of snake.value.body) {
      if (food.x === segment.x && food.y === segment.y) {
        return generateFood();
      }
    }
  }
  return food;
};

const snakeChangeDirection = (newDirection: string) => {
  const opposites: { [key: string]: string } = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };

  if (snake.value) {
    if (opposites[snake.value.direction] !== newDirection) {
      snake.value.nextDirection = newDirection;
    }
  }
};
const snakeMove = (food: Grid) => {
  if (!snake.value) return;
  const head = { ...snake.value.body[0] };

  switch (snake.value.direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.value.body.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    return true;
  }

  snake.value.body.pop();
  return false;
};

const snakeUpdate = () => {
  if (!snake.value) return;
  snake.value.direction = snake.value.nextDirection;
};

const snakeCheckCollision = (gridSize: number) => {
  if (!snake.value) return;
  const head = snake.value.body[0];
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return true;
  }

  for (let i = 1; i < snake.value.body.length; i++) {
    if (head.x === snake.value.body[i].x && head.y === snake.value.body[i].y) {
      return true;
    }
  }
  return false;
};

const handleKeyPress = (event: KeyboardEvent) => {
  const keyMap: { [key: string]: string } = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right",
  };

  // 处理空格键暂停
  if (event.code === "Space") {
    isPaused.value = !isPaused.value;
    if (!isPaused.value && !gameOver.value) {
      gameStart();
    } else {
      clearInterval(intervalId.value);
    }
    return;
  }

  const newDirection = keyMap[event.key];
  if (newDirection) {
    snakeChangeDirection(newDirection);
  }
};

const gameUpdate = () => {
  if (gameOver.value || isPaused.value) return;

  snakeUpdate();
  const ateFood = snakeMove(food.value);

  if (ateFood) {
    score.value += 10;
    food.value = generateFood();
  }

  if (snakeCheckCollision(gridSize.value)) {
    endGame();
  }
};

const gameDraw = () => {
  if (!canvas.value || !ctx.value || !snake.value) return;
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // 绘制网格背景
  ctx.value.fillStyle = '#1a1a1a';
  for (let i = 0; i < gridSize.value; i++) {
    for (let j = 0; j < gridSize.value; j++) {
      if ((i + j) % 2 === 0) {
        ctx.value.fillRect(
          i * tileSize.value,
          j * tileSize.value,
          tileSize.value,
          tileSize.value
        );
      }
    }
  }

  // 绘制食物 - 像素化苹果样式
  ctx.value.fillStyle = '#ff0000';
  ctx.value.fillRect(
    food.value.x * tileSize.value + 2,
    food.value.y * tileSize.value + 2,
    tileSize.value - 4,
    tileSize.value - 4
  );
  
  // 绘制蛇 - 像素化效果
  snake.value.body.forEach((segment, index) => {
    if (ctx.value) {
      // 蛇头使用深色，身体使用浅色
      ctx.value.fillStyle = index === 0 ? '#4eff4e' : '#7fff7f';
      // 每个蛇身段留出1像素边框，增加像素感
      ctx.value.fillRect(
        segment.x * tileSize.value + 1,
        segment.y * tileSize.value + 1,
        tileSize.value - 2,
        tileSize.value - 2
      );
    }
  });
};

const endGame = () => {
  gameOver.value = true;
  clearInterval(intervalId.value);
};

const restart = () => {
  initSnake();
  food.value = generateFood();
  score.value = 0;
  gameOver.value = false;
  gameStart();
};

const gameStart = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
  intervalId.value = setInterval(() => {
    gameUpdate();
    gameDraw();
  }, 150);
};

// 添加触摸事件处理函数
const handleTouchStart = (event: TouchEvent) => {
  touchStart.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };
};

const handleTouchEnd = (event: TouchEvent) => {
  const touchEnd = {
    x: event.changedTouches[0].clientX,
    y: event.changedTouches[0].clientY,
  };

  const dx = touchEnd.x - touchStart.value.x;
  const dy = touchEnd.y - touchStart.value.y;

  // 判断是否为点击（轻触）
  if (Math.abs(dx) < touchThreshold && Math.abs(dy) < touchThreshold) {
    // 轻触实现暂停功能
    isPaused.value = !isPaused.value;
    if (!isPaused.value && !gameOver.value) {
      gameStart();
    } else {
      clearInterval(intervalId.value);
    }
    return;
  }

  // 判断滑动方向
  if (Math.abs(dx) > Math.abs(dy)) {
    // 水平方向
    snakeChangeDirection(dx > 0 ? "right" : "left");
  } else {
    // 垂直方向
    snakeChangeDirection(dy > 0 ? "down" : "up");
  }
};

onMounted(() => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  initGame();

  // 同时支持键盘和触摸事件
  document.addEventListener("keydown", handleKeyPress);
  canvas.value?.addEventListener("touchstart", handleTouchStart);
  canvas.value?.addEventListener("touchend", handleTouchEnd);

  // 阻止移动端浏览器的默认滚动行为
  canvas.value?.addEventListener("touchmove", (e) => e.preventDefault(), {
    passive: false,
  });

  gameStart();
});
</script>

<template>
  <div class="snake-game pixel-bg">
    <div id="score" class="pixel-text">分数: {{ score }}</div>
    <div id="gameContainer">
      <canvas id="gameCanvas" ref="canvas" width="400" height="400"></canvas>
      <div id="pauseOverlay" v-if="isPaused && !gameOver" class="pixel-overlay">
        <h2 class="pixel-text">PAUSE</h2>
        <p class="pixel-text">按空格继续</p>
      </div>
      <div id="gameOver" v-if="gameOver" class="pixel-overlay">
        <h2 class="pixel-text">GAME OVER!</h2>
        <p class="pixel-text">
          得分: <span id="finalScore">{{ score }}</span>
        </p>
        <button id="restartButton" class="pixel-button" @click="restart">重新开始</button>
      </div>
    </div>
    <div class="mobile-tips pixel-text" v-if="isMobile">
      <p>滑动控制方向</p>
      <p>轻触暂停/继续</p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.snake-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  background-color: #2c3e50;
  font-family: 'Press Start 2P', cursive;
  image-rendering: pixelated;
}

.pixel-bg {
  background: linear-gradient(45deg, #2c3e50 25%, #34495e 25%, #34495e 50%, #2c3e50 50%, #2c3e50 75%, #34495e 75%, #34495e);
  background-size: 20px 20px;
}

.pixel-text {
  color: #fff;
  text-shadow: 2px 2px 0 #000;
  letter-spacing: 1px;
}

#gameContainer {
  position: relative;
  padding: 10px;
  background: #000;
  border: 4px solid #fff;
  box-shadow: 0 0 0 4px #000;
  image-rendering: pixelated;
}

#gameCanvas {
  border: none;
  background-color: #263238;
  image-rendering: pixelated;
}

#score {
  font-size: 20px;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #000;
  border: 4px solid #fff;
  box-shadow: 0 0 0 4px #000;
}

.pixel-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.9);
  border: 4px solid #fff;
  padding: 20px;
  text-align: center;
}

.pixel-button {
  font-family: 'Press Start 2P', cursive;
  background-color: #4eff4e;
  border: none;
  color: #000;
  padding: 15px 25px;
  margin-top: 15px;
  cursor: pointer;
  text-transform: uppercase;
  border: 4px solid #fff;
  box-shadow: 0 0 0 4px #000;
  transition: all 0.2s;
}

.pixel-button:hover {
  background-color: #7fff7f;
  transform: scale(1.05);
}

.mobile-tips {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  background: #000;
  padding: 10px;
  border: 4px solid #fff;
  box-shadow: 0 0 0 4px #000;
}

@media (max-width: 480px) {
  #gameCanvas {
    width: 100%;
    max-width: 350px;
    height: auto;
  }

  .snake-game {
    padding: 10px;
  }

  #score {
    font-size: 16px;
  }

  .pixel-overlay {
    width: 80%;
    font-size: 14px;
  }

  .mobile-tips {
    font-size: 10px;
  }
}

/* 添加像素化动画效果 */
@keyframes pixelPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

#score {
  animation: pixelPulse 2s infinite;
}
</style>
