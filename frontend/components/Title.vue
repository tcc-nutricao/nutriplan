<template>
    <p :class="[
        props.color,
        { 'text-bold': props.bold },
        { 'text-xl': props.xl },
        { 'text-2xl': props.twoxl },
        { 'text-3xl': props.threexl },
        { 'text-4xl': props.fourxl },
        { 'text-lg': props.lg },
        { 'text-sm': props.sm },
        { 'text-xs': props.xs },
    ]">{{ props.label }}</p>
</template>

<script setup>
const props = defineProps({
    xs: Boolean,
    sm: Boolean,
    xl: Boolean,
    twoxl: Boolean,
    threexl: Boolean,
    fourxl: Boolean,
    lg: Boolean,
    label: String,
    color: String,
    bold: Boolean
})
</script>
