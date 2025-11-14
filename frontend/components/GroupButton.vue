<template>
    <div 
        class="flex justify-start items-center px-3 py-3 h-[120px] rounded-3xl shadow-lg gap-5 bg-white border-2 cursor-pointer transition-all duration-100 active:scale-[98%]"
        :class="{'border-p-600 shadow-xl shadow-p-600/20 w-[100%] transition': isSelected}, {'w-[85%]' : !isSelected}"
        @click="notificarClique"
    >
        <img :src="picture || defaultImage" alt="Foto do grupo" class="h-full aspect-square object-cover rounded-2xl" />

        <div class="flex flex-col items-start w-full justify-between gap-2 h-full">
            <div class="flex flex-col">
                <h3 class="h3" :class="{'h3main' : isSelected}">{{title}}</h3>
                <p class="text-md">{{participants}} participante{{participants > 1 ? 's' : participants < 1 ? 's' : ''}}</p>
            </div>
            <p class="text-md font-semibold" :class="endingClass(daysRemaining)">{{daysRemaining}}</p>
        </div>
    </div>
</template>

<script>
import defaultGroupImage from '~/assets/images/groupPhoto.jpg';

export default {
    props: {
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
        isSelected: {
            type: Boolean,
            default: false
        },
        picture: {
            type: String,
            default: null
        }
    },
    data() {
        return { defaultImage: defaultGroupImage };
    },
    emits: ['selecionado'],
    methods: {
        notificarClique() {
            this.$emit('selecionado');
        },
        endingClass(diffDays) {
            if (diffDays === 'Finalizado' || diffDays === 'Termina hoje' || diffDays === 'Termina amanhã') {
                return 'text-danger-light';
            } else {
                return 'text-p-950';
            }
        },
    }
}
</script>