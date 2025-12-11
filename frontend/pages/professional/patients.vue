<template>
    <div class="px-5 md:px-10 flex flex-col gap-3 mt-6 md:mt-0">
        <!-- Hidden PDF Template -->
        <div style="position: fixed; left: -9999px; top: 0; z-index: -1;">
            <div ref="pdfContent">
                <ProgressPdfTemplate 
                    v-if="selectedItem"
                    :items="pdfItems" 
                    :progress="selectedItem.progress || []"
                    :chart-data="pdfChartData"
                    :chart-options="pdfChartOptions"
                />
            </div>
        </div>
        <h1 class="h1">Meus Pacientes</h1>
        <div class="flex flex-col md:flex-row gap-5 justify-between">
            <div class="flex flex-col w-full md:w-[40%] mb-8">
                <div class="search-sticky-wrapper md:static flex w-full gap-3">
                    <SearchBar 
                        :filter="false" 
                        :sort="false" 
                        placeholder="Pesquise um paciente" 
                        searchType="patients"
                        @searchSelected="handleSearchSelection"
                        class="w-full shadowSearch z-[200]" 
                    />
                </div>
                <div class="flex mt-3 gap-3 w-full sm:w-max">
                    <Button
                        mediumPurple
                        class="px-3 h-[42px] text-nowrap w-full sm:w-max"
                        icon="fa-solid fa-plus short flex justify-center"
                        label="Adicionar"
                        @click="openCreate"
                    />
                    <Button
                        mediumPurple
                        class="px-3 h-[42px] text-nowrap w-full sm:w-max"
                        icon="fa-solid fa-key short flex justify-center"
                        label="Código"
                        @click="fetchInviteCode"
                    />
                </div>
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
                            :ref="el => { if (selectedItemId === item.id) patientCard = el }"
                        >
                            <div class="bg-white rounded-3xl shadow-lg border-2 p-8 flex flex-col gap-3">
                                <div class="flex justify-between">
                                    <div class="flex flex-col gap-2">
                                        <h2 class="text-3xl font-semibold text-p-600 leading-none">
                                            {{ item.name }}
                                        </h2>
                                        <p>{{ item.email }}</p>
                                        <div class="flex flex-wrap gap-2 mt-1">
                                            <Button 
                                                v-if="!item.email"
                                                mediumPurple
                                                class="w-max h-[42px]"
                                                icon="fa-solid fa-envelope short flex justify-center" 
                                                label="Convidar"
                                                @click="openInviteModal(item)"
                                            />
                                            <Button mediumPurple
                                                class="w-max h-[42px]"
                                                icon="fa-solid fa-edit short flex justify-center" 
                                                label="Editar"
                                                @click="openEdit"
                                            />
                                            <Button 
                                                v-if="selectedItem.role === 'GUEST'"
                                                red
                                                class="w-max h-[42px]"
                                                icon="fa-regular fa-trash-can short flex justify-center" 
                                                label="Apagar"
                                                @click="openDeleteModal" 
                                            />
                                            <Button 
                                                v-else
                                                red
                                                class="w-max h-[42px]"
                                                icon="fa-solid fa-link-slash short flex justify-center" 
                                                label="Desvincular"
                                                @click="openUnlinkModal" 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-3">
                                    <div class="flex justify-between">
                                        <p>Idade:</p>
                                        <p class="text-p-600 font-bold">{{ item.age }}</p>
                                    </div>
                                    <div class="flex justify-between">
                                        <p>Sexo:</p>
                                        <p class="text-p-600 font-bold">
                                            {{ item.gender === 'FEM' ? 'Feminino' : item.gender === 'MASC' ? 'Masculino' : 'Não informado' }}
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
                                    <div class="flex justify-between">
                                        <p>Restrição alimentar:</p>
                                        <div class="flex flex-col">
                                            <p v-for="(r,i) in item.restrictions" :key="i" class="text-p-600 font-bold">
                                                {{ r }}
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
                                <div v-if="item.mealPlan" class="flex flex-col gap-4 items-center">
                                <PlanCard 
                                    :object="item.mealPlan"
                                />
                                <Button mediumPurple
                                    class="w-max pr-3 pl-2 h-[42px]"
                                    icon="fa-solid fa-right-left short flex justify-center"
                                    label="Mudar plano"
                                    @click="openMealPlanManager"
                                />
                                </div>
                                <div v-else class="flex flex-col gap-4 items-center">
                                    <p class="text-gray-500">Sem plano alimentar vinculado.</p>
                                    <Button mediumPurple
                                        class="w-max pr-3 pl-2 h-[42px]"
                                        icon="fa-solid fa-plus short flex justify-center"
                                        label="Adicionar plano"
                                        @click="openMealPlanManager"
                                    />
                                </div>
                            </div>
                            <!-- Weight Update Card Mobile -->
                            <div class="bg-white rounded-3xl shadow-lg border-2 p-7 flex flex-col gap-5">
                                <h2 class="h3">Atualizar Peso</h2>
                                <div class="grid grid-rows-2 gap-2">
                                    <Input
                                        class="bg-white shadow-lg shadow-gray-600/10 focus-within:shadow-p-600/20 hover:shadow-p-600/20 transition"
                                        label="newWeightMobile"
                                        v-model="newWeight"
                                        placeholder="Novo peso (kg)"
                                        type="number"
                                        @keyup.enter="updatePatientWeight"
                                    />
                                    <Button
                                        mediumPurple
                                        class="h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition text-sm sm:text-base"
                                        label="Atualizar"
                                        @click="updatePatientWeight"
                                    />
                                </div>
                            </div>
                            <!-- Progress Card Mobile -->
                            <ProgressCard 
                                :patient="item" 
                                :dataList="item.role === 'GUEST'"
                                @refresh="fetchPatients"
                                @pdf="generatePDF"
                            />
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
                <div class="bg-white rounded-3xl shadow-lg border-2 p-8 flex flex-col gap-3 min-w-0">
                    <div class="flex justify-between min-w-0 gap-3 flex-wrap">
                        <div class="flex flex-col gap-2 min-w-0">
                            <h2 class="text-3xl font-semibold text-p-600 leading-none break-words">
                                {{ selectedItem.name }}
                            </h2>
                            <p class="break-all">{{ selectedItem.email }}</p>
                        </div>
                        <div class="flex gap-2 flex-wrap">
                            <Button 
                                v-if="!selectedItem.email"
                                mediumPurple
                                class="max-w-full pr-3 pl-2 h-[42px]"
                                icon="fa-solid fa-envelope short flex justify-center" 
                                label="Convidar"
                                @click="openInviteModal(selectedItem)"
                            />
                            <Button mediumPurple
                                class="max-w-full pr-3 pl-2 h-[42px]"
                                icon="fa-solid fa-edit short flex justify-center" 
                                label="Editar"
                                @click="openEdit"
                            />
                            <Button 
                                v-if="selectedItem.role === 'GUEST'"
                                red
                                class="max-w-full pr-3 pl-2 h-[42px]"
                                icon="fa-regular fa-trash-can short flex justify-center" 
                                label="Apagar"
                                @click="openDeleteModal" 
                            />
                            <Button 
                                v-else
                                red
                                class="max-w-full pr-3 pl-2 h-[42px]"
                                icon="fa-solid fa-link-slash short flex justify-center" 
                                label="Desvincular"
                                @click="openUnlinkModal" 
                            />
                        </div>
                    </div>
                    <div class="flex justify-between w-full gap-10 flex-wrap min-w-0">
                        <div class="flex flex-col flex-1 min-w-[260px] gap-3">
                            <div class="flex justify-between">
                                <p>Idade:</p>
                                <p class="text-p-600 font-bold">{{ selectedItem.age }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p>Sexo:</p>
                                <p class="text-p-600 font-bold">
                                    {{ selectedItem.gender === 'FEM' ? 'Feminino' : selectedItem.gender === 'MASC' ? 'Masculino' : 'Não informado' }}
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
                        <div class="flex flex-col flex-1 min-w-[260px] gap-3">
                            <div class="flex justify-between">
                                <p>Objetivo:</p>
                                <p class="text-p-600 font-bold">{{ selectedItem.objective }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p>Restrições alimentares:</p>
                                <div class="flex flex-col">
                                    <p v-for="(r,i) in selectedItem.restrictions" :key="i" class="text-p-600 font-bold">
                                        {{ r }}
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
                    <div class="flex flex-col w-[35%] min-w-[250px]">
                        <div class="bg-white rounded-3xl shadow-lg border-2 p-7 flex flex-col gap-5 h-max"> 
                            <h2 class="h3">Plano alimentar</h2> 
                            <div v-if="selectedItem.mealPlan" class="flex flex-col gap-3 items-center justify-center"> 
                                <div @click="openViewModal(selectedItem.mealPlan)" class="cursor-pointer hover:scale-[102%] transition active:scale-[98%] w-max"> 
                                    <PlanCard 
                                        :object="selectedItem.mealPlan" 
                                    /> 
                                </div> 
                                <Button mediumPurple 
                                    class="pr-3 pl-2 h-[42px] mt-5" 
                                    icon="fa-solid fa-right-left short flex justify-center" 
                                    label="Mudar plano" 
                                    @click="openMealPlanManager" 
                                /> 
                            </div> 
                            <div v-else class="flex flex-col gap-3 items-center justify-between"> 
                                <p class="text-gray-500 text-center">Sem plano alimentar vinculado.</p> 
                                    <Button mediumPurple 
                                    class="w-max pr-3 pl-2 h-[42px]" 
                                    icon="fa-solid fa-plus short flex justify-center" 
                                    label="Adicionar plano" 
                                    @click="openMealPlanManager" 
                                /> 
                            </div> 
                        </div>
                        <!-- Weight Update Card Desktop -->
                        <div class="bg-white rounded-3xl shadow-lg border-2 p-7 flex flex-col gap-5 mt-5">
                            <h2 class="h3">Atualizar Peso</h2>
                            <div class="grid grid-rows-2 gap-2">
                                <Input
                                    class="bg-white shadow-lg shadow-gray-600/10 focus-within:shadow-p-600/20 hover:shadow-p-600/20 transition"
                                    label="newWeightDesktop"
                                    v-model="newWeight"
                                    placeholder="Novo peso (kg)"
                                    type="number"
                                    @keyup.enter="updatePatientWeight"
                                />
                                <Button
                                    mediumPurple
                                    class="h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition text-sm sm:text-base"
                                    label="Atualizar"
                                    @click="updatePatientWeight"
                                />
                            </div>
                        </div>
                    </div>
                    <!-- Progress Card Desktop -->
                    <div class="w-[65%]">
                        <ProgressCard 
                            :patient="selectedItem" 
                            @refresh="fetchPatients"
                            @pdf="generatePDF"
                        />
                    </div>
                </div>
            </div>
            <div v-else class="hidden md:flex stickyProfile bg-white rounded-3xl shadow-lg border-2 p-6 py-20 w-[60%] items-center justify-center text-gray-500 flex-col gap-4">
                <div v-if="loading" class="flex flex-col items-center gap-2">
                     <i class="fa-solid fa-circle-notch fa-spin text-4xl text-p-600"></i>
                     <p>Carregando pacientes...</p>
                </div>
                <div v-else-if="itemList.length === 0" class="flex flex-col items-center gap-2">
                     <i class="fa-solid fa-user-slash text-4xl text-gray-300"></i>
                     <p>Nenhum paciente encontrado.</p>
                </div>
                <p v-else>Selecione um paciente ao lado para ver os detalhes!</p>
            </div>
        </div>
        <PatientModal 
            v-if="showModal && showModal !== 'mealPlanManager' && showModal !== 'unlink' && showModal !== 'delete'" 
            :section="showModal" 
            :patientData="selectedItem" 
            @close="handleModalClose" 
        />
        <MealPlanManagerModal
            :show="showModal === 'mealPlanManager'"
            :patient="selectedItem"
            @close="showModal = ''"
            @refresh="fetchPatients"
        />

        <!-- Invite Code Modal -->
        <teleport to="body">
            <Transition
                name="modal"
                appear
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                enter-active-class="transition-opacity duration-300 ease"
                leave-active-class="transition-opacity duration-300 ease"
            >
                <div v-if="showInviteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] p-4" @click.self="showInviteModal = false">
                    <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg relative flex flex-col gap-5 items-center">
                         <button
                            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-[50]"
                            @click="showInviteModal = false"
                        >&times;
                        </button>
                        <h2 class="text-2xl font-semibold text-p-600">Código de Vínculo</h2>
                        <p class="text-center text-gray-600">Compartilhe este código com seu paciente para que ele possa se vincular a você.</p>
                        
                        <div class="bg-gray-100 p-6 rounded-xl w-full flex justify-center items-center border-2 border-dashed border-p-400 relative">
                            <span class="text-5xl font-bold text-p-700 tracking-widest">{{ inviteCode }}</span>
                            <div class="absolute -bottom-3 -right-3">
                                <Button
                                    mediumPurple
                                    class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"
                                    icon="fa-solid fa-rotate-right"
                                    @click="regenerateInviteCode"
                                    :loading="loading"
                                />
                            </div>
                        </div>

                        <p class="text-sm text-gray-500" v-if="inviteCodeExpiresAt">Válido até: {{ new Date(inviteCodeExpiresAt).toLocaleTimeString() }}</p>
                        
                        <Button mediumPurple
                            class="w-full h-[42px]"
                            icon="fa-regular fa-copy short flex justify-center"
                            label="Copiar e fechar"
                            @click="copyAndClose"
                        />
                    </div>
                </div>
            </Transition>
        </teleport>

        <!-- Invite Patient Modal -->
        <teleport to="body">
            <Transition
                name="modal"
                appear
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                enter-active-class="transition-opacity duration-300 ease"
                leave-active-class="transition-opacity duration-300 ease"
            >
                <div v-if="showInvitePatientModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] p-4" @click.self="showInvitePatientModal = false">
                    <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg relative flex flex-col gap-5 items-center">
                         <button
                            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-[50]"
                            @click="showInvitePatientModal = false"
                        >&times;
                        </button>
                        <h2 class="text-2xl font-semibold text-p-600">Convidar Paciente</h2>
                        <p class="text-center text-gray-600">Insira o email do paciente para enviar um convite de acesso.</p>
                        
                        <Input
                            class="w-full"
                            label="Email"
                            v-model="inviteEmail"
                            placeholder="email@exemplo.com"
                            type="email"
                        />
                        
                        <Button mediumPurple
                            class="w-full h-[42px]"
                            label="Enviar Convite"
                            @click="sendInvite"
                            :loading="sendingInvite"
                        />
                    </div>
                </div>
            </Transition>
        </teleport>

        <!-- View Meal Plan Modal -->
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
                            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-[50]"
                            @click="closeViewModal"
                        >&times;
                        </button>
                        <MealPlanCardExtended v-if="selectedPlan" :object="selectedPlan" @refresh="handlePlanRefresh" />
                    </div>
                </div>
            </Transition>
        </teleport>
        <ModalDanger
            v-if="showModal == 'delete'"
            title="Tem certeza?"
            content="Ao apagar este paciente, todos os dados serão deletados permanentemente."
            btnLabel="Apagar"
            @confirm="handleDelete"
            @closeModal="closeModal"
        />
        <ModalDanger
            v-if="showModal == 'unlink'"
            title="Desvincular paciente?"
            content="Ao desvincular, você não terá mais acesso aos dados do paciente."
            btnLabel="Desvincular"
            @confirm="handleDelete"
            @closeModal="closeModal"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { get, remove, insert } from '~/crud.js'
import ProgressPdfTemplate from '~/components/ProgressPdfTemplate.vue';

const isGeneratingPDF = ref(false);
const pdfContent = ref(null);

const pdfItems = computed(() => {
    if (!selectedItem.value) return {};
    
    const p = selectedItem.value;
    const prog = p.progress || []; // Ascending order (oldest first) based on extraction
    const initial = prog.length > 0 ? prog[0].weight : p.weight;
    const current = p.weight;
    const target = p.target_weight;
    
    let metaAchieved = 0;
    if (target && initial !== current) {
         const totalDiff = Math.abs(initial - target);
         const currentDiff = Math.abs(initial - current);
         metaAchieved = Math.min(100, Math.round((currentDiff / totalDiff) * 100));
    }

    // Calculate IMC number for the template
    const heightM = p.height / 100;
    const imc = (current / (heightM * heightM)).toFixed(2);

    return {
        patientName: p.name,
        objective: p.objective,
        metaAchieved: metaAchieved,
        initialWeight: initial,
        actualWeight: current,
        imc: imc,
        targetWeight: target
    };
});

const pdfChartData = computed(() => {
    if (!selectedItem.value || !selectedItem.value.progress || selectedItem.value.progress.length === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'Peso (kg)',
                borderColor: '#cec2f0',
                fill: false,
                data: [],
                pointStyle: 'circle',
                pointRadius: 6,
                pointBackgroundColor: '#9b78da',
                pointBorderWidth: 2,
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                tension: 0.4,
            }]
        };
    }

    const labels = selectedItem.value.progress.map(registro => {
        const data = new Date(registro.date);
        return data.toLocaleDateString('pt-BR', { month: 'long' });
    });
    
    const data = selectedItem.value.progress.map(registro => registro.weight);

    return {
        labels: labels,
        datasets: [{
            label: 'Peso (kg)',
            borderColor: '#cec2f0',
            fill: false,
            data: data,
            pointStyle: 'circle',
            pointRadius: 6,
            pointBackgroundColor: '#9b78da',
            pointBorderWidth: 2,
            pointBorderColor: '#fff',
            pointHoverRadius: 8,
            tension: 0.4,
        }],
    };
});

