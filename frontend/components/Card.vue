<template>
  <div class="h-max rounded-3xl gap-3 p-6" :class="[
    {'pb-8': !centered},
    { 'items-center justify-center pb-6 ' : centered }, 
    { 'bg-white shadow-lg' : bg }, 
    { 'bg-transparent shadow-none' : !bg }
  ]">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  centered: {
    type: Boolean,
    default: false
  },
  bg: {
    type: Boolean,
    default: true
  }
})
</script>
