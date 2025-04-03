<template>
  <div>
    <h1>CSS Cursor 示例</h1>
    <div class="flex justify-center items-center flex-wrap gap-1">
      <div
        v-for="(cursor, index) in cursors"
        :key="index"
        class="cursor-item flex justify-center items-center"
        :data-cursor="index + 1"
        :style="{ cursor: cursor }"
      >
        {{ cursor }}
      </div>
    </div>
    <h1>Unicode 示例</h1>
    <div class="flex justify-center items-center flex-wrap gap-1">
      <div
        v-for="(unicode, index) in unicode"
        :key="index"
        class="unicode-item flex justify-center items-center"
        :data-cursor="unicode"
      >
        {{ unicode }} {{ formatUnicode(unicode) }}
        <span class="icon" v-html="unicode"></span>
      </div>
      <span class="icon">&#x1F3E0;</span>
      <!-- Home -->
      <span class="icon">&#x1F464;</span>
      <!-- User -->
      <span class="icon">&#x2699;</span>
      <!-- Cog -->
    </div>
  </div>
</template>

<script setup>
const cursors = [
  "auto",
  "default",
  "pointer",
  "text",
  "move",
  "wait",
  "help",
  "not-allowed",
  "crosshair",
  "grab",
  "grabbing",
  "zoom-in",
  "zoom-out",
  "e-resize",
  "n-resize",
  "ne-resize",
  "nw-resize",
  "s-resize",
  "se-resize",
  "sw-resize",
  "w-resize",
  "ew-resize",
  "ns-resize",
  "nesw-resize",
  "nwse-resize",
  "col-resize",
  "row-resize",
  "all-scroll",
  "progress",
  "cell",
  "context-menu",
  "alias",
  "copy",
  "no-drop",
  "vertical-text",
  "none",
];
const unicode = ["&#x1F3E0;", "&#x1F464;", "&#x2699;"];

const formatUnicode = (unicode) => {
    if (!unicode.startsWith("&#x")) return unicode;
    const code = parseInt(unicode.slice(3, -1), 16);
    if (isNaN(code)) return unicode;
    console.log(code);
    return String.fromCodePoint(code);
    return String.fromCodePoint(parseInt(unicode, 16));
};
</script>

<style scoped>
h1 {
  text-align: center;
}
.cursor-item {
  padding: 10px;
  /* margin: 5px; */
  width: 100px;
  height: 100px;
  color: #333;
  background-color: #f9f9f9;
  /* border: 1px solid #ccc; */
  border: none;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
}
.cursor-item:hover {
  /* transform: translateY(-5px); */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  background-color: #009d9e;
  border-radius: 8px;
}
.cursor-item::before {
  content: attr(data-cursor);
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: #009d9e;
  border-radius: 4px 0 4px 0;
}
.unicode-item {
  padding: 10px;
  width: 100px;
  height: 100px;
  color: #333;
  background-color: #f9f9f9;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
}
.unicode-item::before {
  content: "\1F3E0";
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background-color: #009d9e;
  border-radius: 4px 0 4px 0;
}
</style>
