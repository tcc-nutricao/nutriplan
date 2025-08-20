<template>
    <div class="flex gap-2">
        <div 
            v-for="(restriction, index) in items"
            :key="index"
            class="flex gap-1 border-r-2 border-p-600"
        >
            <i :class="restriction.icon"></i>
            <i class="fa fa-times text-red-500"></i>
        </div>
    </div>
  
</template>

<script setup>
const props = defineProps({
    items: Array
})
</script>
