<template>
    <div class="flex flex-wrap gap-2 justify-center">
        <div 
            v-for="(item, index) in safeItems"
            :key="index"
            :class="minicard ? 'flex items-center gap-1 pr-1': 'flex items-center gap-1 bg-gray-200 px-3 py-2 rounded-full'"
        >
            <IconSolid :icon="item.icon" color="text-gray-600" md />
            <!-- <IconSolid v-if="minicard" icon="fa-times" color="text-red-500" md /> -->
            <p v-if="!minicard" class="text-gray-600 text-sm ml-1 text-nowrap">{{ item.name }}</p>
        </div>
    </div>
  
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    items: { type: Array, default: () => [] },
    minicard: { type: Boolean, default: false }
})

const safeItems = computed(() => {
  if (!props.items ||!Array.isArray(props.items)) return []
  
  return props.items.map(item => {
    if (item.dietaryRestriction) {
      return {
        icon: item.dietaryRestriction.icon,
        name: item.dietaryRestriction.name
      }
    }
    if (item.objective) {
      return {
        icon: item.objective.icon || 'fa-bullseye',
        name: item.objective.name
      }
    }
    return {
      icon: item.icon || 'fa-question',
      name: item.name || 'Unknown'
    }
  })
})
</script>
