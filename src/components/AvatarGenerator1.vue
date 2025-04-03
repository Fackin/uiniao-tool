<template>
  <div class="container">
    <div class="options">
      <label>
        名称：
        <un-input
          v-model="name"
          placeholder="输入名称"
          themeColor="var(--color-primary)"
          style="width: 180px"
        />
      </label>
      <label>
        背景色：
        <un-select
          v-model="backColor"
          :options="backColorOptions"
          width="180"
          themeColor="var(--color-primary)"
        />
      </label>
      <label>
        头像大小：
        <un-select
          v-model="imgSize"
          :options="imgSizeOptions"
          width="180"
          themeColor="var(--color-primary)"
        />
      </label>
      <label>
        画笔大小：
        <un-select
          v-model="penSize"
          :options="penSizeOptions"
          width="180"
          themeColor="var(--color-primary)"
        />
      </label>
      <!-- <button @click="handleMake">make</button> -->
      <un-button @click="handleMake" themeColor="var(--color-primary)"
        >make</un-button
      >
    </div>
    <div>
      {{ hash(name) }}
    </div>
    <!-- <img :src="mySvg" style="border: 2px solid #666;" id="photo-img"> -->
    <canvas
      ref="myCanvas"
      id="myCanvas"
      width="100"
      height="100"
      style="display: none; border: 1px solid #d3d3d3"
    >
      Your browser does not support the HTML5 canvas tag.
    </canvas>
    <div v-html="mySvg"></div>

    <un-button @click="downloadAvatar" themeColor="var(--color-primary)"
      >下载头像</un-button
    >
  </div>
</template>

<script setup>
import "@/utils/canvas2svg.js";
import { ref, computed } from "vue";

const backColorOptions = [
  { value: "rmd", label: "随机" },
  { value: "transparent", label: "透明" },
  { value: "lightblue", label: "lightblu" },
  { value: "lightcoral", label: "lightcoral" },
  { value: "lightcyan", label: "lightcyan" },
  { value: "lightgoldenrodyellow", label: "lightgoldenrodyellow" },
  { value: "lightgreen", label: "lightgreen" },
  { value: "lightgrey", label: "lightgrey" },
  { value: "lightpink", label: "lightpink" },
  { value: "lightsalmon", label: "lightsalmon" },
  { value: "lightseagreen", label: "lightseagreen" },
  { value: "lightskyblue", label: "lightskyblue" },
  { value: "lightslategray", label: "lightslategray" },
  { value: "lightsteelblue", label: "lightsteelblue" },
  { value: "lightyellow", label: "lightyellow" },
];

const imgSizeOptions = [
  { value: "100", label: "100X100" },
  { value: "60", label: "60X60" },
  { value: "200", label: "200X200" },
  { value: "300", label: "300X300" },
  { value: "400", label: "400X400" },
  { value: "500", label: "500X500" },
];
const penSizeOptions = [
  { value: "10", label: "10X10" },
  { value: "20", label: "20X20" },
  { value: "30", label: "30X30" },
  { value: "40", label: "40X40" },
  { value: "50", label: "50X50" },
  { value: "60", label: "60X60" },
];

const name = ref("VueUser"); // 默认名称
const backColor = ref("rmd"); // 背景色
const imgSize = ref("100"); // 头像大小
const penSize = ref("10"); // 画笔大小

const myCanvas = ref();
const mySvg = ref();

const size = 100; // 头像大小

// 基于名称生成哈希
const hash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

// 计算头像颜色（基于名称哈希）
const avatarColor = computed(() => {
  return `hsl(${hash(name.value) % 360}, 70%, 60%)`;
});

//返回指定范围以内的整数 传入3返回 1 3 2
const getRemodInt = (alt) => {
  return Math.floor(Math.random() * alt) + 1;
};

const getRemodIntByPenSize = (alt, penSize) => {
  let rmd = 0;
  while (true) {
    rmd = Math.floor(Math.random() * alt);
    if (rmd % penSize === 0) {
      return rmd;
    }
  }
};

//从一个点a 拿到对称点
//带入imgwidth 与 penSize
// 100 / 2 = 50
const getSymmetry = (a, imgWidth, penSize) => {
  return imgWidth - a - penSize;
};

