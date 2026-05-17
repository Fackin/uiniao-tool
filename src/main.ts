import './assets/main.css'
// import '../vue-colorfull.css';
import '@/assets/style/tailwind.css'
import 'leaflet/dist/leaflet.css'; // 引入 Leaflet 样式
import components from '@/components/index'
// import { cursorPlugin } from '@/plugins/cursor'


// import '@/utils/mouse.js';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(components)

// app.use(cursorPlugin, {
//     baseSize: 20,
//     scale: {
//         hover: 1.8,
//         active: 0.5
//     },
//     styles: {
//         color: 'var(--cursor-color, #fff)'
//     }
// })

app.mount('#app')
