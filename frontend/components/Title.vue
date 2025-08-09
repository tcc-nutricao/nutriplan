<template>
    <p :class="[
        'text-[#351F56]',
        'font-bold',
        { 'text-xl': props.xl },
        { 'text-2xl': props.twoxl },
        { 'text-3xl': props.threexl },
        { 'text-4xl': props.fourxl },
        { 'text-lg': props.lg },
        { 'text-sm': props.sm },
        { 'text-xs': props.xs },
    ]">{{ label }}</p>
</template>

<script setup lang='ts'>
const props = defineProps({
    xs: Boolean,
    sm: Boolean,
    xl: Boolean,
    twoxl: Boolean,
    threexl: Boolean,
    fourxl: Boolean,
    lg: Boolean,
    label: String
})
</script>