const handleMake = () => {
  // var img = document.getElementById("photo-img");
  // var bufferImg = document.getElementById("buffer-img");
  // var srcStr = img.src;
  // bufferImg.src = srcStr;

  // var args = arguments;
  const bColor = backColor.value
    ? backColor.value === "rmd"
      ? `rgb(${getRemodInt(255)}, ${getRemodInt(255)}, ${getRemodInt(255)})`
      : backColor.value
    : "transparent";
  const imgWidth = imgSize.value ? parseInt(new Number(imgSize.value)) : 100;
  const penWidth = penSize.value ? parseInt(new Number(penSize.value)) : 10;
  const penColor = avatarColor.value; // "rgb("+getRemodInt(255)+","+getRemodInt(255)+","+getRemodInt(255)+")";
  const c = myCanvas.value; // document.getElementById("myCanvas");

  // img.style.display = "none";

  // c.style.display = "inline";

  // bufferImg.style.display = "none";

  c.width = imgWidth;
  c.height = imgWidth;

  const ctx = c.getContext("2d");
  const ctx1 = new C2S(imgWidth, imgWidth);

  ctx.fillStyle = "green";
  ctx1.fillStyle = "green";
  //ctx.fillRect(40,0,10,10);

  // x从cab 0-50 取 值，再拿这个值取到对称数，
  // y 从0 到 100 做10 次增加

  ctx.fillStyle = bColor;
  ctx1.fillStyle = bColor;
  //console.log(backColor);
  ctx.fillRect(0, 0, imgWidth, imgWidth);
  ctx1.fillRect(0, 0, imgWidth, imgWidth);
  ctx.fillStyle = penColor;
  ctx1.fillStyle = penColor;

  // for (let yl = 0; yl <= imgWidth; yl += penWidth) {
  //   (function (rmd) {
  //     console.log(rmd);
  //     for (var i = 0; i < rmd; i++) {
  //       var x1 = getRemodIntByPenSize(imgWidth / 2, penWidth);
  //       //console.log(x1);
  //       var x2 = getSymmetry(x1, imgWidth, penWidth);
  //       ctx.fillRect(x1, yl, penWidth, penWidth);
  //       ctx1.fillRect(x1, yl, penWidth, penWidth);
  //       ctx.fillRect(x2, yl, penWidth, penWidth);
  //       ctx1.fillRect(x2, yl, penWidth, penWidth);
  //     }
  //   })(getRemodInt(imgWidth / penWidth / 2));
  // }

  const cols = penWidth; // 6列像素
  const rows = penWidth; // 6行像素
  const pixelSize = imgWidth / cols; // 每个像素大小
  let hash = 0;

  for (let i = 0; i < name.value.length; i++) {
    hash = name.value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = hash % 99999; // 让相同名称生成相同图案

  for (let x = 0; x < cols / 2; x++) {
    for (let y = 0; y < rows; y++) {
      const randomBit = (seed >> (x * rows + y)) & 1; // 随机对称像素
      if (randomBit) {
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        ctx1.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        ctx.fillRect(
          (cols - 1 - x) * pixelSize,
          y * pixelSize,
          pixelSize,
          pixelSize
        );
        ctx1.fillRect(
          (cols - 1 - x) * pixelSize,
          y * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }

  //ok lets serialize to SVG:
  mySvg.value = ctx1.getSerializedSvg(true);
};

// 下载头像（SVG 转 PNG）
const downloadAvatar = () => {
  // const svg = document.querySelector(".avatar");
  const svgData = mySvg.value; // new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.download = `${name.value}-avatar.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.src = "data:image/svg+xml;base64," + btoa(svgData);
};
</script>

<style scoped>
.container {
  text-align: center;
  margin: 20px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 10px;
}

.options {
  margin-bottom: 10px;
  font-size: 14px;
}

.avatar {
  display: block;
  margin: 10px auto;
}

.circle {
  border-radius: 50%;
}

.rounded {
  border-radius: 15px;
}

.shadow {
  filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.2));
}

/* button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
} */
</style>
