<template>
  <button
    :disabled="disabled"
    v-bind="$attrs"
    :class="[
      { 'text-black': dark || light },
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
      { [grayClass]: gray && !outlined },
      { [grayBorderClass]: gray && outlined },
      { 'rounded-lg 0 border border-slate-20 hover:bg-gray-50': light },
    ]"
    class="rounded-xl flex items-center justify-center">
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
  return 'transition bg-green-500 hover:bg-green-600 active:scale-95 border-2 border-green-400 shadow-green-500/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const lightPurpleClass = computed(() => {
  return 'transition bg-p-500 hover:bg-p-600 active:scale-95 border-2 border-p-400 shadow-p-600/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const mediumPurpleClass = computed(() => {
  return 'transition bg-p-600 hover:bg-p-700 active:scale-95 border-2 border-p-500 shadow-p-600/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const darkPurpleClass = computed(() => {
  return 'transition bg-p-700 hover:bg-p-800 active:scale-95 border-2 border-p-600 shadow-p-600/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const redClass = computed(() => {
  return 'transition bg-red-500 hover:bg-red-600 active:scale-95 border-2 border-red-400 shadow-red-500/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const grayClass = computed(() => {
  return 'transition bg-gray-500 hover:bg-gray-600 active:scale-95 border-2 border-gray-400 hover:shadow-xl shadow-lg active:shadow-none'
})

const greenBorderClass = computed(() => {
  return 'transition border-2 border-green-500 hover:border-green-600 text-green-500 active:scale-95 shadow-green-500/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const lightPurpleBorderClass = computed(() => {
  return 'transition border-2 border-[#9B78DA] hover:bg-[#9B78DA] hover:bg-opacity-20 text-[#9B78DA] active:scale-95 shadow-p-600/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const mediumPurpleBorderClass = computed(() => {
  return 'transition border-2 border-p-600 hover:border-p-700 hover:bg-p-100 text-p-600 active:scale-95 shadow-p-600/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const darkPurpleBorderClass = computed(() => {
  return 'transition border-2 border-[#663C9B] hover:border-purple-600 text-[#663C9B] active:scale-95 shadow-p-600/20 hover:shadow-xl shadow-lg active:shadow-none'
})

const darkGrayBorderClass = computed(() => {
  return 'transition border-2 border-gray-dark hover:border-gray-600 text-gray-dark hover:text-gray-600 active:scale-95 hover:shadow-xl shadow-lg active:shadow-none'
})

const grayBorderClass = computed(() => {
  return 'transition border-2 border-gray-400 bg-gray-50 hover:border-gray-500 hover:text-gray-600 hover:bg-gray-50 text-gray-500 active:scale-95 hover:shadow-xl shadow-lg active:shadow-none'
})

const redBorderClass = computed(() => {
  return 'transition border-2 border-red-500 hover:border-red-600 text-red-500 active:scale-95 shadow-red-500/20 hover:shadow-xl shadow-lg active:shadow-none'
})

</script>