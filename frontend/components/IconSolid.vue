<template>
  <i
    class="fa-solid"
    :class="[
      props.icon,
      { 'text-2xl': props.twoxl },
      { 'text-xl': props.xl },
      { 'text-lg': props.lg },
      { 'text-sm': props.sm },
      { 'text-xs': props.xs },
    ]"
    :style="{ color: props.color }"
  />
</template>

<script setup>
const props = defineProps({
  icon: String,
  color: String, 
  xs: Boolean,
  sm: Boolean,
  xl: Boolean,
  twoxl: Boolean,
  lg: Boolean,
})
</script>
