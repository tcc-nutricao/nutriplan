<template>
  <div class="min-h-screen bg-p-g flex flex-col">
    <TopBar v-if="!hideTopBar" />
    <div class="m-0">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const hideTopBar = computed(() => route.meta.hideTopBar === true)
</script>
