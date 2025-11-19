<template>
    <div>
        <Card v-if="!loading && selectedItem">
            <div class="flex justify-between">
                <div class="flex gap-6">
                    <img :src="selectedItem.picture || defaultGroupImage" alt="Foto do grupo"
                        class="w-36 aspect-square object-cover rounded-2xl flex-shrink-0" />
                    <div class="flex flex-col justify-between">
                        <div class="flex flex-col">
                            <h2 class="h2main">{{ selectedItem.title }}
                            </h2>
                            <h2
                                class="font-semibold text-md text-p-400 cursor-pointer hover:text-p-700 transition active:text-p-500">
                                <i class="fa-regular fa-copy mr-1 text-p-700"></i>{{ selectedItem.code }}
                            </h2>
                        </div>
                        <p class="text-md font-medium text-gray-400">Criado por: {{ selectedItem.owner }}</p>
                        <div v-if="selectedItem.owner === 'Você'" class="flex gap-3">
                            <Button mediumPurple
                                class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                                icon="fa-solid fa-edit short flex justify-center" label="Editar" @click="openEditModal" />
                            <Button red
                                class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                                icon="fa-regular fa-trash-can short flex justify-center" label="Apagar" @click="openDeleteModal" />
                        </div>
                        <div v-else class="flex gap-3">
                            <Button red
                                class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                                icon="fa-solid fa-right-from-bracket short flex justify-center" label="Sair" @click="openLeaveModal" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <h3 class="h3">Participantes:</h3>
                    <div class="flex flex-col gap-1 mt-2">
                        <div v-for="participant in selectedItem.participants" :key="participant.id"
                            class="font-semibold flex items-center text-lg text-gray-700 cursor-default text-nowrap" :title="participant.name">
                            <i class="fa-solid fa-circle-user mr-2 text-2xl text-p-700"></i>
                            {{ participant.name }}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
        <div v-else
            class="stickyProfile bg-white rounded-3xl text-nowrap shadow-lg border-2 p-6 py-20 w-[70%] flex items-center justify-center text-gray-500">
            <h3 class="h2">{{ loading ? 'Carregando...' : 'Crie ou entre em um grupo!' }}</h3>
        </div>
    </div>
</template>

<script setup>
import defaultGroupImage from "~/assets/images/groupPhoto.jpg";

const props = defineProps({
    selectedItem: {
        type: Object,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
});
</script>