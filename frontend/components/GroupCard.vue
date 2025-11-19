<template>
    <div class="flex items-start justify-between p-6 h-max rounded-3xl shadow-lg gap-5 bg-white">
        <div class="flex gap-5">
            <img :src="group.picture || defaultGroupImage" alt="Foto do grupo"
                class="w-36 aspect-square object-cover rounded-2xl flex-shrink-0" />
            <div class="flex flex-col justify-between">
                <div class="flex flex-col">
                    <h2 class="h2main">{{ group.title }}</h2>
                    <h2 class="font-semibold text-md text-p-400 cursor-pointer hover:text-p-700 transition active:text-p-500">
                        <i class="fa-regular fa-copy mr-1 text-p-700"></i>{{ group.code }}
                    </h2>
                </div>
                <p class="text-md font-medium text-gray-400">Criado por: {{ group.owner }}</p>
                <div v-if="group.owner === 'Você'" class="flex gap-3">
                    <Button mediumPurple
                        class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        icon="fa-solid fa-edit short flex justify-center" label="Editar" @click="$emit('edit')" />
                    <Button red
                        class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                        icon="fa-regular fa-trash-can short flex justify-center" label="Apagar" @click="$emit('delete')" />
                </div>
                <div v-else class="flex gap-3">
                    <Button red
                        class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                        icon="fa-solid fa-right-from-bracket short flex justify-center" label="Sair" @click="$emit('leave')" />
                </div>
            </div>
        </div>

        <div class="flex flex-col">
            <h3 class="h3">Participantes:</h3>
            <div class="flex flex-col gap-1 mt-2">
                <p v-for="participant in group.participants" :key="participant.id"
                    class="font-semibold flex items-center text-lg text-gray-700 cursor-default text-nowrap" :title="participant.name">
                    <i class="fa-solid fa-circle-user mr-2 text-2xl text-p-700"></i>
                    {{ participant.name }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import defaultGroupImage from '~/assets/images/groupPhoto.jpg';

defineProps({
    group: { type: Object, required: true }
});

defineEmits(['edit', 'delete', 'leave']);
</script>

