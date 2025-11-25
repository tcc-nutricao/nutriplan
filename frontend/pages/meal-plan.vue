<template>
  <div class="flex flex-col gap-3 px-10">
    <h1 class="h1">Plano Alimentar</h1>
    
    <div 
      v-if="actualPlan[0] && isPlanEmpty(actualPlan[0])" 
      class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-4"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ Seu plano está vazio
          </h3>
          <p class="text-yellow-700">
            Este plano ainda não possui refeições nem receitas configuradas. 
            Clique no botão ao lado para preencher automaticamente.
          </p>
        </div>
        <Button
          mediumPurple
          :disabled="isPopulating"
          @click="populatePlan(actualPlan[0].id)"
          class="ml-4"
        >
          {{ isPopulating ? 'Populando...' : '✨ Popular Plano' }}
        </Button>
      </div>
    </div>
    
    <div class="grid grid-cols-6 gap-5 w-full items-stretch">
      <MealPlanCardExtended :object="actualPlan[0]" class="col-span-4 mb-10" />
      <div class="col-span-2">
        <MealPlanCard title="Meus planos" :items="actualPlan" />
        <MealPlanCard title="Outros planos" :items="otherPlans" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { search } from '../crud'
import { useNuxtApp } from 'nuxt/app'

const { $axios } = useNuxtApp()

const actualPlan = ref([])
const otherPlans = ref([])
const limit = ref(null)
const page = ref(1)
const order = ref('asc')
const isPopulating = ref(false)

const loadItems = async () => {
  try {
    const response = await $axios.get('/get-patient-meal-plan')
    const result = response.data
    
    const activePlans = result.data.filter(item => item.status === 'ACTIVE')
    
    activePlans.sort((a, b) => {
      const aMeals = a.mealPlanMeals?.length || 0
      const bMeals = b.mealPlanMeals?.length || 0
      return bMeals - aMeals 
    })
    
    actualPlan.value = activePlans
    otherPlans.value = result.data.filter(item => item.status !== 'ACTIVE')
  } catch (error) {
    console.error('Erro ao carregar planos:', error)
    actualPlan.value = []
    otherPlans.value = []
  }
}

const isPlanEmpty = (plan) => {
  return !plan || !plan.mealPlanMeals || plan.mealPlanMeals.length === 0
}

const populatePlan = async (planId) => {
  if (!planId) {
    alert('ID do plano não encontrado')
    return
  }
  
  isPopulating.value = true
  
  try {
    const response = await $axios.post(`/meal-plan/${planId}/populate`)
    
    if (response.data.success) {
      alert('✅ Plano populado com sucesso! Recarregando...')
      await loadItems()
    } else {
      alert('Erro ao popular plano: ' + response.data.message)
    }
  } catch (error) {
    console.error('Erro ao popular plano:', error)
    alert('❌ Erro ao popular plano. Verifique o console para mais detalhes.')
  } finally {
    isPopulating.value = false
  }
}

onMounted(async () => {
  await loadItems()
})
</script>
