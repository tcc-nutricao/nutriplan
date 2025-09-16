<template>
  <FlexCol gap-1>
    <Label :label="label" :required="required" :error="error" />
    <Input
      v-model="localValue"
      :error="error"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :type="open ? 'password' : 'text'"
      @enter="handleEnter"
    >
      <template #pos-icon>
        <IconInput
          :icon="open ? 'fa-eye' : 'fa-eye-slash'"
          @click="toggle"
          class="border-l"
        />
      </template>
    </Input>
    <Error v-model="props.error" :message="error" />
  </FlexCol>
</template>

<script setup>
  import { watch, ref } from 'vue'

  const props = defineProps({
    label: String,
    required: Boolean,
    disabled: Boolean,
    error: Array,
    modelValue: [String, Number],
    placeholder: String,
  })

  const emits = defineEmits(['enter', 'update:modelValue'])
  const localValue = ref(props.modelValue)
  const error = ref(props.error)
  const open = ref(true)
  
  const handleEnter = () => {
    emits('enter')
  }
  const toggle = () => {
    open.value = !open.value
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      localValue.value = newValue
    }
  )

  watch(
    () => props.error,
    (newValue) => {
      error.value = newValue
    }
  )

  watch(localValue, (newValue) => {
    emits('update:modelValue', newValue)
  })
</script>