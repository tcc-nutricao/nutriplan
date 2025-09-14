<template>
  <Card>
    <div class="flex flex-col gap-3 w-full">
      <div class="bg-p-600 rounded-md p-2">
        <div class="flex flex-wrap text-white gap-2 justify-center items-center">
            <span class="text-white">Plano de</span>
            <span
                v-for="(goalObjective, index) in object.goalObjectives"
                :key="index"
            >
                {{ goalObjective.objective.name }} <span v-if="index !== object.goalObjectives.length - 1">|</span>
            </span>
            <span class="text-white">{{`${object.calories} kcal [#${object.id}]`}}</span>
        </div> 
      </div>

      <div class="flex gap-3 items-center">
        <div class="flex gap-2 justify-center items-center pr-1">
            <IconSolid icon="fa-fire" color="text-red-500" sm />
            <span class="text-p-600">{{ `${object.calories} kcal` }}</span>
        </div> 
        <RestrictionsIconBar :items="object.dietaryRestrictions" />
        <RestrictionsIconBar :items="object.goalObjectives" />
      </div>
      <WeekDaysBar />
      <Menu :items="object.mealPlanMeals" /> 
    </div>
  </Card>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  object: { type: Object, required: true },
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] }
})

onMounted(() => {
  console.log(props.object)
})
</script>
