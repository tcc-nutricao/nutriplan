<template>
    <div class="flex flex-col w-full gap-6 px-5 md:px-10 mt-6 md:mt-0">
    <!-- Hidden PDF Template -->
        <div style="position: fixed; left: -9999px; top: 0; z-index: -1;">
            <div ref="pdfContent">
                <ProgressPdfTemplate 
                    v-if="!isLoading"
                    :items="items" 
                    :progress="progress"
                    :chart-data="chartData"
                    :chart-options="chartOptions"
                    :target-weight="items.targetWeight"
                />
            </div>
        </div>
        <h1 class="h1">Meu progresso</h1>

        <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
            <Card class="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
                <div class="flex flex-col space-y-2 sm:space-y-3 mb-3 sm:mb-5">
                    <div v-for="objective in objectiveLabels" class="flex gap-2 items-center" :class="{'flex-col text-start xl:flex-row' : objective.isTitle}">
                        <p :class="objective.isTitle ? 'text-sm sm:text-base md:text-lg font-semibold' : 'text-xs sm:text-sm'" class="text-t">{{ objective.label }} </p>
                        <h3 :class="objective.isTitle ? 'text-lg sm:text-xl md:text-2xl font-bold text-p-600' : 'text-sm sm:text-base md:text-lg font-semibold text-t'">{{ objective.format ? objective.format(items[objective.value]) : items[objective.value] ?? '' }}</h3>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <Input
                        class="bg-white shadow-lg shadow-gray-600/10 focus-within:shadow-p-600/20 hover:shadow-p-600/20 transition"
                        label="pesquisaReceita"
                        v-model="newWeight"
                        type="number"
                        placeholder="Atualize seu peso"
                        @keyup.enter="updateProgress"
                    />
                    <Button
                        mediumPurple
                        class="h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition text-sm sm:text-base"
                        label="Atualizar"
                        @click="updateProgress"
                    />
                </div>
            </Card>

            <Card class="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4">
                <div class="flex flex-col justify-start items-center gap-3 sm:gap-5 mb-3">
                    <div class="flex justify-between items-center w-full px-4">
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Progresso</h2>
                        <button 
                            @click="openHistory"
                            class="text-sm text-p-500 hover:text-p-700 font-semibold underline"
                        >
                            Registros
                        </button>
                    </div>
                    <div class="flex items-center justify-center w-full h-[200px] sm:h-[250px] md:h-[300px]">
                        <ProgressChart
                            class="overflow-visible"
                            :chart-data="chartData"
                            :chart-options="chartOptions"
                        />
                    </div>
                    <div class="w-full flex justify-center mt-3 sm:mt-5">
                        <Button
                            mediumPurple
                            class="w-full sm:w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition text-sm sm:text-base"
                            label="Gerar PDF"
                            @click="generatePDF"
                            :disabled="isGeneratingPDF"
                        />
                    </div>
                </div>
            </Card>

            <!-- <Card class="col-span-1 md:col-span-1"> -->
                <div class="col-span-1 md:col-span-1 h-max space-y-3 sm:space-y-4">
                    <Card class="text-center">
                        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-p-600 mb-0">{{ formatNumber(items.metaAchieved) }}%</h1>
                        <h3 class="text-xs sm:text-sm font-medium text-gray-600 mb-2">da meta atingida</h3>
                        <ProgressBar :progress="items.metaAchieved" />
                    </Card>
                    <Card class="text-center" centered>
                        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-p-600 mb-0">{{ formatNumber(items.imc) }}</h1>
                        <h3 class="text-xs sm:text-sm font-medium text-gray-600">IMC atual</h3>
                    </Card>
                    <Card class="text-center" centered>
                        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-p-600 mb-0">{{ progress.length > 0 ? progress.length : 0 }}</h1>
                        <h3 class="text-xs sm:text-sm font-medium text-gray-600">registros de peso</h3>
                    </Card>
                </div>
            <!-- </Card> -->
        </div>
        <ProgressData 
            :isOpen="isHistoryOpen" 
            :history="progress" 
            @close="closeHistory" 
            @refresh="getProgressData"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { get, insert } from '~/crud';
import { useUtils } from '~/composables/useUtils';
import ProgressData from '~/components/ProgressData.vue';

const { formatISODate, formatNumber } = useUtils();
const isLoading = ref(true);
const items = ref({});
const progress = ref([]);
const newWeight = ref(null);
const pdfContent = ref(null);
const isGeneratingPDF = ref(false);
const isHistoryOpen = ref(false);

const openHistory = () => {
    isHistoryOpen.value = true;
};

const closeHistory = () => {
    isHistoryOpen.value = false;
};

const objectiveLabels = ref([
    { label: "Objetivo atual:", value: "objective", isTitle: true },
    { label: "Meta de peso:", value: "targetWeight", format: (e) => formatNumber(e) },
    { label: "Peso inicial:", value: "initialWeight", format: (e) => formatNumber(e) },
    { label: "IMC atual:", value: "imc", format: (e) => formatNumber(e) },
    { label: "Última atualização:", value: "lastUpdate", format: (e) => formatISODate(e) },
    { label: "Peso atual:", value: "actualWeight", isTitle: true, format: (e) => formatNumber(e) }
]);

const chartOptions = computed(() => {
    if (!progress.value || progress.value.length === 0) {
        return {
            responsive: true,
            maintainAspectRatio: false,
        };
    }
    const weights = progress.value.map(progressItem => progressItem.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const padding = 2;
    const targetWeight = items.value.targetWeight || 70;

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

const chartData = computed(() => {
    if (!progress.value || progress.value.length === 0) {
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

    const labels = progress.value.map(registro => {
        const data = new Date(registro.date);
        return data.toLocaleDateString('pt-BR', { month: 'long' });
    });
    
    const data = progress.value.map(registro => registro.weight);

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

async function updateProgress() {
    if (!newWeight.value || newWeight.value <= 0) {
        alert('Por favor, insira um peso válido');
        return;
    }

    const weight = Number(newWeight.value);
    const height = Number(items.value.height);

    const payload = {
        id_patient: Number(items.value.id_patient),
        weight: weight,
        height: height,
        bmi: items.value.imc,
        record_date: new Date().toISOString()
    };

    const response = await insert('health-data', payload);
    if (response && !response.error) {
        await getProgressData();
        newWeight.value = null;
    } else {
        console.error('Erro ao atualizar progresso:', response);
        alert('Erro ao atualizar peso. Tente novamente.');
    }
}

async function generatePDF() {
    isGeneratingPDF.value = true;
    try {
        const element = pdfContent.value;
        const opt = {
            margin: [0, 0],
            filename: (() => {
                const patientName = items.value.patientName || 'Paciente';
                const firstName = patientName.split(' ')[0];
                const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
                return `${firstName} - ${date}.pdf`;
            })(),
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

async function getProgressData() {
    isLoading.value = true;
    const response = await get('patient/progress');
    if (response && !response.error) {
        items.value = response.data || {};
        progress.value = items.value.progress || [];
    }
    isLoading.value = false;
}

onMounted(async () => {
    await getProgressData();
});
</script>