const pdfChartOptions = computed(() => {
    if (!selectedItem.value || !selectedItem.value.progress || selectedItem.value.progress.length === 0) {
        return {
            responsive: true,
            maintainAspectRatio: false,
        };
    }
    const weights = selectedItem.value.progress.map(progressItem => progressItem.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const padding = 2;
    const targetWeight = selectedItem.value.target_weight || 70;

    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                suggestedMin: (minWeight > targetWeight ? targetWeight - padding : minWeight - padding),
                suggestedMax: maxWeight + padding,
            },
            x: {
                offset: true,
                grid: {
                    display: false
                },
            }
        },
        plugins: {
            legend: {     
                display: false
            }, 
            annotation: {
                annotations: {
                    metaLine: {
                        type: 'line',
                        yMin: targetWeight,
                        yMax: targetWeight,
                        borderColor: '#9b78da',
                        borderWidth: 2,
                        borderDash: [6, 6],
                    }
                }
            }
        },
    };
});

async function generatePDF() {
    if (!selectedItem.value) return;
    isGeneratingPDF.value = true;
    try {
        const element = pdfContent.value;

        const patientName = selectedItem.value.name || 'Paciente';
        const firstName = patientName.split(' ')[0];
        const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        const filename = `${firstName} - ${date}.pdf`;

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

const selectedItemId = ref(null)
const route = ref('nutritionist-patient')
const showModal = ref('')
const itemList = ref([])
const newWeight = ref(null)
const loading = ref(true)

const inviteCode = ref(null)
const inviteCodeExpiresAt = ref(null)
const showInviteModal = ref(false)

const showInvitePatientModal = ref(false)
const inviteEmail = ref('')
const sendingInvite = ref(false)
const patientToInvite = ref(null)

const showViewModal = ref(false)
const selectedPlan = ref(null)

const openViewModal = (plan) => {
    selectedPlan.value = plan
    showViewModal.value = true
}

const closeViewModal = () => {
    showViewModal.value = false
    selectedPlan.value = null
}

const handlePlanRefresh = () => {
    closeViewModal()
    fetchPatients()
}

const openDeleteModal = () => {
    showModal.value = "delete";
};
const openUnlinkModal = () => {
    showModal.value = "unlink";
};

const closeModal = () => {
    showModal.value = "";
}; 

const openCreate = () => {
    showModal.value = 'create-offline'
}

const openEdit = () => {
    showModal.value = 'edit'
}

const fetchInviteCode = async () => {
    loading.value = true
    try {
        const res = await get('nutritionist/invite-code')
        if (res.success) {
            inviteCode.value = res.data.code
            inviteCodeExpiresAt.value = res.data.expiresAt
            showInviteModal.value = true
        } else {
            alert('Erro ao buscar código: ' + (res.message || 'Erro desconhecido'))
        }
    } catch (error) {
        console.error(error)
        alert('Erro ao buscar código')
    } finally {
        loading.value = false
    }
}

const regenerateInviteCode = async () => {
    loading.value = true
    try {
        const res = await insert('nutritionist/invite-code', {})
        if (res.success) {
            inviteCode.value = res.data.code
            inviteCodeExpiresAt.value = res.data.expiresAt
        } else {
            alert('Erro ao gerar código: ' + (res.message || 'Erro desconhecido'))
        }
    } catch (error) {
        console.error(error)
        alert('Erro ao gerar código')
    } finally {
        loading.value = false
    }
}

const copyAndClose = async () => {
    if (inviteCode.value) {
        try {
            await navigator.clipboard.writeText(inviteCode.value)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }
    showInviteModal.value = false
}

const openInviteModal = (patient) => {
    patientToInvite.value = patient
    inviteEmail.value = ''
    showInvitePatientModal.value = true
}

const sendInvite = async () => {
    if (!inviteEmail.value) {
        alert('Por favor, insira um email.')
        return
    }
    
    sendingInvite.value = true
    try {
        const res = await insert(`user/${patientToInvite.value.id_user}/invite`, { email: inviteEmail.value })
        if (res.success) {
            showInvitePatientModal.value = false
            await fetchPatients()
        } else {
            alert('Erro ao enviar convite: ' + (res.message || 'Erro desconhecido'))
        }
    } catch (error) {
        console.error(error)
        alert('Erro ao enviar convite')
    } finally {
        sendingInvite.value = false
    }
}

const handleSearchSelection = (selected) => {
    if (!selected) return

    const index = itemList.value.findIndex(item => item.id === selected.id)
    
    if (index !== -1) {
        const [item] = itemList.value.splice(index, 1)
        itemList.value.unshift(item)
        selectItem(item.id)
    } else {
        console.warn('Patient not found in current list')
    }
}

const selectItem = (id) => {
    selectedItemId.value = id
    newWeight.value = null

    setTimeout(scrollToPatientCard, 100)
}

const imcCalc = (height, weight) => {
    if (!height || !weight || typeof height !== 'number' || typeof weight !== 'number') {
        return 'Invalid input'
    }
    const heightM = height / 100
    const imcValue = (weight / (heightM * heightM)).toFixed(2)
    
    if (imcValue < 18.5) {
        return `${imcValue.replace('.', ',')} (magreza)`
    } else if (imcValue < 25) {
        return `${imcValue.replace('.', ',')} (normal)`
    } else if (imcValue < 30) {
        return `${imcValue.replace('.', ',')} (sobrepeso)`
    } else if (imcValue < 40) {
        return `${imcValue.replace('.', ',')} (obesidade)`
    } else {
        return `${imcValue.replace('.', ',')} (obesidade grave)`
    }
}

const selectedItem = computed(() => {
    if (!selectedItemId.value) {
        return null
    }
    return itemList.value.find(item => item.id === selectedItemId.value)
})

const updatePatientWeight = async () => {
    if (!newWeight.value || newWeight.value <= 0) {
        alert('Por favor, insira um peso válido');
        return;
    }

    if (!selectedItem.value) return;

    const weight = Number(newWeight.value);
    const height = Number(selectedItem.value.height);
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(2);

    const payload = {
        id_patient: Number(selectedItem.value.id),
        weight: weight,
        height: height,
        bmi: Number(bmi),
        record_date: new Date().toISOString()
    };

    const response = await insert('health-data', payload);
    if (response && !response.error) {
        await fetchPatients();
        newWeight.value = null;
    } else {
        console.error('Erro ao atualizar progresso:', response);
        alert('Erro ao atualizar peso. Tente novamente.');
    }
}

const transformPlan = (plan) => {
  return {
    ...plan,
    dietaryRestrictions: plan.mealPlanDietaryRestrictions || [],
    objective: plan.objective
  }
}

const fetchPatients = async () => {
    loading.value = true
    try {
        const patientsRes = await get('patient/all');

        if (patientsRes.success && patientsRes.data) {
            itemList.value = patientsRes.data;
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await fetchPatients()
})

const handleModalClose = async (shouldRefresh) => {
    showModal.value = ''
    if (shouldRefresh) {
        await fetchPatients()
    }
}

const openMealPlanManager = () => {
    showModal.value = 'mealPlanManager'
}

const handleDelete = async () => {
    if (!selectedItem.value) return;

    const response = await remove('patient', selectedItem.value.id);
    if (response.success) {
        selectedItemId.value = null;
        await fetchPatients();
    } else {
        alert('Erro ao excluir/desvincular paciente: ' + (response.message || 'Erro desconhecido'));
    }
}

let patientCard = null
const TOP_OFFSET = 140;

const scrollToPatientCard = () => {
    if (patientCard) {
        const elementTop = patientCard.getBoundingClientRect().top + window.scrollY
        const offsetPosition = elementTop - TOP_OFFSET
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        })
    }
}
</script>

<style>
.stickyProfile {
    position: sticky;
    top: 30px;
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
