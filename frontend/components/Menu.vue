<template>
  <div class="flex flex-col gap-6">
    <div
      v-for="(mealOfPlan, index) in filteredMeals"
      :key="index"
      class="flex flex-col gap-2"
    >
      <h2 class="text-lg font-semibold text-t uppercase">
        {{ mealOfPlan.meal?.name || 'Refeição' }}
      </h2>
      
      <div v-if="mealOfPlan.mealPlanRecipes && mealOfPlan.mealPlanRecipes.length > 0" class="flex flex-col gap-3">
        <div
          v-for="(mealPlanRecipe, index2) in mealOfPlan.mealPlanRecipes"
          :key="index2"
          class="bg-p-100 rounded-lg px-3 py-2 flex items-center justify-between"
        >
          <h3 class="font-medium text-p-700">
            {{ mealPlanRecipe.recipe?.name || 'Receita' }}
            <span class="text-sm text-gray-500 font-normal ml-1" v-if="mealPlanRecipe.recipe?.calories">
              ({{ Math.round(mealPlanRecipe.recipe.calories) }} kcal)
            </span>
          </h3>
          <Button mediumPurple
            class="w-min px-0 h-[36px]"
            icon="fa-solid fa-eye short flex justify-center"
            @click="openRecipeModal(mealPlanRecipe.recipe)"
          />
        </div>
      </div>
      
      <p v-else class="text-gray-400 italic text-sm">Nenhuma receita planejada para esta refeição</p>
    </div>
    
    <p v-if="filteredMeals.length === 0" class="text-center text-gray-400 py-8">
      Nenhuma refeição planejada para este dia
    </p>
    
    <!-- Modal de receita -->
    <RecipeModal
      v-if="selectedRecipe"
      :recipe="selectedRecipe"
      @close="closeRecipeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  selectedDay: { type: String, default: 'MON' }
})

const selectedRecipe = ref(null)

const filteredMeals = computed(() => {
  if (!props.items || props.items.length === 0) return []
  return props.items.filter(meal => meal.day === props.selectedDay)
})

const openRecipeModal = (recipe) => {
  selectedRecipe.value = recipe
}

const closeRecipeModal = () => {
  selectedRecipe.value = null
}
</script>