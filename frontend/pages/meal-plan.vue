<template>
  <div class="flex flex-col w-full gap-6 px-5 md:px-10 mt-6 md:mt-0">
    <div class="flex justify-between items-center">
      <h1 class="h1">Plano Alimentar</h1>
    </div>
    <Button 
      v-if="canGenerateSelf" 
      @click="openGenerateModal" 
      :disabled="isGeneratingSelf"
      class="w-max pr-3 pl-2"
      icon="fa-solid fa-wand-magic-sparkles short flex justify-center"
      :label="isGeneratingSelf ? 'Gerando...' : 'Gerar novo plano'"
      mediumPurple
    />
    
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
    
    <div class="gap-5 w-full items-stretch">
      <MealPlanCardExtended v-if="actualPlan.length > 0" :object="actualPlan[0]" class="hidden md:flex mb-10 w-[60%]" />
      <MealPlanCardMobile v-if="actualPlan.length > 0" :object="actualPlan[0]" class="md:hidden mb-10" />
      <!-- <div class="col-span-2">
        <MealPlanCard title="Meus planos" :items="actualPlan" />
        <MealPlanCard title="Outros planos" :items="otherPlans" />
      </div> -->
    </div>

    
    <Modal
      v-if="showGenerateModal"
      title="Gerar novo plano?"
      content="Ao gerar um novo plano alimentar, o plano atual será arquivado."
      btnLabel="Gerar"
      text="A geração automática de planos usa seus dados de peso, altura, idade, gênero e objetivo, além de respeitar suas restrições alimentares, criando um plano customizado para você com as receitas do sistema."
      @confirm="confirmGeneratePlan"
      @closeModal="showGenerateModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { search } from '../crud'
import { useNuxtApp } from 'nuxt/app'

const ModalDanger = defineAsyncComponent(() => import('../components/ModalDanger.vue'))
const { $axios } = useNuxtApp()

const actualPlan = ref([])
const otherPlans = ref([])
const limit = ref(null)
const page = ref(1)
const order = ref('asc')
const isPopulating = ref(false)
const isGeneratingSelf = ref(false)
const canGenerateSelf = ref(false)

const checkPermission = async () => {
  try {
    const response = await $axios.get('/profile')
    const patient = response.data.data
    if (patient && !patient.id_nutritionist) {
      canGenerateSelf.value = true
    }
  } catch (error) {
    console.error('Erro ao verificar permissões:', error)
  }
}


const showGenerateModal = ref(false)

const openGenerateModal = () => {
  showGenerateModal.value = true
}

const confirmGeneratePlan = async () => {
  showGenerateModal.value = false
  isGeneratingSelf.value = true
  try {
    const response = await $axios.post('/meal-plan/generate-self')
    if (response.data.success) {
      await loadItems()
    } else {
      alert('Erro ao gerar plano: ' + response.data.message)
    }
  } catch (error) {
    console.error('Erro ao gerar plano self-service:', error)
    alert('❌ Erro ao gerar plano. ' + (error.response?.data?.message || ''))
  } finally {
    isGeneratingSelf.value = false
  }
}

const loadItems = async () => {
  try {
    const response = await $axios.get('/get-patient-meal-plan')
    const result = response.data
    
    console.log('DEBUG: API /get-patient-meal-plan response:', result) // DEBUG LOG

    if (result.data) {
        // Filter for ACTIVE
        const activePlans = result.data.filter(item => {
             const status = item.mealPlanPatients?.[0]?.status
             // console.log(`Plan ${item.id} status:`, status) 
             return status === 'ACTIVE'
        })
        
        console.log('DEBUG: Active Plans found:', activePlans.length) // DEBUG LOG
        
        activePlans.sort((a, b) => {
          const aMeals = a.mealPlanMeals?.length || 0
          const bMeals = b.mealPlanMeals?.length || 0
          if (bMeals === aMeals) {
             return new Date(b.created_at) - new Date(a.created_at)
          }
          return bMeals - aMeals 
        })
        
        actualPlan.value = activePlans.map(transformPlan)
        console.log('DEBUG: actualPlan:', actualPlan.value) // DEBUG LOG

        otherPlans.value = result.data.filter(item => item.mealPlanPatients?.[0]?.status !== 'ACTIVE').map(transformPlan)
    }
  } catch (error) {
    console.error('Erro ao carregar planos:', error)
    actualPlan.value = []
    otherPlans.value = []
  }
}

const transformPlan = (plan) => {
  return {
    ...plan,
    dietaryRestrictions: plan.mealPlanDietaryRestrictions || [],
    goalObjectives: plan.goal?.goalObjectives || []
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
      // alert('✅ Plano populado com sucesso! Recarregando...')
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
  await Promise.all([
    loadItems(),
    checkPermission()
  ])
})
</script>
