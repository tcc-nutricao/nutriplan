<template>
    <div class="flex gap-2 justify-center">
        <div 
            v-for="(restriction, index) in items"
            :key="index"
            :class="{ 'border-p-600 border-r-2': index < items.length - 1 }"
            class="flex items-center gap-1 pr-1"
        >
            <IconSolid :icon="restriction.dietaryRestriction.icon" color="text-p-600" sm />
            <IconSolid icon="fa-times" color="text-red-500" sm />
        </div>
    </div>
  
</template>

<script setup>
const props = defineProps({
    items: Array
})
</script>
