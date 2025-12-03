<template>
    <div class="w-[210mm] bg-white p-6 flex flex-col gap-4">
        <!-- Header -->
        <div class="flex justify-between items-start">
            <div>
                <h1 class="text-3xl font-bold text-p-600 mb-3">Progresso</h1>
                <h2 class="text-xl font-bold text-gray-800 mb-1">{{ items.patientName }}</h2>
                <p class="text-gray-500 text-sm mb-3">{{ items.objective }}</p>
            </div>
            <div class="text-right">
                <p class="text-lg text-gray-600">{{ currentDate }}</p>
            </div>
        </div>

        <!-- Progress Bar Section -->
        <div class="flex flex-col gap-5 items-center border-2 border-p-500 rounded-xl p-5 relative bg-white">
            <ProgressBar :progress="items.metaAchieved" :height="'6'" class="w-full"/>

            <div class="w-full flex justify-center gap-3">
                <div class="bg-white w-[150px] px-6 py-3 rounded-xl pb-9 border-2 border-p-200 text-center mt-4 z-10">
                    <h3 class="text-3xl font-bold text-p-600 mb-2">{{ comma(items.metaAchieved) || 0 }}%</h3>
                    <p class="text-xs text-gray-500 font-medium">da meta atingida</p>
                </div>
                <div class="bg-white w-[150px] px-6 py-3 rounded-xl pb-9 border-2 border-p-200 text-center mt-4 z-10">
                    <h3 class="text-3xl font-bold text-p-600 mb-2">{{ comma(items.actualWeight) }} kg</h3>
                    <p class="text-xs text-gray-500 font-medium">peso atual</p>
                </div>
            </div>
            
            <div class="grid gap-3 w-full" :class="targetWeight != 0 ? 'grid-cols-4' : 'grid-cols-3'">
                <!-- Initial Weight -->
                 <div class="bg-white p-3 rounded-xl pb-9 border-2 border-gray-200 flex flex-col justify-center items-center gap-1">
                    <p class="text-2xl font-semibold text-gray-800">{{ comma(items.imc) }}</p>
                    <p class="text-gray-500 text-xs">IMC atual</p>
                </div>
                <div v-if="targetWeight != 0" class="bg-white p-3 rounded-xl pb-9 border-2 border-gray-200 flex flex-col justify-center items-center gap-1">
                    <p class="text-2xl font-semibold text-gray-800">{{ items.targetWeight }}kg</p>
                    <p class="text-gray-500 text-xs">Meta</p>
                </div>
                <div class="bg-white p-3 rounded-xl pb-9 border-2 border-gray-200 flex flex-col justify-center items-center gap-1">
                    <p class="text-2xl font-semibold text-gray-800">{{ comma(items.initialWeight) }}kg</p>
                    <p class="text-gray-500 text-xs">Peso inicial</p>
                </div>
                <div class="bg-white p-3 rounded-xl pb-9 border-2 border-gray-200 flex flex-col justify-center items-center gap-1">
                    <p class="text-2xl font-semibold text-gray-800">{{ weightDifference }}kg</p>
                    <p class="text-gray-500 text-xs">a menos</p>
                </div>
            </div>
    
            <!-- Chart Section -->
            <div class="bg-white p-3 rounded-xl pb-9 border-2 border-gray-200 flex-grow w-full">
                <h3 class="text-lg font-bold text-gray-800 mb-3 text-center">Progresso</h3>
                <div class="h-[250px] w-full">
                    <ProgressChart
                        v-if="chartData && chartOptions"
                        class="overflow-visible"
                        :chart-data="chartData"
                        :chart-options="chartOptions"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    items: {
        type: Object,
        default: () => ({})
    },
    progress: {
        type: Array,
        default: () => []
    },
    chartData: {
        type: Object,
        default: () => ({})
    },
    chartOptions: {
        type: Object,
        default: () => ({})
    },
    targetWeight: {
        type: Number,
        default: 0
    }
});

const comma = (i) => {
    if (i === undefined || i === null) return '';
    return String(i).replace('.', ',');
};


const currentDate = computed(() => {
    return new Date().toLocaleDateString('pt-BR');
});

const weightDifference = computed(() => {
    if (!props.items.initialWeight || !props.items.actualWeight) return 0;
    const diff = Math.abs(props.items.initialWeight - props.items.actualWeight);
    return diff.toFixed(1).replace('.', ',');
});
</script>

<style scoped>
* {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}
</style>
