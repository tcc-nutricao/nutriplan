<template>
  <div class="min-h-screen flex flex-col">
    <TopBar v-if="!hideTopBar" />
    <div class="m-5">
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
