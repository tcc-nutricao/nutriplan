<template>
  <div class="min-h-screen bg-p-g flex flex-col">
    <TopBar v-if="!hideTopBar" class="top-bar-fading"/>
    <div class="min-w-screen flex flex-1">
      <ProfileCard v-if="!hideSideBar" class="stickyProfile" />
      <!-- <Sidebar v-if="!hideSideBar" /> -->
      <div class="flex-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const hideTopBar = computed(() => route.meta.hideTopBar === true)
const hideSideBar = computed(() => route.meta.hideSideBar === true)

</script>

<style>
  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  .top-bar-fading {
    animation: fade-out linear;

    animation-timeline: scroll();

    animation-range-end: 100px;

    animation-fill-mode: forwards;

    animation-duration: 3s;

    pointer-events: none;
  }

  .stickyProfile {
    position: sticky;
    top: 20px;
    align-self: flex-start;
  }
</style>
