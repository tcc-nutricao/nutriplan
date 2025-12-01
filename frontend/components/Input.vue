<template>
  <Flex items-center class="rounded-xl border-2 text-sm overflow-hidden border-p-g2 py-1.5 sm:py-2 focus-within:border-p-600 transition w-full" :class="classes">
    <slot name="pre-icon" />
    <span 
      v-if="prefix" 
      class="pl-3 text-p-950 select-none"
      :class="{'text-gray-medium' : props.disabled}"
    >{{ prefix }}</span>

    <slot name="input">
      <input
        class="px-3 grow border-none bg-transparent focus:outline-none focus:ring-0 text-p-950"
        :class="{ 'text-danger-500': props.error }, { 'pl-1': prefix }, {'text-gray-medium' : props.disabled}"
        v-model="displayValue"
        @input="handleInput"
        @keydown.enter.prevent="emitEnter"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :min="props.min"
        :max="props.max" />
    </slot>
    <slot name="pos-icon" />
  </Flex>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

import { useUtils } from '../composables/useUtils'
const { applyMask } = useUtils()
const props = defineProps({
  modelValue: [String, Number],
  type: String,
  error: [Boolean, Array, String],
  disabled: Boolean,
  placeholder: String,
  min: String,
  max: String,
  mask: String,
  prefix: String
})
const localValue = ref(props.modelValue)
const displayValue = ref(applyMask(localValue.value, props.mask))
const handleInput = (event) => {
  displayValue.value = applyMask(event.target.value, props.mask)
}
const emits = defineEmits(['update:modelValue'])
const emitEnter = () => {
  emits('enter')
}
const classes = computed(() => ({
  'border-red-500': props.error,
  'text-red-500': props.error,
  'bg-gray-100': props.disabled,
  'text-grey-100': props.disabled,
  'border-cinza': !props.error
}))
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
    if (newValue) {
      displayValue.value = applyMask(newValue, props.mask)
    } else {
      displayValue.value = null
    }
  }
)

watch(displayValue, (newValue) => {
  emits('update:modelValue', newValue)
})
</script>