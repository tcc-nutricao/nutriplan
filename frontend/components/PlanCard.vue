<template>
    <div class="grid grid-cols-1 border-p-600 border-2 rounded-xl gap-3 bg-white shadow-lg shadow-p-np/[10%]">
        <div class="bg-p-600 rounded-t-lg w-full h-full text-white text-center p-2">
            <p class="font-sora text-lg">{{ object.calories }} kcal</p>
        </div>
        <div class="flex justify-between items-center md:flex-col gap-2 px-4 pb-3">
            <div class="px-3">
                <div 
                    class="flex items-center gap-1 text-sm justify-start"
                    v-if="object.objective"
                >
                    <IconSolid :icon="object.objective.icon" color="text-p-600" sm />
                    <p class="font-sora text-p-950 font-semibold text-[0.85em]">{{ object.objective.name }}</p>
                </div>  
            </div>
            <RestrictionsIconBar v-if="hasRestrictions" :items="object.dietaryRestrictions" minicard />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    object: Object
})

const hasRestrictions = computed(() => {
    const restrictions = props.object.dietaryRestrictions;
    if (!restrictions || restrictions.length === 0) return false;
    
    const first = restrictions[0];
    if (typeof first === 'string') return first !== 'Nenhuma';
    
    const name = first.dietaryRestriction?.name || first.name;
    return name !== 'Nenhuma';
})
</script>
