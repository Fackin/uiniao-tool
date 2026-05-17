<!-- https://mdn.github.io/dom-examples/picture-in-picture/assets/bigbuckbunny.mp4 -->
<template>
  <div ref="videoContainer" class="video-container">
    <video
      ref="videoElement"
      controls
      @enterpictureinpicture="onEnterPip"
      @leavepictureinpicture="onLeavePip"
    >
      <source
        src="https://mdn.github.io/dom-examples/picture-in-picture/assets/bigbuckbunny.mp4"
        type="video/mp4"
      />
    </video>

    <!-- <un-button v-if="pipSupported" @click="togglePip" :disabled="!pipAvailable">
      {{ isInPip ? "退出画中画" : "进入画中画" }}
    </un-button> -->

    <div v-if="!pipSupported" class="unsupported-message">
      您的浏览器不支持画中画功能
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const videoElement = ref(null);
const videoContainer = ref(null);
const isInPip = ref(false);
const observer = ref(null);
const pipSupported = ref(false);
const pipAvailable = ref(false);
const userInitiatedPip = ref(false); // 标记是否用户主动触发
const autoPipLock = ref(false); // 防止自动触发过于频繁

// 检测画中画支持情况
const checkPipSupport = () => {
  return (
    "pictureInPictureEnabled" in document &&
    "requestPictureInPicture" in HTMLVideoElement.prototype
  );
};

// 检测画中画是否可用
const checkPipAvailability = async () => {
  try {
    pipAvailable.value =
      document.pictureInPictureEnabled &&
      !videoElement.value.disablePictureInPicture;
  } catch (e) {
    pipAvailable.value = false;
    console.error("检测画中画可用性失败:", e);
  }
};

// 切换画中画（用户主动触发）
const togglePip = async () => {
  if (!pipAvailable.value) return;

  userInitiatedPip.value = true; // 标记为用户主动操作

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await videoElement.value.requestPictureInPicture();
    }
  } catch (error) {
    console.error("画中画操作错误:", error);
    showPipError(error);
  } finally {
    // 用户操作后，暂时锁定自动触发
    autoPipLock.value = true;
    setTimeout(() => {
      autoPipLock.value = false;
    }, 5000); // 5秒内不自动触发
  }
};

// 进入画中画回调
const onEnterPip = () => {
  isInPip.value = true;
  console.log("进入画中画模式");
};

// 离开画中画回调
const onLeavePip = () => {
  isInPip.value = false;
  console.log("退出画中画模式");

  // 如果是自动触发的画中画关闭，检查是否需要重新进入
  if (!userInitiatedPip.value && pipAvailable.value) {
    checkVisibility();
  }

  userInitiatedPip.value = false;
};

// 显示画中画错误
const showPipError = (error) => {
  console.error("画中画错误:", error.message);

  let message = "画中画操作失败";
  if (error.message.includes("user gesture")) {
    message = "画中画需要用户手势触发（如点击操作）";
  } else if (error.message.includes("not allowed")) {
    message = "画中画功能被拒绝或不可用";
  }

  alert(message);
};

// 检查元素是否在可视区域内（自动触发逻辑）
const checkVisibility = () => {
  if (
    !pipAvailable.value ||
    !videoElement.value ||
    isInPip.value ||
    autoPipLock.value
  )
    return;

  const rect = videoContainer.value.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;

  // 计算可见面积比例
  const visibleWidth =
    Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
  const visibleHeight =
    Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  const visibleArea = visibleWidth * visibleHeight;
  const totalArea = rect.width * rect.height;
  const visibilityRatio = totalArea > 0 ? visibleArea / totalArea : 0;

  // 当可见面积小于50%时触发自动画中画
  if (visibilityRatio < 0.5) {
    videoElement.value.requestPictureInPicture().catch((e) => {
      console.log("自动进入画中画失败:", e);
    });
  } else if (
    document.pictureInPictureElement === videoElement.value &&
    !userInitiatedPip.value
  ) {
    // 只有当不是用户主动触发时才自动退出
    document.exitPictureInPicture().catch((e) => {
      console.log("自动退出画中画失败:", e);
    });
  }
};

// 初始化IntersectionObserver
const initObserver = () => {
  if (!pipAvailable.value) return;

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 只有当不是用户主动操作时才处理自动逻辑
        if (!userInitiatedPip.value && !autoPipLock.value) {
          if (!entry.isIntersecting && !isInPip.value) {
            // 不在视口内且不在画中画模式，尝试进入画中画
            videoElement.value.requestPictureInPicture().catch((e) => {
              console.log("自动进入画中画失败:", e);
            });
          } else if (
            entry.isIntersecting &&
            document.pictureInPictureElement === videoElement.value &&
            !userInitiatedPip.value
          ) {
            // 回到视口内且当前是画中画，且不是用户主动触发，尝试退出
            document.exitPictureInPicture().catch((e) => {
              console.log("自动退出画中画失败:", e);
            });
          }
        }
      });
    },
    {
      threshold: 0.5, // 50%可见性阈值
    }
  );

  if (videoContainer.value) {
    observer.value.observe(videoContainer.value);
  }
};

onMounted(async () => {
  pipSupported.value = checkPipSupport();

  if (pipSupported.value) {
    await checkPipAvailability();
    initObserver();

    // 添加滚动和调整大小事件监听器（防抖处理）
    const debouncedCheck = debounce(checkVisibility, 200);
    window.addEventListener("scroll", debouncedCheck);
    window.addEventListener("resize", debouncedCheck);

    // 监听画中画事件
    videoElement.value.addEventListener("enterpictureinpicture", onEnterPip);
    videoElement.value.addEventListener("leavepictureinpicture", onLeavePip);
  }
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }

  window.removeEventListener("scroll", checkVisibility);
  window.removeEventListener("resize", checkVisibility);

  if (videoElement.value) {
    videoElement.value.removeEventListener("enterpictureinpicture", onEnterPip);
    videoElement.value.removeEventListener("leavepictureinpicture", onLeavePip);
  }
});

// 防抖函数
function debounce(fn, delay) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
</script>

<style>
/* 样式保持不变 */
.video-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

video {
  width: 100%;
  display: block;
  background: #000;
}

/* button {
    margin-top: 10px;
    padding: 8px 16px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
   */
.unsupported-message {
  margin-top: 10px;
  padding: 10px;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
}
</style>
