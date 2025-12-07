<template>
    <div class="px-10 flex flex-col gap-3">
        <h1 class="h1">Planos Alimentares</h1>
        <div class="flex flex-row gap-5 justify-between">
             <div class="flex flex-col w-full mb-8">
                 <div class="flex justify-center gap-5 items-center w-full">
                    <Button
                        mediumPurple
                        class="w-max px-3 h-[42px] text-nowrap"
                        icon="fa-solid fa-plus short flex justify-center"
                        label="Criar plano alimentar"
                        @click="openCreateModal"
                    />
                    <SearchBar
                        :filter="true"
                        :sort="true"
                        searchType="meal-plans"
                        placeholder="Pesquise um plano"
                        class="w-[40%] shadowSearch z-[200]"
                        noSearch
                    />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 w-max">
                    <div v-for="plan in mealPlans" :key="plan.id" class="cursor-pointer" @click="openViewModal(plan)">
                        <PlanCard :object="plan" class="hover:scale-[102%] transition active:scale-[98%] w-max" />
                    </div>
                </div>
                <h2 v-if="mealPlans.length === 0"  class="text-[1.4em]">Nenhum plano encontrado. <span class="font-bold text-np cursor-pointer hover:underline hover:text-p-500 " @click="openCreateModal">Crie um aqui!</span></h2>
             </div>
        </div>

        <!-- View Modal -->
        <teleport to="body">
            <Transition
                name="modal"
                appear
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                enter-active-class="transition-opacity duration-300 ease"
                leave-active-class="transition-opacity duration-300 ease"
            >
                <div v-if="showViewModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]" @click.self="closeViewModal">
                    <div class="bg-white rounded-3xl pb-8 pt-12 px-9 w-full max-w-4xl shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-transform duration-300 ease">
                         <button
                            class="absolute top-5 right-7 text-3xl text-gray-500 shadow-lg hover:text-danger hover:scale-110 transition z-[50]"
                            @click="closeViewModal"
                        >&times;
                        </button>
                        <MealPlanCardExtended v-if="selectedPlan" :object="selectedPlan" @refresh="handleRefresh" />
                    </div>
                </div>
            </Transition>
        </teleport>

        <!-- Create Modal -->
         <teleport to="body">
            <Transition
                name="modal"
                appear
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                enter-active-class="transition-opacity duration-300 ease"
                leave-active-class="transition-opacity duration-300 ease"
            >
                <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1100]" @click.self="closeCreateModal">
                    <div class="bg-white rounded-3xl py-7 px-9 w-full max-w-4xl shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-transform duration-300 ease">
                         <button
                            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-[50]"
                            @click="closeCreateModal"
                        >&times;
                        </button>
                        <h2 class="text-2xl font-semibold text-np mb-4">Criar Plano Alimentar</h2>
                        <MealPlanCreate @close="closeCreateModal" @save="loadItems" />
                    </div>
                </div>
            </Transition>
        </teleport>

    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { get } from '../../crud'
import { useNuxtApp } from 'nuxt/app'

// Note: ModalDanger is no longer needed here as it's inside MealPlanCardExtended
const { $axios } = useNuxtApp()

const showViewModal = ref(false)
const showCreateModal = ref(false)
const selectedPlan = ref(null)
// const selectedPlanForEdit = ref(null) // Removed
const mealPlans = ref([])

const loadItems = async () => {
    try {
        const res = await get('meal-plan')
        const rawPlans = res.data || []
        mealPlans.value = rawPlans.map(transformPlan)
    } catch (error) {
        console.error('Erro ao carregar planos:', error)
    }
}

const transformPlan = (plan) => {
  return {
    ...plan,
    dietaryRestrictions: plan.mealPlanDietaryRestrictions || [],
    objective: plan.objective
  }
}

onMounted(() => {
    loadItems()
})

const openViewModal = (plan) => {
    selectedPlan.value = plan
    showViewModal.value = true
}

const closeViewModal = () => {
    showViewModal.value = false
    selectedPlan.value = null
}

const openCreateModal = () => {
    showCreateModal.value = true
}

const closeCreateModal = () => {
    showCreateModal.value = false
}

const handleRefresh = () => {
    closeViewModal()
    loadItems()
}


</script>

<style>
.shadowSearch {
    background-color: #f6f5fd;
}
</style>