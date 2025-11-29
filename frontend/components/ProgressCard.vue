<template>
    <div class="bg-white rounded-3xl shadow-lg border-2 p-7 flex flex-col gap-5 h-max">
        <div class="flex justify-between items-center">
            <h2 class="h3">Progresso</h2>
            <button 
                v-if="patient && dataList"
                @click="openHistory"
                class="text-sm text-p-500 hover:text-p-700 font-semibold underline"
            >
                Registros
            </button>
        </div>
        
        <div v-if="patient" class="flex flex-col gap-3">
            <div class="flex items-center justify-center w-full h-[200px] sm:h-[250px] md:h-[300px]">
                <Line 
                    v-if="chartData.datasets.length > 0"
                    class="overflow-visible"
                    :data="chartData"
                    :options="chartOptions"
                />
                <div v-else class="text-gray-400">
                    Sem dados de progresso.
                </div>
            </div>
            <div class="flex justify-between items-center mt-2">
                 <div class="flex flex-col items-center">
                    <p class="text-xs text-gray-500">Peso Inicial</p>
                    <p class="font-bold text-p-600">{{ initialWeight }} kg</p>
                 </div>
                 <div class="flex flex-col items-center">
                    <p class="text-xs text-gray-500">Peso Atual</p>
                    <p class="font-bold text-p-600">{{ currentWeight }} kg</p>
                 </div>
                 <div class="flex flex-col items-center">
                    <p class="text-xs text-gray-500">Meta</p>
                    <p class="font-bold text-p-600">{{ targetWeight ? targetWeight + ' kg' : 'N/A' }}</p>
                 </div>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-[200px] text-gray-500">
            Selecione um paciente para ver o progresso.
        </div>

        <ProgressData 
            :isOpen="isHistoryOpen" 
            :history="progress" 
            @close="closeHistory" 
            @refresh="handleRefresh"
            class="z-[1000]"
        />
    </div>
</template>

<script setup>
import { computed, toRefs, ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import ProgressData from './ProgressData.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const props = defineProps({
    patient: {
        type: Object,
        default: null
    },
    dataList: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['refresh']);

const { patient } = toRefs(props);

const isHistoryOpen = ref(false);

const openHistory = () => {
    isHistoryOpen.value = true;
};

const closeHistory = () => {
    isHistoryOpen.value = false;
};

const handleRefresh = () => {
    emit('refresh');
};

const progress = computed(() => patient.value?.progress || []);

const initialWeight = computed(() => {
    if (progress.value.length > 0) {
        return progress.value[0].weight; 
    }
    return patient.value?.weight || 0;
});

const currentWeight = computed(() => {
    if (progress.value.length > 0) {
        return progress.value[progress.value.length - 1].weight;
    }
    return patient.value?.weight || 0;
});

const targetWeight = computed(() => patient.value?.target_weight);

const chartOptions = computed(() => {
    if (!progress.value || progress.value.length === 0) {
        return {
            responsive: true,
            maintainAspectRatio: false,
        };
    }
    const weights = progress.value.map(p => p.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const padding = 2;
    const target = targetWeight.value || 70;

    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                suggestedMin: (minWeight > target ? target - padding : minWeight - padding),
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
                        yMin: target,
                        yMax: target,
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
            datasets: []
        };
    }

    const labels = progress.value.map(registro => {
        const data = new Date(registro.date);
        return data.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
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
</script>