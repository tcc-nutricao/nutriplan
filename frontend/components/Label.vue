<template>
  <Flex class="block text-[#351F56] font-semibold" :class="classes">
    {{ props.label }}
    <span v-if="props.required" class="text-danger-500 pl-1">
      <strong>*</strong>
    </span>
  </Flex>
</template>

<script setup>
  import { computed } from 'vue'
  const props = defineProps({
    label: String,
    required: Boolean,
    error: [Array, String],
  })
  const classes = computed(() => [{ 'text-red-500': props.error }])
</script>