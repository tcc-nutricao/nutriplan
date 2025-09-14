<template>
    <div class="flex justify-center">
        <div class="flex flex-col gap-3" v-for="(mealOfPlan, index) in items" :key="index">
            <h1 class="text-semibold">{{ mealOfPlan.meal.name.toUpperCase() }}</h1>
            <p v-for="(foodConsumed, index2) in mealOfPlan.foodConsumed" :key="index2">{{ formatFoodMeasurement(foodConsumed) }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    items: { type: Array, default: () => [] }
})

const formatFoodMeasurement = ((foodConsumed) => {
    return `${foodConsumed.food.name} (${foodConsumed.unitOfMeasurement.name}: ${foodConsumed.quantity})`
})

</script>