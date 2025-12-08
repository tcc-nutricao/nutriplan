<template>
  <Card style="padding: 0" class="p-0 border-2 border-p-600">
    <div class="flex flex-col gap-2 pb-5 w-full items-center">
        <div class="relative flex flex-col gap-3 items-center text-base bg-p-600 rounded-t-2xl py-4 mb-1 px-3 w-full shadow-lg text-white">
        <div class="w-full flex justify-center">
              <p class="text-3xl text-white font-semibold text-np">
                {{`${object?.calories} kcal ` }}
              </p>
          </div>
          <div class="flex justify-between w-full">
              <p class="font-medium">
                <span>
                    {{ object?.objective?.name }}
                </span>
              </p>
              <p class="font-semibold ml-2" >{{ ` #${object?.id}`}}</p>
          </div>
          <p class="text-xs text-start w-full text-white font-normal -my-1">
            {{ creatorText }}
          </p>
          
        </div>
        <div v-if="canEdit" class="flex gap-2 w-full px-3 mb-2">
             <Button
                mediumPurple
                class="rounded-full w-full h-10"
                label="Editar"
                icon="fa-solid fa-pen"
                @click="openEditModal"
             />
             <Button
                v-if="canEdit"
                red
                class="rounded-full w-full h-10"
                label="Excluir"
                icon="fa-solid fa-trash"
                @click="checkDelete"
             />
        </div>

      <div class="flex gap-3 items-center">
        <RestrictionsIconBar :items="object?.mealPlanDietaryRestrictions" />
      </div>
      <WeekDaysBar v-model="selectedDay" class="my-2 px-2"/>
      <Menu :items="object?.mealPlanMeals" :selectedDay="selectedDay"  class="w-full px-4"/> 
      <div class="w-full flex justify-center pt-5">
        <Button
          mediumPurple
          class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
          label="Gerar PDF"
          icon="fa-solid fa-file-pdf"
          @click="generatePDF"
          :loading="isGeneratingPDF"
        />
      </div>
    </div>

    <!-- Hidden PDF Template -->
    <div style="position: fixed; left: -9999px; top: 0; z-index: -1;">
        <div ref="pdfContent">
            <MealPlanPdfTemplate 
                v-if="object"
                :items="object.mealPlanMeals || []" 
                :plan-details="object"
                :creator-text="creatorText"
            />
        </div>
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

const ModalDanger = defineAsyncComponent(() => import('./ModalDanger.vue'))
const MealPlanCreate = defineAsyncComponent(() => import('./MealPlanCreate.vue')) // Assuming in same folder or check path
import MealPlanPdfTemplate from './MealPlanPdfTemplate.vue'

const isGeneratingPDF = ref(false);
const pdfContent = ref(null);

async function generatePDF() {
    isGeneratingPDF.value = true;
    try {
        const element = pdfContent.value;
        const filename = `${props.object?.objective?.name || 'Plano Alimentar'} - ${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;

        const opt = {
            margin: [0, 0],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
        isGeneratingPDF.value = false;
    }
}

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
