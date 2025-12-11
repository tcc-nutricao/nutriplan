<template>
    <div class="flex flex-col items-center justify-center p-6 pb-10 h-max mb-8 rounded-3xl shadow-lg gap-3 bg-white">
        <div class="flex">
            <h2 class="h2">Progresso</h2>
        </div>

        <div class="flex flex-col w-full md:px-10 gap-8">
            <div>
                <!-- PROBLEMA CORRIGIDO AQUI -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3 md:gap-8">
                    <h3 class="text-lg text-center" :class="endingClass(daysRemaining)">
                        {{ daysRemaining }}
                    </h3>

                    <div class="flex flex-col md:flex-row gap-2 md:gap-8 text-center md:text-left">
                        <p class="text-md text-gray-600">
                            Início: <span class="h3main">{{ formattedStartDate }}</span>
                        </p>
                        <p v-if="group.endDate" class="text-md text-gray-600">
                            Final: <span class="h3main">{{ formattedEndDate }}</span>
                        </p>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-1">
                    <h3 class="h3">Progresso geral</h3>
                    <span class="text-lg font-bold text-p-700">{{ groupProgress }}%</span>
                </div>

                <ProgressBar :progress="groupProgress" :height="'6'" />
            </div>

            <div>
                <h3 class="h3 text-center mb-2">Progresso Individual</h3>
                <div class="flex flex-col gap-3">
                    <div v-for="participant in group.participants" :key="participant.id">
                        <div class="flex justify-between items-center mb-0">
                            <p class="text-md text-gray-700"
                               :class="participant.name === 'Você' ? 'font-black text-p-600' : ''">
                                {{ participant.name }}
                            </p>
                            <span class="text-md font-bold text-gray-600">{{ participant.progress }}%</span>
                        </div>
                        <p class="font-light text-sm text-gray-600 mb-1">{{ participant.objective }}</p>
                        <ProgressBar :progress="participant.progress" :type="'2'" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue';

const props = defineProps({
    group: {
        type: Object,
        required: true
    }
});

function daysSince(startDateString) {
    const today = new Date();
    const startDate = new Date(startDateString);
    const timeDiff = today - startDate;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
    if (daysDiff === 0) return 'Começou hoje';
    if (daysDiff === 1) return 'Começou ontem';
    return `Começou há ${daysDiff} dias`;
}

function calculateDaysRemaining(endDateString) {
    if (!endDateString) return '';
    const today = new Date();
    const endDate = new Date(endDateString);
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (endDate < today) return 'Finalizado';
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Termina hoje';
    if (diffDays === 1) return 'Termina amanhã';
    return `Termina em ${diffDays} dias`;
}

const daysRemaining = computed(() => {
    return props.group.endDate ? calculateDaysRemaining(props.group.endDate) : daysSince(props.group.startDate);
});

function endingClass(diffDays) {
    if (diffDays === 'Finalizado' || diffDays === 'Termina hoje' || diffDays === 'Termina amanhã') {
        return 'text-danger-light';
    }
    return 'text-p-950';
}

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formattedStartDate = computed(() => formatDate(props.group?.startDate));
const formattedEndDate = computed(() => formatDate(props.group?.endDate));

const groupProgress = computed(() => {
    if (!props.group || !props.group.participants || props.group.participants.length === 0) return 0;
    const totalProgress = props.group.participants.reduce((sum, p) => sum + (p.progress || 0), 0);
    return Math.round(totalProgress / props.group.participants.length);
});
</script>
