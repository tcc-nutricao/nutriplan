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
          
          <div v-if="canEdit" class="absolute -bottom-5 right-5 z-[50]">
               <Button
                  mediumPurple
                  class="rounded-full w-10 h-10 shadow-lg border-2 border-white"
                  icon="fa-solid fa-pen"
                  @click="$emit('edit', object)"
               />
          </div>
        </div>

      <p class="text-sm text-gray-500 font-normal -my-1">
        {{ creatorText }}
      </p>
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
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  object: { type: Object, required: true },
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['edit'])

import { useCookie } from 'nuxt/app'
const userCookie = useCookie('user-data')

const canEdit = computed(() => {
  const user = userCookie.value
  if (!user || user.role !== 'PROFESSIONAL') return false

  // Check if current user is the user linked to the plan's nutritionist
  const planNutritionistUserId = props.object?.nutricionist?.id_user;
  
  // Method 1: Check by Nutritionist ID (if available in cookie)
  const userNutritionistId = user.id_nutritionist || user.nutritionist?.id
  if (userNutritionistId && props.object?.id_nutritionist === userNutritionistId) {
      return true
  }

  // Method 2: Check by User ID (fallback)
  if (planNutritionistUserId && user.id === planNutritionistUserId) {
      return true
  }
  
  return false
})

const creatorText = computed(() => {
  // Console log to debug prop data
  if (props.object?.id_nutritionist === 1) {
    return 'Criado por: NUTRIPLAN'
  }
  const name = props.object?.nutricionist?.user?.name
  return `Criado por: ${name || 'Desconhecido'}`
})

const selectedDay = ref('MON') 

const type = ref(false);

onMounted(() => {
  const dayOfWeek = new Date().getDay()
  const dayMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  selectedDay.value = dayMap[dayOfWeek]
})
</script>
