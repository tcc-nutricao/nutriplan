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
  return 'transition bg-green-500 hover:bg-green-600 active:scale-95 hover:shadow-lg'
})

const lightPurpleClass = computed(() => {
  return 'transition bg-p-500 hover:bg-p-600 active:scale-95 hover:shadow-lg'
})

const mediumPurpleClass = computed(() => {
  return 'transition bg-p-600 hover:bg-p-700 active:scale-95 hover:shadow-lg hover:drop-shadow-np2'
})

const darkPurpleClass = computed(() => {
  return 'transition bg-p-700 hover:bg-p-800 active:scale-95 hover:shadow-lg'
})

const redClass = computed(() => {
  return 'transition bg-red-500 hover:bg-red-600 active:scale-95 hover:shadow-lg'
})

const greenBorderClass = computed(() => {
  return 'transition border border-green-500 hover:border-green-600 text-green-500 active:scale-95 hover:shadow-lg'
})

const lightPurpleBorderClass = computed(() => {
  return 'transition border border-[#9B78DA] hover:bg-[#9B78DA] hover:bg-opacity-20 text-[#9B78DA] active:scale-95 hover:shadow-lg'
})

const mediumPurpleBorderClass = computed(() => {
  return 'transition border border-[#8A5ACD] hover:border-p-700 text-p-600 active:scale-95 hover:shadow-lg'
})

const darkPurpleBorderClass = computed(() => {
  return 'transition border border-[#663C9B] hover:border-purple-600 text-[#663C9B] active:scale-95 hover:shadow-lg'
})

const darkGrayBorderClass = computed(() => {
  return 'transition border border-[#7A6E94] hover:border-black text-[#7A6E94] active:scale-95 hover:shadow-lg'
})

const redBorderClass = computed(() => {
  return 'transition border border-red-500 hover:border-red-600 text-red-500 active:scale-95 hover:shadow-lg'
})

</script>