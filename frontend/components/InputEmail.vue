<template>
  <FlexCol gap-1>
    <Label :label="label" :required="required" :error="error" />
    <Input
      v-model="localValue"
      :error="error"
      :placeholder="props.placeholder"
      :disabled="props.disabled"      
    >
      <!-- <template #pre-icon>
        <IconInput icon="fa-envelope" class="border-r" />
      </template> -->
    </Input>
    <Error v-model="props.error" :message="props.error" />
  </FlexCol>
</template>

<script setup>
  import { watch, ref } from 'vue'

  const props = defineProps({
    label: String,
    required: Boolean,
    disabled: Boolean,
    error: String,
    modelValue: [String, Number],
    placeholder: String,
    min: String,
    max: String,
  })

  const emits = defineEmits(['update:modelValue'])
  const localValue = ref(props.modelValue)
  const error = ref(props.error)

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