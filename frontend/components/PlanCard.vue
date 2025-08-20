<template>
    <div class="grid grid-cols-1 w-fit h-fit border-p-600 border-2 rounded-xl gap-3">
        <div class="bg-p-600 rounded-xl w-full h-full text-white text-center p-2">
            <p class="font-sora text-lg">{{ mealPlan?.calories }} kcal</p>
        </div>

        <RestrictionsIconBar :items="mealPlan?.dietaryRestrictions" />

        <div 
            class="flex gap-2"
            v-for="(objective, index) in mealPlan?.objectives"
            :key="index"
        >
            <i :class="objective.icon"></i>
            <p class="font-sora">{{ objective?.name }}</p>
        </div>  
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    mealPlan: Object
})

computed(() => getIntoleranceIcon)
</script>
