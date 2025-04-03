import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/color-camera',
      name: 'color-camera',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/colorCamera/index.vue'),
    },
    {
      path: '/dynasty',
      name: 'dynasty',
      component: () => import('../views/DynastyView.vue'),
    },
    {
      path: '/colorful',
      name: 'colorful',
      component: () => import('../views/Colorful.vue'),
    },
    {
      path: '/image-view',
      name: 'imageView',
      component: () => import('../views/ImageView.vue'),
    },
    {
      path: '/mosaic-card-view',
      name: 'mosaic-card-view',
      component: () => import('../views/MosaicCardView.vue'),
    },
    {
      path: '/pixel-card-view',
      name: 'pixel-card-view',
      component: () => import('../views/PixelCardView.vue'),
    },
    {
      path: '/pixel-view',
      name: 'pixel-view',
      component: () => import('../views/PixelView.vue'),
    },
    {
      path: '/snake-game',
      name: 'snake-game',
      component: () => import('../views/SnakeGame.vue'),
    },
    {
      path: '/keyboard',
      name: 'keyboard',
      component: () => import('../views/keyboard/index.vue'),
    },
    {
      path: '/cursor-style',
      name: 'cursor-style',
      component: () => import('../views/CursorStyle.vue'),
    },
    {
      path: '/name-avatar',
      name: 'name-avatar',
      component: () => import('../views/NameAvatar.vue'),
    },
    {
      path: '/name-avatar1',
      name: 'name-avatar1',
      component: () => import('../views/NameAvatar1.vue'),
    },
    {
      path: '/png-2-svg',
      name: 'png-2-svg',
      component: () => import('../views/Png2Svg.vue'),
    },
    {
      path: '/liquid-nav',
      name: 'liquid-nav',
      component: () => import('../views/LiquidNav.vue'),
    },
    {
      path: '/battery-demo',
      name: 'battery-demo',
      component: () => import('../views/BatteryDemo.vue'),
    },
    {
      path: '/url-favicon',
      name: 'url-favicon',
      component: () => import('../views/UrlFavicon.vue'),
    },
    {
      path: '/theme',
      name: 'theme',
      component: () => import('../views/ThemeView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/404.vue'),
      props: true,
    }
  ],
})

export default router
