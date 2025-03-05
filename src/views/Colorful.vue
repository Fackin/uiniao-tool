<script setup lang="ts">
import { ref } from 'vue'
import { VueColorfull } from 'vue-colorfull'
// import 'vue-colorfull/dist/vue-colorfull.css'
import type { HsvaColor, HsvColor, HslColor, HslaColor, RgbColor, RgbaColor } from 'vue-colorfull'

//  "hex" | "hexa" | "hsl" | "hslString" | "hsla" | "hslaString" | "hsv" | "hsvString" | "hsva" | "hsvaString" | "rgb" | "rgbString" | "rgba" | "rgbaString";
const colorhsv = ref<HsvColor>({h:0, s:100, v:100})
const colorhsva = ref<HsvaColor>({h:0, s:100, v:100, a:1})
const colorhex = ref<string>('#00ddff')
const colorhexa = ref<string>('#00ddff1')
const colorhsl = ref<HslColor>({h:0, s:100, l:100})
const colorhsla = ref<HslaColor>({h:0, s:100, l:100, a:1})
const colorrgb = ref<RgbColor>({r:0, g:100, b:100})
const colorrgba = ref<RgbaColor>({r:0, g:100, b:100, a:1})
</script>

<template>
    <div style="width: 400px; margin: 0 auto;">

        <div>
            <VueColorfull v-model="colorhsv"  type="hsv"/>
            <div>hsv {{ colorhsv }}</div>
            <!-- <div style="width: 200px;height: 200px;" :style="{backgroundColor: color}"></div> -->
        </div>
        <div>
            <VueColorfull v-model="colorhsva"  type="hsva"/>
            <div>hsva {{ colorhsva }}</div>
            <!-- <div style="width: 200px;height: 200px;" :style="{backgroundColor: color}"></div> -->
        </div>
        <div>
            <VueColorfull v-model="colorhex"  type="hex"/>
            <div>hex {{ colorhex }}</div>
            <!-- <div style="width: 200px;height: 200px;" :style="{backgroundColor: color}"></div> -->
        </div>
        <div>
            <VueColorfull v-model="colorhexa"  type="hexa"/>
            <div>hexa {{ colorhexa }}</div>
            <!-- <div style="width: 200px;height: 200px;" :style="{backgroundColor: color}"></div> -->
        </div>
        <div>
            <VueColorfull v-model="colorhsl"  type="hsl"/>
            <div>hsl {{ colorhsl }}</div>
            <!-- <div style="width: 200px;height: 200px;" :style="{backgroundColor: color}"></div> -->
        </div>
        <div>
            <VueColorfull v-model="colorhsla"  type="hsla"/>
            <div>hsla {{ colorhsla }}</div>
            <!-- <div style="width: 200px;height: 200px;" :style="{backgroundColor: color}"></div> -->
        </div>
        <div>
            <VueColorfull v-model="colorrgb"  type="rgb"/>
            <div>rgb {{ colorrgb }}</div>
            <!-- <div style="width: 200px;height: 200px;" :style="{backgroundColor: color}"></div> -->
        </div>
        <div>
            <VueColorfull v-model="colorrgba"  type="rgba"/>
            <div>rgba {{ colorrgba }}</div>
            <!-- <div style="width: 200px;height: 200px;" :style="{backgroundColor: color}"></div> -->
        </div>
    </div>
</template>

<style scoped>
/* @import 'vue-colorfull/dist/vue-colorfull.css'; */
</style>