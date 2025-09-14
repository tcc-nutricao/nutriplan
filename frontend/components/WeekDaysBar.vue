<template>
  <div class="w-full items-center flex gap-3">
    <Button
      v-for="(day, index) in weekDays"
      :key="index"
      :label="day"
      mediumPurple
      :outlined="active !== day"
      @click="active = day"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const weekDays = ref(['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'])
const active = ref('Seg')
</script>
