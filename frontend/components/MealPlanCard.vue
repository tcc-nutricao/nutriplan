<template>
    <div class="mb-8 rounded-3xl shadow-lg gap-3 bg-white p-6 pb-8">
        <div class="flex items-center gap-3 justify-between mb-5">
            <p class="text-p-950">{{ title }}</p>
            <IconSolid 
                v-if="items.length > 3" 
                icon="fa-filter" 
                class="cursor-pointer"
                color="text-p-600 hover:text-p-800" />
            <IconSolid 
                v-else
                icon="fa-circle-info" 
                color="text-p-600 hover:text-p-800" />
        </div>
         <div class="flex items-center justify-between gap-3">
            <div 
                class="flex text-p-600 cursor-pointer hover:text-p-800" 
                @click="prev" 
                v-if="items.length > 3 && currentIndex > 2"
            >
                <IconSolid icon="fa-chevron-left" />
                <IconSolid icon="fa-chevron-left" />
            </div>

            <div :class="items.length === 1 ? 'justify-center' : 'justify-start'" class="flex items-center gap-3 flex-1">
                <PlanCard
                    v-for="(mealPlan, index) in visibleItems"
                    :key="index"
                    :object="mealPlan" />
            </div>

            <div 
                class="flex cursor-pointer text-p-600 hover:text-p-800" 
                v-if="items.length > 3" 
                @click="next" 
            >
                <IconSolid icon="fa-chevron-right" />
                <IconSolid icon="fa-chevron-right" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, default: "" },
  items: { type: Array, default: () => [] }
})

const currentIndex = ref(0)
const itemsPerPage = ref(3)

const next = () => {
    if (currentIndex.value + itemsPerPage.value < props.items.length) {
        currentIndex.value += itemsPerPage.value
    }
}

const prev = () => {
    if (currentIndex.value - itemsPerPage.value >= 0) {
        currentIndex.value -= itemsPerPage.value
    }
}

const visibleItems = computed(() => {
    if (!Array.isArray(props.items)) return []
    return props.items.slice(currentIndex.value, currentIndex.value + itemsPerPage.value)
})
</script>