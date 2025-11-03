<template>
    <div 
        class="flex flex-col items-between gap-2 py-4 px-6 bg-white rounded-3xl shadow-lg border-2 cursor-pointer transition-all duration-100 active:scale-[98%]"
        :class="{'border-p-600 shadow-xl shadow-p-600/20 w-[100%] transition': isSelected}, {'w-[85%]' : !isSelected}"
        @click="notificarClique"
    >
        <div class="flex w-full items-center justify-between">
            <h2 class="h2">{{ title }}</h2>
            <i v-if="isFav" class="fa-solid fa-heart text-xl text-red-500"></i>
        </div>
        <div class="flex flex-row justify-between items-end">
            <div>
                <p v-for="(line, index) in categories" :key="index">{{ line }}</p>
            </div>
            <div>
                <p><i class="fa-regular fa-clock mr-1"></i> {{ time }} min</p>
                <p><i class="fa-solid fa-utensils mr-1"></i> {{ portions }} porções</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        categories: {
            type: Array,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        portions: {
            type: String,
            required: true
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        isFav: {
            type: Boolean,
            default: false
        },
    },
    emits: ['selecionado'],
    methods: {
        notificarClique() {
            this.$emit('selecionado');
        },
        notificarFav() {
            this.$emit('favorito');
        }
    }
}
</script>