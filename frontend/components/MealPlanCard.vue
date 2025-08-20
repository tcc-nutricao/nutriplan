<template>
    <Card>
        <div class="flex justify-between mb-3">
            <p class="text-p-950 font-semibold">{{ title }}</p>
            <i class="fa-solid fa-circle-info text-p-600"></i>
        </div>
        <PlanCard :mealPlan="object" />
    </Card>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    object: Object
})
</script>