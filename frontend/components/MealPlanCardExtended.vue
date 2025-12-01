<template>
  <Card style="padding: 0" class="p-0 border-4 border-p-600">
    <div class="flex flex-col gap-3 pb-10 w-full items-center">
        <div class="relative flex justify-between items-center text-lg bg-p-600 rounded-t-2xl py-6 mb-1 px-5 w-full shadow-lg text-white">
          <p class="font-medium">
            <span>
                {{ object?.objective?.name }}
            </span>
          </p>
          <div class="absolute left-1/2 -translate-x-1/2">
              <p class="text-[2em] text-white font-semibold text-np">
                {{`${object?.calories} kcal ` }}
              </p>
          </div>
          <p class="font-semibold ml-2" >{{ ` #${object?.id}`}}</p>
        </div>

      <div class="flex gap-3 items-center">
        <div class="flex gap-2 justify-center items-center">
            <IconSolid icon="fa-fire" color="text-red-500" sm />
            <span class="text-gray-600">{{ `${object?.calories} kcal` }}</span>
        </div> 
        <RestrictionsIconBar :items="object?.mealPlanDietaryRestrictions" />
        <RestrictionsIconBar :items="object?.objective ? [object.objective] : []" />
      </div>
      <WeekDaysBar v-model="selectedDay" class="my-2 px-2"/>
      <Menu :items="object?.mealPlanMeals" :selectedDay="selectedDay"  class="w-full px-8"/> 
    </div>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  object: { type: Object, required: true },
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] }
})

const selectedDay = ref('MON') 

const type = ref(false);

onMounted(() => {
  const dayOfWeek = new Date().getDay()
  const dayMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  selectedDay.value = dayMap[dayOfWeek]
})
</script>
