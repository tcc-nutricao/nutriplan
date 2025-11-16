<template>
    <div class="flex flex-col gap-3 px-10">
        <h1 class="h1">Meu progresso</h1>

        <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-6">
            <Card class="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
                <div class="flex flex-col space-y-3 mb-5">
                    <div v-for="objective in objectiveLabels" class="flex gap-2 items-center">
                        <p :class="objective.isTitle ? 'h3' : ''">{{ objective.label }} </p>
                        <h3 :class="objective.isTitle ? 'h2main' : 'h3'">{{ objective.format ? objective.format(items[objective.value]) : items[objective.value] ?? '' }}</h3>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <Input
                        class="bg-white shadow-lg shadow-gray-600/10 focus-within:shadow-p-600/20 hover:shadow-p-600/20 transition"
                        label="pesquisaReceita"
                        v-model="newWeight"
                        placeholder="Atualize seu peso"
                    />
                    <Button
                        mediumPurple
                        class="h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        label="Atualizar"
                        @click="updateProgress"
                    />
                </div>
            </Card>

            <Card class="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-3">
                <div class="flex flex-col justify-start items-center gap-5 mb-3">
                    <h2 class="h2">Progresso</h2>
                    <div class="flex items-center justify-center w-full h-[300px]">
                        <ProgressChart
                            class="overflow-visible"
                            :chart-data="chartData"
                            :chart-options="chartOptions"
                        />
                    </div>
                    <div class="w-full flex justify-center mt-5">
                        <Button
                            mediumPurple
                            class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                            label="Gerar PDF"
                        />
                    </div>
                </div>
            </Card>

            <Card>
                <div class="flex flex-col h-max space-y-4">
                    <Card class="text-center">
                        <h1 class="h1 mb-0">{{ items.metaAchieved }}%</h1>
                        <h3 class="h3">da meta atingida</h3>
                        <ProgressBar :progress="items.metaAchieved" />
                    </Card>
                    <Card class="text-center">
                        <h1 class="h1 mb-0">{{ items.imc }}</h1>
                        <h3 class="h3">IMC atual</h3>
                    </Card>
                    <Card class="text-center">
                        <h1 class="h1 mb-0">{{ progress.length > 0 ? progress.length : 0 }}</h1>
                        <h3 class="h3">registros de peso</h3>
                    </Card>
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { get, insert } from '~/crud';
import { useUtils } from '~/composables/useUtils';

const { formatISODate } = useUtils();
const isLoading = ref(true);
const items = ref({});
const progress = ref([]);
const newWeight = ref(null);

const objectiveLabels = ref([
    { label: "Objetivo atual:", value: "objective", isTitle: true },
    { label: "Meta de peso:", value: "targetWeight" },
    { label: "Peso inicial:", value: "initialWeight" },
    { label: "IMC atual:", value: "imc" },
    { label: "Última atualização:", value: "lastUpdate", format: (e) => formatISODate(e) },
    { label: "Peso atual:", value: "actualWeight", isTitle: true }
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
  