<template>
    <ProgressPdfTemplate
                ref="pdfTemplateRef"
                :items="items"
                :chart-data="chartData"
                :chart-options="chartOptions"
                :patient-name="items.patientName"
                :target-weight="items.targetWeight"
            />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { get, insert } from '~/crud';
import { useUtils } from '~/composables/useUtils';
import ProgressPdfTemplate from '~/components/ProgressPdfTemplate.vue';

definePageMeta({
  hideTopBar: true,
  hideSideBar: true
})

const { formatISODate } = useUtils();
const isLoading = ref(true);
const items = ref({});
const progress = ref([]);
const newWeight = ref(null);
const pdfTemplateRef = ref(null);
const isGeneratingPDF = ref(false);

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

async function generatePDF() {
    isGeneratingPDF.value = true;
    try {
        const element = pdfTemplateRef.value.$el;
        const opt = {
            margin: [0, 0], // Removed margin as the template has padding
            filename: 'meu-progresso.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
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