<script setup lang="ts"></script>

<template>
  <header>
    <div class="logo"><RouterLink to="/">UiNiaO</RouterLink></div>
    

    <!-- <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/color-camera">colorCamera</RouterLink>
        <RouterLink to="/dynasty">dynasty</RouterLink>
      </nav>
    </div> -->
    <div class="header-right flex justify-center items-center gap-2">
      <div>语言</div>
      <div>github</div>
    </div>
  </header>
</template>

<style scoped>
/*  @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"); */
@import url('@/assets/fonts/font.css');

header {
  width: 100%;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
}

.logo {
  font-size: 1rem;
  font-family: "Press Start 2P Simple", serif;
  font-weight: 400;
  font-style: normal;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  flex: 1;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  /* header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  } */

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
  .logo {
    font-size: 1.5rem;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
