<template>
  <Flex items-center class="rounded-lg border text-sm overflow-hidden h-[42px] focus-within:border-[#8A5ACD] focus-within:border-2 transition" :class="classes">
    <slot name="pre-icon" />
    <slot name="input">
      <input
        class="px-2 grow border-none bg-transparent focus:outline-none focus:ring-0 text-gray-700"
        :class="{ 'text-danger-500': props.error }"
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
  error: [Boolean, Array],
  disabled: Boolean,
  placeholder: String,
  min: String,
  max: String,
  mask: String
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
  'bg-slate-200': props.disabled,
  'border-slate-400': !props.error
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