<template>
    <div 
        class="flex flex-col items-between gap-2 py-3 bg-white w-full
                border-t-2 transition-all duration-100"
        @click="notificarClique"
    >
        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-col w-[75%]">
                <h2 class="text-[1.1em] font-semibold text-p-950">{{ title }}</h2>
                <div class="flex">
                    <p class="text-sm" v-for="(line, index) in categories" :key="index">{{ line }}<span class="mx-2" v-if="index < categories.length - 1" >|</span></p>
                </div>
                <div class="flex text-sm">
                    <p><i class="fa-regular fa-clock mr-1"></i> {{ time }} min </p>
                    <span class="mx-2">|</span>
                    <p><i class="fa-solid fa-utensils mr-1"></i> {{ portions }} porções </p>
                </div>
            </div>
            <div class="flex flex-col items-center justify-end h-full">
                <Button mediumPurple
                    class="w-max pr-3 pl-2 h-[42px]"
                    icon="fa-solid fa-chevron-right short flex justify-center ml-1" label=""
                />
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
    },
    emits: ['openRecipe'],
    methods: {
        notificarClique() {
            this.$emit('openRecipe');
        }
    }
}
</script>