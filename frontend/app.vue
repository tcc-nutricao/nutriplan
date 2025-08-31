<template>
  <div class="min-h-screen flex flex-col">
    <TopBar v-if="!hideTopBar" />
    <div class="min-w-screen flex flex-1">
      <Sidebar v-if="!hideSideBar" />
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
