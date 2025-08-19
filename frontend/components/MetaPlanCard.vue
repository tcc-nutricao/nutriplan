<template>
    <div class="grid grid-cols-3 w-fit h-fit p-5 border-p-600 border-2 rounded-xl">
        <div class="bg-p-600 mb-3 text-white text-center">
            <p class="font-sora font-lg">{{ plan.calories }} kcal</p>
        </div>
        <div class="col-span-2">
            <div class="flex gap-2">
                <div 
                    class="flex gap-1" :class="getIntoleranceIcon" 
                >

                </div>
            </div>
        </div>
    </div>
  
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    plan: Object
})

computed(() => getIntoleranceIcon)
</script>
