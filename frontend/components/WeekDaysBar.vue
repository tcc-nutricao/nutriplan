<template>
  <div class="items-center flex gap-3">
    <Button
      v-for="(day, index) in weekDays"
      :key="index"
      :label="day.label"
      mediumPurple
      :outlined="modelValue !== day.value"
      @click="selectDay(day.value)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: 'MON' }
})

const emit = defineEmits(['update:modelValue'])

const weekDays = [
  { label: 'Seg', value: 'MON' },
  { label: 'Ter', value: 'TUE' },
  { label: 'Qua', value: 'WED' },
  { label: 'Qui', value: 'THU' },
  { label: 'Sex', value: 'FRI' },
  { label: 'Sáb', value: 'SAT' },
  { label: 'Dom', value: 'SUN' }
]

const selectDay = (day) => {
  emit('update:modelValue', day)
}
</script>
