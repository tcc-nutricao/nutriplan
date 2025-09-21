<template>
  <div class="text-red-400 text-xs mb-2 font-bold" v-if="message">
    <ul class="list-disc" v-if="Array.isArray(message)">
      <li v-for="(item, i) in message" :key="i">{{ item }}</li>
    </ul>
    <span v-else>{{ message }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  message: [String, Array],
})
</script>