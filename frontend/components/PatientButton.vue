<template>
    <div 
        class="flex flex-row items-between justify-between gap-2 py-4 px-6 bg-white rounded-3xl shadow-lg border-2 cursor-pointer transition-all duration-150 active:scale-[98%] w-full"
        :class="{'md:w-full border-p-600 shadow-xl shadow-p-600/20': isSelected, 'md:w-[85%]': !isSelected}"
        @click="notificarClique"
    >
        <div class="flex flex-col items-between justify-start gap-3">
            <h2 class="h2">{{ name }}</h2>
            <div>
                <p class="font-normal text-gray-600">{{ objective }}</p>
            </div>
        </div>
        <div class="flex flex-col items-between justify-end gap-3 text-end font-normal text-gray-600">
            <p>IMC: <span class="font-semibold text-p-600"> {{ imc }}</span> </p>
            <p>Última atualização: <span class="font-semibold text-p-600"> {{ lastUpdate }}</span></p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        objective: {
            type: String,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        lastUpdate: {
            type: String,
            required: true
        },
        isSelected: {
            type: Boolean,
            default: false
        },
    },
    emits: ['selecionado'],
    methods: {
        notificarClique() {
            this.$emit('selecionado');
        }
    },
    computed: {
        imc() {
            const heightM = this.height / 100;
            const imcValue = (this.weight / (heightM * heightM)).toFixed(2);
            
            if (imcValue < 18.5) {
                return `${imcValue.replace('.', ',')} (magreza)`;
            } else if (imcValue < 25) {
                return `${imcValue.replace('.', ',')} (normal)`;
            } else if (imcValue < 30) {
                return `${imcValue.replace('.', ',')} (sobrepeso)`;
            } else if (imcValue < 40) {
                return `${imcValue.replace('.', ',')} (obesidade)`;
            } else {
                return `${imcValue.replace('.', ',')} (obesidade grave)`;
            }
        }
    }
}
</script>