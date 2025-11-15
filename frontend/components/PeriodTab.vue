<template>
    <div class="flex gap-3 items-center">
        <h2 class="h2">Consumo</h2>
        <Badge :label="formatPeriod()" />
        <Badge 
            v-for="period in periods" 
            :key="period.key"
            :label="period.label" 
            @click="changePeriod(period.key)"
            :class="{ 'bg-p-500 text-white': selectedPeriod === period.key }"
            class="cursor-pointer"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    periods: {
        type: Array,
        required: true,
        default: () => ([])
    }
});

const emit = defineEmits(['period-changed']);

const selectedPeriod = ref('daily');
const periodRange = ref({ startDate: null, endDate: null });

function formatPeriod() {
    if (periodRange.value.startDate && !periodRange.value.endDate) {
        return periodRange.value.startDate.toLocaleDateString('pt-BR');
    } else if (periodRange.value.startDate && periodRange.value.endDate) {
        return `${periodRange.value.startDate.toLocaleDateString('pt-BR')} - ${periodRange.value.endDate.toLocaleDateString('pt-BR')}`;
    }
    return 'Selecione um período';
}

function changePeriod(period) {
    selectedPeriod.value = period;
}

function getDatesBasedOnPeriod() {
    const startDate = new Date();
    const endDate = new Date();

    switch (selectedPeriod.value) {
        case 'daily':
            startDate.setDate(startDate.getDate() - 1);
            break;
        case 'weekly':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'monthly':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case 'yearly':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
    }

    return { startDate, endDate };
}

watch(selectedPeriod, () => {
    const { startDate, endDate } = getDatesBasedOnPeriod();
    periodRange.value = { startDate, endDate };
    emit('period-changed', { startDate, endDate });
});
</script>