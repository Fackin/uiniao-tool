<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const videoRef = ref(null);
const canvasRef = ref(null);
const timer = ref(null);

const props = defineProps({
  paused: Boolean,
});

const emit = defineEmits(["color"]);

onMounted(() => {
  startCamera();

  timer.value = setInterval(() => {
    if (!props.paused) {
        emit("color", getColor());
    }
  }, 327);
});

const startCamera = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 4096 },
          height: { ideal: 2160 },
        },
      })
      .then((stream) => {
        const video = videoRef.value;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("navigator.mediaDevices.getUserMedia error: ", err);
      });
  }
};

const getColor = () => {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");
  canvas.width = 414;
  canvas.height = 736;
  context.drawImage(video, 0, 0, 414, 736);
  const imageData = context.getImageData(
    canvas.width / 2,
    canvas.height / 2,
    1,
    1
  );
  const rgb = {
    r: imageData.data[0],
    g: imageData.data[1],
    b: imageData.data[2],
  };
  // console.log("rgb", rgb);
  return rgb;
};

onBeforeUnmount(() => {
  timer.value && clearInterval(timer.value);
});
</script>

<template>
  <div>
    <canvas ref="canvasRef" class="canvas-wrap"></canvas>
    <!-- <img src="/images/camera.png" alt="camera" /> -->
    <video ref="videoRef" class="video-wrap"></video>
  </div>
</template>

<style scoped>
.canvas-wrap {
  width: 384px;
  height: 384px;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}
.video-wrap {
  width: 384px;
  height: 384px;
  border-radius: 24px;
  object-fit: cover;
  object-position: 50% 50%;
  /* object-position: center; */
}
</style>
