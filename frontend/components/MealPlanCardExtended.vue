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
          
          <div v-if="canEdit" class="absolute -bottom-5 right-5 z-[50] flex gap-2">
               <Button
                  mediumPurple
                  class="rounded-full w-10 h-10 border-2 border-white"
                  icon="fa-solid fa-pen"
                  @click="openEditModal"
               />
               <Button
                  v-if="canEdit"
                  red
                  class="rounded-full w-10 h-10 border-2 border-white"
                  icon="fa-solid fa-trash"
                  @click="checkDelete"
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

    <!-- Modals -->
    <teleport to="body">
       <Transition
                name="modal"
                appear
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                enter-active-class="transition-opacity duration-300 ease"
                leave-active-class="transition-opacity duration-300 ease"
            >
                <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1100]" @click.self="closeEditModal">
                    <div class="bg-white rounded-3xl py-7 px-9 w-full max-w-4xl shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-transform duration-300 ease">
                         <button
                            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-[50]"
                            @click="closeEditModal"
                        >&times;
                        </button>
                        <h2 class="text-2xl font-semibold text-np mb-4">Editar Plano Alimentar</h2>
                        <MealPlanCreate @close="closeEditModal" @save="handleSave" :planToEdit="object" />
                    </div>
                </div>
            </Transition>
    </teleport>

    <ModalDanger
       v-if="showDeleteModal"
       :title="deleteModalState.title"
       :content="deleteModalState.content"
       :showConfirm="deleteModalState.canDelete"
       btnLabel="Excluir"
        class="z-[1100]"
       @closeModal="showDeleteModal = false"
       @confirm="confirmDelete"
    />

  </Card>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { useNuxtApp } from 'nuxt/app'
const { $axios } = useNuxtApp()

// Async components to avoid circular deps if any
const ModalDanger = defineAsyncComponent(() => import('./ModalDanger.vue'))
const MealPlanCreate = defineAsyncComponent(() => import('./MealPlanCreate.vue')) // Assuming in same folder or check path

const props = defineProps({
  object: { type: Object, required: true },
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['refresh']) // Changed from edit/delete to refresh

import { useCookie } from 'nuxt/app'
const userCookie = useCookie('user-data')

// Edit State
const showEditModal = ref(false)

const openEditModal = () => {
    showEditModal.value = true
}

const closeEditModal = () => {
    showEditModal.value = false
}

const handleSave = () => {
    emit('refresh')
}

const showDeleteModal = ref(false)
const deleteModalState = ref({
    title: '',
    content: '',
    canDelete: true
})

const checkDelete = () => {
    const activePatients = props.object.mealPlanPatients ? props.object.mealPlanPatients.filter(p => p.status === 'ACTIVE').length : 0
    
    if (activePatients > 1){
        deleteModalState.value.title = 'Não é possível excluir'
        deleteModalState.value.content = `Este plano está atribuído a ${activePatients} pacientes. Para excluir, esse plano não pode estar atribuído a nenhum paciente.`
        deleteModalState.value.canDelete = false
    } else if (activePatients === 1) {
        deleteModalState.value.title = 'Não é possível excluir'
        deleteModalState.value.content = `Este plano está atribuído a um paciente. Para excluir, esse plano não pode estar atribuído a nenhum paciente.`
        deleteModalState.value.canDelete = false
    } else {
        deleteModalState.value.title = 'Excluir Plano Alimentar'
        deleteModalState.value.content = 'Tem certeza que deseja excluir este plano? Ele será deletado permanentemente'
        deleteModalState.value.canDelete = true
    }
    
    showDeleteModal.value = true
}

const confirmDelete = async () => {
    if (!deleteModalState.value.canDelete) return

    try {
        await $axios.delete(`/meal-plan/${props.object.id}`)
        showDeleteModal.value = false
        emit('refresh') 
    } catch (error) {
        console.error('Erro ao excluir plano:', error)
        alert(error.response?.data?.message || 'Erro ao excluir plano')
        showDeleteModal.value = false
    }
}

const canEdit = computed(() => {
  const user = userCookie.value
  if (!user || user.role !== 'PROFESSIONAL') return false

  const planNutritionistUserId = props.object?.nutricionist?.id_user;
  
  const userNutritionistId = user.id_nutritionist || user.nutritionist?.id
  if (userNutritionistId && props.object?.id_nutritionist === userNutritionistId) {
      return true
  }

  if (planNutritionistUserId && user.id === planNutritionistUserId) {
      return true
  }
  
  return false
})

const creatorText = computed(() => {
  if (props.object?.id_nutritionist === 1) {
    return 'Criado por: NUTRIPLAN'
  }
  const name = props.object?.nutricionist?.user?.name
  return `Criado por: ${name || 'Desconhecido'}`
})

const selectedDay = ref('MON') 

onMounted(() => {
  const dayOfWeek = new Date().getDay()
  const dayMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  selectedDay.value = dayMap[dayOfWeek]
})
</script>
