<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4" @click.self="close">
        <div class="bg-white rounded-3xl shadow-lg w-full max-w-2xl p-8 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
          
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-p-600">Gerenciar Plano Alimentar</h2>
            <button @click="close" class="text-gray-400 hover:text-gray-600 transition">
              <i class="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>

          <div class="flex flex-col gap-2">
            <p class="text-gray-600">Paciente: <span class="font-bold">{{ patient?.name }}</span></p>
            <p class="text-sm text-gray-500">Escolha uma das opções abaixo para definir o plano alimentar deste paciente.</p>
          </div>

          <div v-if="mode === 'selection'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              class="border-2 border-p-100 rounded-2xl p-6 flex flex-col items-center gap-4 cursor-pointer hover:border-p-500 hover:bg-p-50 transition group"
              @click="handleAutoGenerate"
            >
              <div class="w-16 h-16 rounded-full bg-p-100 flex items-center justify-center group-hover:bg-p-200 transition">
                <i class="fa-solid fa-wand-magic-sparkles text-2xl text-p-600"></i>
              </div>
              <h3 class="font-bold text-lg text-center">Criar Automaticamente</h3>
              <p class="text-center text-sm text-gray-500">
                Gera um plano baseado nos dados do paciente (peso, altura, objetivo).
              </p>
            </div>

            <div 
              class="border-2 border-p-100 rounded-2xl p-6 flex flex-col items-center gap-4 cursor-pointer hover:border-p-500 hover:bg-p-50 transition group"
              @click="mode = 'list'"
            >
              <div class="w-16 h-16 rounded-full bg-p-100 flex items-center justify-center group-hover:bg-p-200 transition">
                <i class="fa-solid fa-list-check text-2xl text-p-600"></i>
              </div>
              <h3 class="font-bold text-lg text-center">Selecionar Existente</h3>
              <p class="text-center text-sm text-gray-500">
                Escolha um dos seus planos alimentares já criados para atribuir a este paciente.
              </p>
            </div>
          </div>

          <div v-if="mode === 'list'" class="flex flex-col gap-4">
            <div class="flex items-center gap-2 mb-2">
              <button @click="mode = 'selection'" class="text-p-600 hover:underline text-sm">
                <i class="fa-solid fa-arrow-left mr-1"></i> Voltar
              </button>
              <h3 class="font-bold text-lg">Seus Planos Alimentares</h3>
            </div>

            <div v-if="loading" class="flex justify-center py-8">
              <i class="fa-solid fa-circle-notch fa-spin text-3xl text-p-600"></i>
            </div>

            <div v-else-if="plans.length === 0" class="text-center py-8 text-gray-500">
              Você ainda não criou nenhum plano alimentar.
            </div>

            <div v-else class="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
              <div 
                v-for="plan in plans" 
                :key="plan.id"
                class="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:border-p-500 transition cursor-pointer"
                :class="{'border-p-500 bg-p-50': selectedPlanId === plan.id}"
                @click="selectedPlanId = plan.id"
              >
                <div class="flex flex-col">
                  <span class="font-bold text-gray-800">
                    Plano para {{ plan.objective?.name }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ plan.calories }} kcal
                  </span>
                </div>
                <div v-if="selectedPlanId === plan.id" class="text-p-600">
                  <i class="fa-solid fa-check-circle text-xl"></i>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <Button 
                mediumPurple 
                label="Confirmar Seleção" 
                :disabled="!selectedPlanId"
                @click="handleAssignPlan"
              />
            </div>
          </div>

          <div v-if="mode === 'generating'" class="flex flex-col items-center justify-center py-10 gap-4">
            <i class="fa-solid fa-wand-magic-sparkles fa-spin text-4xl text-p-600"></i>
            <p class="text-lg font-semibold text-gray-700">Gerando plano alimentar...</p>
            <p class="text-sm text-gray-500">Isso pode levar alguns segundos.</p>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { get, insert } from '~/crud.js'

const props = defineProps({
  show: Boolean,
  patient: Object
})

const emit = defineEmits(['close', 'refresh'])

const mode = ref('selection')
const plans = ref([])
const loading = ref(false)
const selectedPlanId = ref(null)

const close = () => {
  emit('close')
  setTimeout(() => {
    mode.value = 'selection'
    selectedPlanId.value = null
  }, 300)
}

const fetchPlans = async () => {
  loading.value = true
  try {
    const response = await get('meal-plan')
    if (response.success) {
      plans.value = response.data
    }
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
  } finally {
    loading.value = false
  }
}

const handleAutoGenerate = async () => {
  mode.value = 'generating'
  try {
    const response = await insert('meal-plan/generate-auto', {
      patientId: props.patient.id
    })

    if (response.success) {
      emit('refresh')
      close()
    } else {
      alert('Erro ao gerar plano: ' + (response.message || 'Erro desconhecido'))
      mode.value = 'selection'
    }
  } catch (error) {
    console.error('Erro na geração automática:', error)
    alert('Erro ao gerar plano. Tente novamente.')
    mode.value = 'selection'
  }
}

const handleAssignPlan = async () => {
  if (!selectedPlanId.value) return

  try {
    const response = await insert(`meal-plan/${selectedPlanId.value}/assign`, {
      patientId: props.patient.id
    })

    if (response.success) {
      emit('refresh')
      close()
    } else {
      alert('Erro ao atribuir plano: ' + (response.message || 'Erro desconhecido'))
    }
  } catch (error) {
    console.error('Erro na atribuição:', error)
    alert('Erro ao atribuir plano. Tente novamente.')
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    fetchPlans()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
