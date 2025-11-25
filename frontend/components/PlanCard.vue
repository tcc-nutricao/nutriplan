<template>
    <div class="grid grid-cols-1 border-p-600 border-2 rounded-xl gap-3">
        <div class="bg-p-600 rounded-t-lg w-full h-full text-white text-center p-2">
            <p class="font-sora text-lg">{{ object.calories }} kcal</p>
        </div>
        <RestrictionsIconBar :items="object.dietaryRestrictions" minicard />
        <div class="pb-3 px-3">
            <div 
                class="flex items-center gap-1 text-sm justify-start"
                v-for="(goalObjective, index) in object.goalObjectives"
                :key="index"
            >
                <IconSolid :icon="goalObjective.objective.icon" color="text-p-600" sm />
                <p class="font-sora text-p-950 font-semibold text-[0.85em]">{{ goalObjective.objective.name }}</p>
            </div>  
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    object: Object
})

computed(() => getIntoleranceIcon)
</script>
