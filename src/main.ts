import './assets/main.css'
// import '../vue-colorfull.css';
import '@/assets/style/tailwind.css'
import 'leaflet/dist/leaflet.css'; // 引入 Leaflet 样式
import components from '@/components/index'


// import '@/utils/mouse.js';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(components)

app.mount('#app')
