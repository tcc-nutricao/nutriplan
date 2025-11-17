<template>
  <div class="h-max rounded-3xl shadow-lg gap-3 bg-white p-6" :class="[{'pb-8': !centered},{ 'items-center justify-center pb-6 ' : centered }]">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  centered: {
    type: Boolean,
    default: false
  },
})
</script>
