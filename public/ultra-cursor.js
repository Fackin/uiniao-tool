class UltraCursor {
  constructor() {
    // 环境检测
    this.supportsTouch = "ontouchstart" in window;
    this.isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 不支持的场景直接返回
    if (this.supportsTouch || this.isReducedMotion || !this.checkPerformance())
      return;

    this.init();
  }

  // 性能检测
  checkPerformance() {
    // 基于设备内存和CPU核心数的简单启发式判断
    const isLowEnd =
      (navigator.hardwareConcurrency || 4) < 4 ||
      (navigator.deviceMemory || 4) < 2;
    return !isLowEnd;
  }

  init() {
    // 创建光标元素（使用SVG提高性能）
    this.cursor = document.createElement("div");
    this.cursor.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        </svg>
      `;
    this.cursor.className = "ultra-cursor";
    document.body.appendChild(this.cursor);

    // 注入优化后的CSS
    this.injectStyles();

    // 初始化状态
    this.pos = { x: -100, y: -100 };
    this.lastPos = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.rafId = null;
    this.frameCount = 0;

    // 设置事件监听
    this.setupEvents();
  }

  injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .ultra-cursor {
          position: fixed;
          width: 24px;
          height: 24px;
          pointer-events: none;
          z-index: 2147483647;
          transform: translate(-50%, -50%);
          color: white;
          mix-blend-mode: difference;
          will-change: transform;
          contain: strict;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.1s linear;
        }
        .ultra-cursor.visible {
          opacity: 1;
        }
        .ultra-cursor.hover {
          transform: translate(-50%, -50%) scale(1.8);
          color: cyan;
        }
        .ultra-cursor.active {
          transform: translate(-50%, -50%) scale(0.6);
          color: magenta;
        }
        .ultra-cursor svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        @media (hover: none), (pointer: coarse) {
          .ultra-cursor { display: none !important; }
        }
      `;
    document.head.appendChild(style);

    // 隐藏系统光标
    document.body.style.cursor = "none";
  }

  setupEvents() {
    // 使用指针事件提高兼容性
    document.addEventListener("pointermove", this.onMouseMove.bind(this));
    document.addEventListener("pointerdown", this.onMouseDown.bind(this));
    document.addEventListener("pointerup", this.onMouseUp.bind(this));

    // 页面可见性处理
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.cursor.classList.remove("visible");
      } else {
        this.cursor.classList.add("visible");
      }
    });

    // 初始显示
    setTimeout(() => {
      this.cursor.classList.add("visible");
    }, 100);

    // 智能休眠检测
    this.movementThreshold = 2;
    this.stationaryFrames = 0;
    this.activeUpdate = true;

    // 开始动画循环
    this.updateCursor();
  }

  onMouseMove(e) {
    this.lastPos = { ...this.pos };
    this.pos = { x: e.clientX, y: e.clientY };

    // 计算速度用于预测
    this.velocity = {
      x: this.pos.x - this.lastPos.x,
      y: this.pos.y - this.lastPos.y,
    };

    // 唤醒更新如果之前处于休眠
    if (!this.activeUpdate) {
      this.activeUpdate = true;
      this.updateCursor();
    }
  }

  onMouseDown() {
    this.cursor.classList.add("active");
    // 提高点击时的更新优先级
    this.frameCount = 0;
  }

  onMouseUp() {
    this.cursor.classList.remove("active");
  }

  updateCursor() {
    // 使用速度预测平滑移动
    const predictX = this.pos.x + this.velocity.x * 0.5;
    const predictY = this.pos.y + this.velocity.y * 0.5;

    // 应用变换
    this.cursor.style.transform = `translate(-50%, -50%) translate(${predictX}px, ${predictY}px)`;

    // 智能更新频率控制
    const movedDistance = Math.sqrt(
      Math.pow(this.pos.x - this.lastPos.x, 2) +
        Math.pow(this.pos.y - this.lastPos.y, 2)
    );

    if (movedDistance < this.movementThreshold) {
      this.stationaryFrames++;
    } else {
      this.stationaryFrames = 0;
    }

    // 动态调整更新频率
    this.frameCount++;
    let nextFrameDelay = 0;

    if (this.stationaryFrames > 30) {
      // 鼠标静止时大幅降低更新频率
      nextFrameDelay = 1000 / 10; // 10fps
      this.activeUpdate = false;
    } else if (this.stationaryFrames > 10) {
      // 鼠标微动时中等频率
      nextFrameDelay = 1000 / 30; // 30fps
    } else if (movedDistance > 20) {
      // 快速移动时最高频率
      nextFrameDelay = 1000 / 120; // 120fps
    } else {
      // 正常移动
      nextFrameDelay = 1000 / 60; // 60fps
    }

    // 使用最适合的动画API
    if (
      this.frameCount % 3 === 0 &&
      typeof requestIdleCallback !== "undefined"
    ) {
      requestIdleCallback(
        () => {
          this.rafId = requestAnimationFrame(this.updateCursor.bind(this));
        },
        { timeout: 100 }
      );
    } else {
      this.rafId = requestAnimationFrame(this.updateCursor.bind(this));
    }
  }

  // 清理资源
  destroy() {
    cancelAnimationFrame(this.rafId);
    document.body.style.cursor = "";
    this.cursor?.remove();
  }
}

// 智能初始化
document.addEventListener("DOMContentLoaded", () => {
  // 只在主文档中初始化，避免iframe中重复
  if (window === window.top) {
    window.__ULTRA_CURSOR = new UltraCursor();
  }
});

// 热模块替换的清理
if (import.meta && import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.__ULTRA_CURSOR?.destroy();
  });
}
