<template>
  <button
    :disabled="disabled"
    v-bind="$attrs"
    :class="[
      { 'text-black': dark || gray || light },
      { 'text-white': !dark && !outlined && !gray && !light },
      { 'w-full': block },
      { 'inline-block': !block },
      { 'opacity-50 cursor-auto': disabled },
      { [greenClass]: green && !outlined },
      { [lightPurpleClass]: lightPurple && !outlined },
      { [mediumPurpleClass]: mediumPurple && !outlined },
      { [darkPurpleClass]: darkPurple && !outlined },
      { [greenBorderClass]: green && outlined },
      { [lightPurpleBorderClass]: lightPurple && outlined },
      { [mediumPurpleBorderClass]: mediumPurple && outlined },
      { [darkPurpleBorderClass]: darkPurple && outlined },
      { [darkGrayBorderClass]: darkGray && outlined },
      { [redClass]: red && !outlined },
      { [redBorderClass]: red && outlined },
      { 'rounded-lg bg-gray-200 hover:bg-gray-300 border border-gray-300': gray },
      { 'rounded-lg 0 border border-slate-20 hover:bg-gray-50': light },
    ]"
    class="rounded-lg flex items-center justify-center">
    <div :class="size === 'text-xs' || size === 'text-sm' ? 'px-2' : 'px-4'" class="py-2 flex items-center justify-center">
      <slot>
        <i class="fa-solid" :class="label ? `mr-2 ${icon}` : `${icon}`" v-if="icon"></i>
        <p :class="size ? size : ''">{{ label }}</p>
      </slot>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  label: String,
  color: String,
  icon: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  size: String,
  block: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  green: {
    type: [Boolean, Number],
    default: false,
  },
  red: {
    type: [Boolean, Number],
    default: false,
  },
  lightPurple: {
    type: [Boolean, Number],
    default: false,
  },
  mediumPurple: {
    type: [Boolean, Number],
    default: false,
  },
  darkPurple: {
    type: [Boolean, Number],
    default: false,
  },
  darkGray: {
    type: [Boolean, Number],
    default: false,
  },
  dark: {
    type: [Boolean, Number],
    default: false,
  },
  gray: {
    type: [Boolean, Number],
    default: false,
  },
  light: {
    type: [Boolean, Number],
    default: false,
  }
})

const greenClass = computed(() => {
  return 'bg-green-500 hover:bg-green-600'
})

const lightPurpleClass = computed(() => {
  return 'bg-[#9B78DA] hover:bg-purple-500'
})

const mediumPurpleClass = computed(() => {
  return 'bg-[#8A5ACD] hover:bg-purple-600'
})

const darkPurpleClass = computed(() => {
  return 'bg-[#663C9B] hover:bg-purple-700'
})

const redClass = computed(() => {
  return 'bg-red-500 hover:bg-red-600'
})

const greenBorderClass = computed(() => {
  return 'border border-green-500 hover:border-green-600 text-green-500'
})

const lightPurpleBorderClass = computed(() => {
  return 'border border-[#9B78DA] hover:bg-[#9B78DA] hover:bg-opacity-20 text-[#9B78DA]'
})

const mediumPurpleBorderClass = computed(() => {
  return 'border border-[#8A5ACD] hover:border-purple-500 text-[#8A5ACD]'
})

const darkPurpleBorderClass = computed(() => {
  return 'border border-[#663C9B] hover:border-purple-600 text-[#663C9B]'
})

const darkGrayBorderClass = computed(() => {
  return 'border border-[#7A6E94] hover:border-black text-[#7A6E94]'
})

const redBorderClass = computed(() => {
  return 'border border-red-500 hover:border-red-600 text-red-500'
})

</script>