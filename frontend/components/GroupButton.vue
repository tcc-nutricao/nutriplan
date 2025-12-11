<template>
    <div 
        v-if="!loading"
        class="
            flex justify-start items-start px-3 py-3 rounded-3xl shadow-lg gap-5 bg-white 
            border-2 cursor-pointer transition-all duration-100 active:scale-[98%]
            w-full"
        :class="{
            'border-p-600 shadow-xl shadow-p-600/20 transition': isSelected,
            'md:w-[100%]': isSelected,
            'md:w-[85%]': !isSelected
        }"
        @click="notificarClique"
    >
        <img 
            :src="picture || defaultImage" 
            alt="Foto do grupo" 
            class="w-20 h-20 aspect-square object-cover rounded-2xl flex-shrink-0"
        />

        <div class="flex flex-col items-start w-full justify-between gap-2">
            <div class="flex flex-col">
                <h3 class="h3 leading-tight break-words" :class="{'h3main' : isSelected}">
                    {{ title }}
                </h3>
                <p class="text-md">{{participants}} participante{{participants > 1 ? 's' : participants < 1 ? 's' : ''}}</p>
            </div>
            <p class="text-md font-semibold" :class="endingClass(daysRemaining)">{{daysRemaining}}</p>
        </div>
    </div>
</template>

<script setup>
import defaultGroupImage from '~/assets/images/groupPhoto.jpg';

defineProps({
    title: {
        type: String,
        required: true
    },
    daysRemaining: {
        type: String,
        required: true
    },
    participants: {
        type: Number,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    isSelected: {
        type: Boolean,
        default: false
    },
    picture: {
        type: String,
        default: null
    }
});

const defaultImage = defaultGroupImage;

const emit = defineEmits(['selected']);

function notificarClique() {
    emit('selected');
}

function endingClass(diffDays) {
    if (diffDays === 'Finalizado' || diffDays === 'Termina hoje' || diffDays === 'Termina amanhã') {
        return 'text-danger-light';
    } else {
        return 'text-p-950';
    }
}
</script>