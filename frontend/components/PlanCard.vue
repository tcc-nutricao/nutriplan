<template>
    <Card>
        <div class="flex justify-between mb-3">
            <p>{{ title }}</p>
            <i class="fa-solid fa-circle-info text-p-600"></i>
        </div>
        <MetaPlanCard :plan="plan" />
    </Card>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    plan: Object
})
</script>