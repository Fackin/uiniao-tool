<template>
  <!-- Navigation - Left sidebar on desktop, bottom bar on mobile -->
  <nav :class="['navigation', { mobile: isMobile }]">
    <div class="nav-container">
      <a
        href="#home"
        class="nav-item"
        :class="{ active: activeTab === 'home' }"
        @click="setActiveTab('home')"
      >
        <div class="icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <span class="nav-label">Home</span>
      </a>

      <a
        href="#search"
        class="nav-item"
        :class="{ active: activeTab === 'search' }"
        @click="setActiveTab('search')"
      >
        <div class="icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <span class="nav-label">Search</span>
      </a>

      <a
        href="#tools"
        class="nav-item"
        :class="{ active: activeTab === 'tools' }"
        @click="setActiveTab('tools')"
      >
        <div class="icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            ></path>
          </svg>
        </div>
        <span class="nav-label">Tools</span>
      </a>

      <a
        href="#profile"
        class="nav-item"
        :class="{ active: activeTab === 'profile' }"
        @click="setActiveTab('profile')"
      >
        <div class="icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <span class="nav-label">Profile</span>
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const activeTab = ref("home");
const isMobile = ref(false);

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
  router.push(`/#${tab}`);
};

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>

/* Desktop Navigation (Left Side) */
.navigation {
  position: fixed;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  /* width: 80px; */
  width: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px 0;
  transition: all 0.3s ease;
  z-index: 40;
}

.nav-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  /* color: #666; */
  color: var(--color-text);
  padding: 10px;
  width: 100%;
  transition: all 0.2s ease;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.nav-label {
  font-size: 12px;
  margin-top: 2px;
  transition: all 0.2s ease;
  display: none;
}

.nav-item:hover {
  /* color: #333; */
  color: var(--color-text);
}

.nav-item.active {
  /* color: #4361ee; */
  color: var(--color-primary);
}

.nav-item.active .icon-container {
  /* background-color: rgba(67, 97, 238, 0.1); */
  background-color: var(--color-bghover);
}

/* Mobile Navigation (Bottom) */
.navigation.mobile {
  left: 10px;
  top: auto;
  bottom: 20px;
  width: calc(100% - 20px);
  transform: none;
  border-radius: 40px;
  padding: 10px 0;
}

.navigation.mobile .nav-container {
  flex-direction: row;
  justify-content: space-around;
}

.navigation.mobile .nav-item {
  width: auto;
  padding: 0;
}

/* .navigation.mobile .icon-container {
  width: 30px;
  height: 30px;
}
.navigation.mobile .icon-container svg{
  width: 20px;
  height: 20px;
} */
/* Adjust main content when in mobile view */
.navigation.mobile + .main-content {
  margin-bottom: 70px;
  margin-left: 0;
}

</style>
