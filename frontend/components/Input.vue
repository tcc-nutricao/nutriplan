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
        :type="inputType"
        :inputmode="inputMode"
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

const isNumber = computed(() => props.type === 'number');
const inputType = computed(() => isNumber.value ? 'text' : props.type);
const inputMode = computed(() => isNumber.value ? 'decimal' : undefined);

const formatValue = (val) => {
  if (val === null || val === undefined) return '';
  if (isNumber.value) {
    return String(val).replace('.', ',');
  }
  return props.mask ? applyMask(val, props.mask) : val;
}

const localValue = ref(props.modelValue)
const displayValue = ref(formatValue(props.modelValue))

const handleInput = (event) => {
  let val = event.target.value;
  if (props.mask) {
    displayValue.value = applyMask(val, props.mask)
  } else if (isNumber.value) {
    // Allow numbers and one comma
    val = val.replace(/[^0-9,]/g, '');
    const parts = val.split(',');
    if (parts.length > 2) {
      val = parts[0] + ',' + parts.slice(1).join('');
    }
    displayValue.value = val;
  } else {
    displayValue.value = val;
  }
}

const emits = defineEmits(['update:modelValue', 'enter'])
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
    displayValue.value = formatValue(newValue)
  }
)

watch(displayValue, (newValue) => {
  let finalValue = newValue;
  if (isNumber.value && newValue) {
    finalValue = newValue.replace(',', '.');
  }
  emits('update:modelValue', finalValue)
})
</script>