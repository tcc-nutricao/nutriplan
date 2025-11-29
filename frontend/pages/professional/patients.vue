<template>
    <div class="px-5 md:px-10 flex flex-col gap-3 mt-6 md:mt-0">
        <h1 class="h1">Meus Pacientes</h1>
        <div class="flex flex-col md:flex-row gap-5 justify-between">
            <div class="flex flex-col w-full md:w-[40%] mb-8">
                <div class="search-sticky-wrapper md:static">
                <SearchBar 
                    :filter="true" 
                    :sort="true" 
                    placeholder="Pesquise um paciente" 
                    searchType="patients"
                    @searchSelected=""
                    class="w-full shadowSearch z-[200]" 
                />
                </div>
                <Button
                    mediumPurple
                    class="w-max px-3 h-[42px] mt-5"
                    icon="fa-solid fa-plus short flex justify-center"
                    label="Adicionar um paciente"
                    @click="openCreate"
                />
                <div class="flex flex-col gap-3 w-full mt-5">
                    <div 
                        v-for="(item, index) in itemList" 
                        :key="item.id" 
                        class="w-full flex flex-col gap-3"
                    >
                        <PatientButton
                            :name="item.name"
                            :objective="item.objective"
                            :height="item.height"
                            :weight="item.weight"
                            :lastUpdate="item.lastUpdate"
                            :is-selected="item.id === selectedItemId"
                            @selecionado="selectItem(item.id)"
                        />
                        <div 
                            v-if="selectedItemId === item.id" 
                            class="md:hidden flex flex-col gap-5 mt-3"
                        >
                            <div class="bg-white rounded-3xl shadow-lg border-2 p-8 flex flex-col gap-3">
                                <div class="flex justify-between">
                                    <div class="flex flex-col gap-2">
                                        <h2 class="text-3xl font-semibold text-p-600 leading-none">
                                            {{ item.name }}
                                        </h2>
                                        <p>{{ item.email }}</p>
                                    </div>
                                    <Button mediumPurple
                                        class="w-max pr-3 pl-2 h-[42px]"
                                        icon="fa-solid fa-edit short flex justify-center" 
                                        label="Editar"
                                        @click="openEdit"
                                    />
                                </div>
                                <div class="flex flex-col gap-3">
                                    <div class="flex justify-between">
                                        <p>Idade:</p>
                                        <p class="text-p-600 font-bold">{{ item.age }}</p>
                                    </div>
                                    <div class="flex justify-between">
                                        <p>Sexo:</p>
                                        <p class="text-p-600 font-bold">
                                            {{ item.gender === 'F' ? 'Feminino' : 'Masculino' }}
                                        </p>
                                    </div>
                                    <div class="flex justify-between">
                                        <p>Altura:</p>
                                        <p class="text-p-600 font-bold">{{ item.height }} cm</p>
                                    </div>
                                    <div class="flex justify-between">
                                        <p>Peso:</p>
                                        <p class="text-p-600 font-bold">{{ item.weight }} kg</p>
                                    </div>
                                    <div class="flex justify-between">
                                        <p>IMC:</p>
                                        <p class="text-p-600 font-bold">
                                            {{ imcCalc(item.height, item.weight) }}
                                        </p>
                                    </div>
                                    <div class="flex justify-between">
                                        <p>Objetivo:</p>
                                        <p class="text-p-600 font-bold">{{ item.objective }}</p>
                                    </div>
                                    <div>
                                        <p>Restrição alimentar:</p>
                                        <div class="flex flex-col">
                                            <p v-for="(r,i) in item.restrictions" :key="i" class="text-p-600 font-bold">
                                                {{ r }}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Preferências alimentares:</p>
                                        <div class="flex flex-col">
                                            <p v-for="(p,i) in item.preferences" :key="i" class="text-p-600 font-bold">
                                                {{ p }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <p>Última atualização:</p>
                                        <p class="text-p-600 font-bold">{{ item.lastUpdate }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-3xl shadow-lg border-2 p-7 flex flex-col gap-5">
                                <h2 class="h3">Plano alimentar</h2>
                                <div v-if="item.mealPlan">
                                    <PlanCard :object="item.mealPlan" />
                                </div>
                                <div v-else>
                                    <p class="text-gray-500">Sem plano alimentar vinculado.</p>
                                </div>
                            </div>
                            <div class="bg-white rounded-3xl shadow-lg border-2 p-7 flex flex-col gap-5">
                                <h2 class="h3">Receitas</h2>
                                <div class="w-full border-b-2 border-gray-200">
                                    <ReceitaButtonMini 
                                        v-for="r in recipesList"
                                        :key="r.id"
                                        :title="r.title"
                                        :categories="r.categories"
                                        :time="r.time"
                                        :portions="r.portions"
                                    />
                                </div>
                                <Button mediumPurple
                                    class="w-max pr-3 pl-2 h-[42px]"
                                    icon="fa-solid fa-plus short flex justify-center" 
                                    label="Incluir receita"
                                />
                            </div>
                            <p 
                                v-if="index < itemList.length - 1"
                                class="text-center text-gray-500 font-semibold mt-4"
                            >
                                Outros Pacientes
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div 
                v-if="selectedItem" 
                class="hidden md:flex w-[60%] mb-8 flex-col gap-5 stickyProfile"
            >
                <div class="bg-white rounded-3xl shadow-lg border-2 p-8 flex flex-col gap-3">
                    <div class="flex justify-between">
                        <div class="flex flex-col gap-2">
                            <h2 class="text-3xl font-semibold text-p-600 leading-none">
                                {{ selectedItem.name }}
                            </h2>
                            <p>{{ selectedItem.email }}</p>
                        </div>
                        <div class="flex gap-2">
                            <Button mediumPurple
                                class="w-max pr-3 pl-2 h-[42px]"
                                icon="fa-solid fa-edit short flex justify-center" 
                                label="Editar"
                                @click="openEdit"
                            />
                            <Button 
                                v-if="selectedItem.role === 'GUEST'"
                                red
                                class="w-max pr-3 pl-2 h-[42px]"
                                icon="fa-regular fa-trash-can short flex justify-center" 
                                label="Apagar"
                                @click="handleDelete" 
                            />
                            <Button 
                                v-else
                                red
                                class="w-max pr-3 pl-2 h-[42px]"
                                icon="fa-solid fa-link-slash short flex justify-center" 
                                label="Desvincular"
                                @click="handleDelete" 
                            />
                        </div>
                    </div>
                    <div class="flex justify-between w-full gap-10">
                        <div class="flex flex-col w-[40%] gap-3">
                            <div class="flex justify-between">
                                <p>Idade:</p>
                                <p class="text-p-600 font-bold">{{ selectedItem.age }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p>Sexo:</p>
                                <p class="text-p-600 font-bold">
                                    {{ selectedItem.gender === 'F' ? 'Feminino' : 'Masculino'}}
                                </p>
                            </div>
                            <div class="flex justify-between">
                                <p>Altura:</p>
                                <p class="text-p-600 font-bold">{{ selectedItem.height }} cm</p>
                            </div>
                            <div class="flex justify-between">
                                <p>Peso:</p>
                                <p class="text-p-600 font-bold">{{ selectedItem.weight }} kg</p>
                            </div>
                            <div class="flex justify-between">
                                <p>IMC:</p>
                                <p class="text-p-600 font-bold">
                                    {{ imcCalc(selectedItem.height, selectedItem.weight) }}
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col w-[50%] gap-3">
                            <div class="flex justify-between">
                                <p>Objetivo:</p>
                                <p class="text-p-600 font-bold">{{ selectedItem.objective }}</p>
                            </div>
                            <div>
                                <p>Restrição alimentar:</p>
                                <div class="flex flex-col">
                                    <p v-for="(r,i) in selectedItem.restrictions" :key="i" class="text-p-600 font-bold">
                                        {{ r }}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p>Preferências alimentares:</p>
                                <div class="flex flex-col">
                                    <p v-for="(p,i) in selectedItem.preferences" :key="i" class="text-p-600 font-bold">
                                        {{ p }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex justify-between">
                                <p>Última atualização:</p>
                                <p class="text-p-600 font-bold">{{ selectedItem.lastUpdate }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex w-full gap-5">
                    <div class="bg-white rounded-3xl w-[35%] shadow-lg border-2 p-7 flex flex-col gap-5 h-max">
                        <h2 class="h3">Plano alimentar</h2>
                        <div v-if="selectedItem.mealPlan">
                            <PlanCard :object="selectedItem.mealPlan" />
                            <Button mediumPurple
                                class="w-max pr-3 pl-2 h-[42px] mt-5"
                                icon="fa-solid fa-right-left short flex justify-center" 
                                label="Mudar plano"
                            />
                        </div>
                        <div v-else class="flex flex-col gap-3">
                            <p class="text-gray-500">Sem plano alimentar vinculado.</p>
                            <Button mediumPurple
                                class="w-max pr-3 pl-2 h-[42px]"
                                icon="fa-solid fa-plus short flex justify-center" 
                                label="Criar plano"
                            />
                        </div>
                    </div>
                    <div class="bg-white rounded-3xl w-[65%] shadow-lg border-2 p-7 flex flex-col gap-5">
                        <h2 class="h3">Receitas</h2>
                        <div class="w-full border-b-2 border-gray-200">
                            <ReceitaButtonMini 
                                v-for="item in recipesList"
                                :key="item.id"
                                :title="item.title"
                                :categories="item.categories"
                                :time="item.time"
                                :portions="item.portions"
                            />
                        </div>
                        <Button mediumPurple
                            class="w-max pr-3 pl-2 h-[42px]"
                            icon="fa-solid fa-plus short flex justify-center" 
                            label="Incluir receita"
                        />
                    </div>
                </div>
            </div>
            <div v-else class="hidden md:flex stickyProfile bg-white rounded-3xl shadow-lg border-2 p-6 py-20 w-[60%] items-center justify-center text-gray-500">
                <p>Selecione um paciente ao lado para ver os detalhes!</p>
            </div>
        </div>
        <PatientModal 
            v-if="showModal" 
            :section="showModal" 
            :patientData="selectedItem" 
            @close="handleModalClose" 
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { get, remove } from '~/crud.js'

const selectedItemId = ref(null)
const route = ref('nutritionist-patient')
const showModal = ref('')
const itemList = ref([])

const openCreate = () => {
    showModal.value = 'create'
}

const openEdit = () => {
    showModal.value = 'edit'
}

const recipesList = ref([
    { id: 1, title: 'Muffin de Banana Integral', categories: ['Perda de Peso','Sono','Antioxidante'], time: '15', portions: '2' },
    { id: 2, title: 'Salada Detox com Grão de Bico', categories: ['Energia','Perda de Peso','Saúde Intestinal'], time: '90', portions: '8' },
    { id: 3, title: 'Suco de Uva', categories: ['Leve','Doce','Fácil'], time: '2', portions: '1' },
])

const selectItem = (id) => {
    selectedItemId.value = id
}

const imcCalc = (height, weight) => {
    if (!height || !weight || typeof height !== 'number' || typeof weight !== 'number') {
        return 'Invalid input'
    }
    const heightM = height / 100
    const imcValue = (weight / (heightM * heightM)).toFixed(2)
    
    if (imcValue < 18.5) {
        return `${imcValue} (magreza)`
    } else if (imcValue < 25) {
        return `${imcValue} (normal)`
    } else if (imcValue < 30) {
        return `${imcValue} (sobrepeso)`
    } else if (imcValue < 40) {
        return `${imcValue} (obesidade)`
    } else {
        return `${imcValue} (obesidade grave)`
    }
}

const selectedItem = computed(() => {
    if (!selectedItemId.value) {
        return null
    }
    return itemList.value.find(item => item.id === selectedItemId.value)
})

onMounted(async () => {
    await fetchPatients()
})

const fetchPatients = async () => {
    const response = await get('patient/all')
    if (response.success && response.data) {
        itemList.value = response.data
    }
}

const handleModalClose = async (shouldRefresh) => {
    showModal.value = ''
    if (shouldRefresh) {
        await fetchPatients()
    }
}

const handleDelete = async () => {
    if (!selectedItem.value) return;

    const isGuest = selectedItem.value.role === 'GUEST';
    const message = isGuest 
        ? 'Tem certeza que deseja apagar este paciente? Todos os dados serão perdidos.' 
        : 'Tem certeza que deseja desvincular este paciente?';

    if (confirm(message)) {
        const response = await remove('patient', selectedItem.value.id);
        if (response.success) {
            // alert(response.message);
            selectedItemId.value = null;
            await fetchPatients();
        } else {
            alert('Erro ao excluir/desvincular paciente: ' + (response.message || 'Erro desconhecido'));
        }
    }
}
</script>

<style>
.stickyProfile {
    position: sticky;
    top: 30px;
    align-self: flex-start;
  }

  @keyframes fade-shadow {
    from { 
        box-shadow: 0 0 40px 40px rgba(246, 245, 253, 0),
        0 -90px 0 rgba(246, 245, 253, 0);
    }
    to { 
        box-shadow: 0 0 40px 40px rgba(246, 245, 253, 1),
        0 -90px 0 rgba(246, 245, 253, 1);
    }
  }
  
  .shadowSearch {
    background-color: #f6f5fd;

    animation: fade-shadow linear;

    animation-timeline: scroll();
    animation-range-start: 120px;
    animation-range-end: 200px;

    animation-fill-mode: forwards;
  }

  @media (max-width: 768px) {
  .search-sticky-wrapper {
    position: sticky;
    top: calc(var(--menu-height) + 25px);
    z-index: 500;
    background-color: #f6f5fd;
  }
}
</style>
