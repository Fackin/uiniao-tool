<template>
  <div class="flex gap-2 p-4">
    <div class="">
      <un-uploader @afterUpload="handleAfterUpload"></un-uploader>
      <canvas ref="canvasRef" class="canvas" style="display: none"></canvas>
    </div>
    <div v-if="svgData" class="svg-box">
      <div
        v-html="svgData"
        ref="svgContainerRef"
        class="svg-container"
        @click="selectSVGElement"
      ></div>

      <div v-if="selectedElement" class="editor">
        <label>
          填充颜色:
          <input type="color" v-model="fillColor" @input="updateFillColor" />
        </label>
        <button @click="setCurrentColor">设为 currentColor</button>
      </div>
      <button v-if="svgData" @click="() => downloadSVG(svgContainerRef)">
        下载 SVG
      </button>
    </div>
    <div v-if="mySvg1" class="svg-box">
      <div
        v-html="mySvg1"
        ref="svg1ContainerRef"
        class="svg-container"
        @click="selectSVGElement"
      ></div>

      <div v-if="selectedElement" class="editor">
        <label>
          填充颜色:
          <input type="color" v-model="fillColor" @input="updateFillColor" />
        </label>
        <button @click="setCurrentColor">设为 currentColor</button>
      </div>
      <button v-if="mySvg1" @click="() => downloadSVG(svg1ContainerRef)">
        下载 SVG
      </button>
    </div>
    <div class="controls" v-if="false">
      <label>
        阈值: <input type="range" min="0" max="255" v-model="threshold" />
        {{ threshold }}
      </label>
      <label> 过滤小对象: <input type="number" v-model="turdSize" /> </label>
      <label>
        平滑度: <input type="number" step="0.1" v-model="optTolerance" />
      </label>
      <label> <input type="checkbox" v-model="optCurve" /> 优化曲线 </label>
      <label>
        滤镜:
        <select v-model="selectedFilter" @change="applyFilter">
          <option value="none">无</option>
          <option value="grayscale">灰度</option>
          <option value="sepia">复古</option>
          <option value="invert">反色</option>
          <option value="brightness">增加亮度</option>
          <option value="contrast">增加对比度</option>
        </select>
      </label>
      <button @click="convertToSVG">转换 SVG</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { trace } from "potrace";
import { rgbToHex } from "@/utils";
import { potrace, init } from "esm-potrace-wasm";

const canvasRef = ref(null);
const showCanvas = ref(false);
const svgData = ref(null);
const selectedElement = ref(null);
const fillColor = ref("#000000");
const originalStroke = ref(null);

const threshold = ref(128);
const turdSize = ref(2);
const optCurve = ref(true);
const optTolerance = ref(0.2);
const selectedFilter = ref("none");

const mySvg1 = ref(null);

const svgContainerRef = ref(null)
const svg1ContainerRef = ref(null)

const handleAfterUpload = async (img) => {
  drawToCanvas(img);
  convertToSVG();
  mySvg1.value = await potrace(img, {
    turdsize: 2,
    turnpolicy: 4,
    alphamax: 1,
    opticurve: 1,
    opttolerance: 0.2,
    pathonly: false,
    extractcolors: true,
    posterizelevel: 2, // [1, 255]
    posterizationalgorithm: 0, // 0: simple, 1: interpolation
  });
};

const drawToCanvas = (img) => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  applyFilter();
  showCanvas.value = true;
};

const applyFilter = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  switch (selectedFilter.value) {
    case "grayscale":
      ctx.filter = "grayscale(100%)";
      break;
    case "sepia":
      ctx.filter = "sepia(100%)";
      break;
    case "invert":
      ctx.filter = "invert(100%)";
      break;
    case "brightness":
      ctx.filter = "brightness(150%)";
      break;
    case "contrast":
      ctx.filter = "contrast(200%)";
      break;
    default:
      ctx.filter = "none";
  }
  ctx.drawImage(canvas, 0, 0);
};

const convertToSVG = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  trace(
    imageData,
    {
      threshold: threshold.value,
      turdSize: turdSize.value,
      optCurve: optCurve.value,
      optTolerance: optTolerance.value,
    },
    (err, svg) => {
      if (!err) {
        svgData.value = svg;
      }
    }
  );
};

const selectSVGElement = (event) => {
  console.log(selectedElement.value, "1111", originalStroke.value);
  if (selectedElement.value) {
    selectedElement.value.setAttribute("stroke", originalStroke.value);
  }
  if (event.target.tagName === "path") {
    selectedElement.value = event.target;

    console.log(event.target, event.target.getAttribute("fill"), "2222");
    fillColor.value = event.target.getAttribute("fill") || "#000000";

    originalStroke.value = event.target.getAttribute("stroke") || "none";
    event.target.setAttribute("stroke", "red");
    event.target.setAttribute("stroke-width", "2");
  } else {
    selectedElement.value = null;
  }
};

const updateFillColor = () => {
  if (selectedElement.value) {
    selectedElement.value.setAttribute("fill", fillColor.value);
  }
};

const setCurrentColor = () => {
  if (selectedElement.value) {
    selectedElement.value.setAttribute("fill", "currentColor");
  }
};

const downloadSVG = (svgRef) => {
  if (!svgRef) return alert("没有可下载的 SVG 内容");

  console.log(svgRef.value, 'svgRef.value')

  const svgElement = svgRef.querySelector("svg");
  if (!svgElement) return alert("SVG 生成错误");
  const serializer = new XMLSerializer();
  const svg = serializer.serializeToString(svgElement);

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "converted-image.svg";
  link.click();
  URL.revokeObjectURL(link.href);
};

onMounted(() => {
  init();
});
</script>

<style scoped>
/* .image-converter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
} */
.canvas {
  border: 1px solid #ddd;
  max-width: 100%;
}
.svg-box {
  width: 300px;
  border: 1px solid #ddd;
}
.svg-container {
  /* width: 300px; */
  max-height: 500px;
  /* overflow: auto; */
  /* border: 1px solid #ddd; */
  cursor: pointer;
}
:deep(.svg-container svg) {
  width: 200px;
  height: 200px;
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}
.editor {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #0056b3;
}
</style>
