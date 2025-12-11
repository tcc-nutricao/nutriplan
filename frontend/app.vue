<template>
  <div class="min-h-screen bg-p-g flex flex-col">
    <TopBar v-if="!hideTopBar" class="top-bar-fading scale-[60%] h-[60px] sm:scale-100 sm:h-full"/>
    <div class="min-w-screen flex flex-1" :class="isMobile ? 'flex-col items-center' : 'flex-row'">
      <ProfileCard v-if="!hideSideBar" class="stickyProfile" />
      <div class="flex-1 w-full">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()

const hideTopBar = computed(() => route.meta.hideTopBar === true)
const hideSideBar = computed(() => route.meta.hideSideBar === true)

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

</script>

<style>
  @keyframes fade-out {
    from { opacity: 1; pointer-events: all; }
    to { opacity: 0; pointer-events: none;}
  }

  .top-bar-fading {
    animation: fade-out linear;

    animation-timeline: scroll();

    animation-range-end: 100px;

    animation-fill-mode: forwards;

    animation-duration: 3s;

  }

  .stickyProfile {
    position: sticky;
    top: 20px;
    align-self: flex-start;
  }

.page-content {
    transition: margin-top 0.25s ease;
}

@media (max-width: 768px) {
  .page-content {
    margin-top: 6vw;
  }
}
</style>
