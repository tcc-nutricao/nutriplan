<template>
  <div class="min-h-screen flex flex-col">
    <TopBar v-if="!hideTopBar" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const hideTopBar = computed(() => route.meta.hideTopBar === true)
</script>
