<template>
    <div class="flex flex-col md:flex-row items-start md:justify-between p-6 h-max rounded-3xl shadow-lg gap-5 bg-white">
        <div class="w-full flex flex-row items-start gap-4">
            <img :src="group.picture || defaultGroupImage" alt="Foto do grupo"
                class="w-24 md:w-36 aspect-square object-cover rounded-2xl shrink-0"/>
            <div class="flex-1 min-w-0 flex flex-col">
                <h2 class="h2main break-words text-left text-lg md:text-2xl">
                    {{ group.title }}
                </h2>
                <Tooltip :text="'Código copiado!'" :visible="showTooltip">
                    <h2 @click="copyCode"
                        class="font-semibold text-md text-p-400 cursor-pointer hover:text-p-700 transition active:text-p-500 break-all mt-1 flex items-center">
                        <i class="fa-regular fa-copy mr-1 text-p-700"></i>
                        <span class="truncate">{{ group.code }}</span>
                    </h2>
                </Tooltip>
                <p class="text-md font-medium text-gray-400 mt-2 md:hidden">
                    Criado por: {{ group.owner }}
                </p>
                <p class="text-md font-medium text-gray-400 mt-2 hidden md:block">
                    Criado por: {{ group.owner }}
                </p>
                <div class="hidden md:flex gap-3 mt-3">
                    <Button mediumPurple
                        v-if="group.userRole === 'ADMIN'"
                        class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        icon="fa-solid fa-edit short flex justify-center" label="Editar" @click="$emit('edit')"/>
                    <Button red
                        v-if="group.userRole === 'ADMIN'"
                        class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                        icon="fa-regular fa-trash-can short flex justify-center" label="Apagar" 
                        @click="$emit('delete')"/>
                    <Button red
                        v-if="group.userRole !== 'ADMIN'"
                        class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                        icon="fa-solid fa-right-from-bracket short flex justify-center" label="Sair"
                        @click="$emit('leave')"/>
                </div>
            </div>
        </div>

        <div class="flex flex-col w-full md:w-auto">
            <h3 class="h3 md:text-left">Participantes:</h3>
            <div class="flex flex-col gap-1 mt-2">
                <p v-for="participant in group.participants" :key="participant.id"
                    class="font-semibold flex items-center text-lg text-gray-700 cursor-default break-words"
                    :title="participant.name">  
                    <i class="fa-solid fa-circle-user mr-2 text-2xl text-p-700"></i>
                    {{ participant.name }}
                </p>
            </div>
            <div class="flex gap-3 mt-4 justify-center md:hidden">
                <Button mediumPurple
                    v-if="group.userRole === 'ADMIN'"
                    class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                    icon="fa-solid fa-edit short flex justify-center" label="Editar"
                    @click="$emit('edit')"/>
                <Button red
                    v-if="group.userRole === 'ADMIN'"
                    class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                    icon="fa-regular fa-trash-can short flex justify-center" label="Apagar"
                    @click="$emit('delete')"/>
                <Button red
                    v-if="group.userRole !== 'ADMIN'"
                    class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                    icon="fa-solid fa-right-from-bracket short flex justify-center" label="Sair"
                    @click="$emit('leave')"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import defaultGroupImage from '~/assets/images/groupPhoto.jpg';
import Tooltip from './Tooltip.vue';

const props = defineProps({
    group: { type: Object, required: true }
});

defineEmits(['edit', 'delete', 'leave']);

const showTooltip = ref(false);

const copyCode = () => {
    navigator.clipboard.writeText(props.group.code).then(() => {
        showTooltip.value = true;
        setTimeout(() => {
            showTooltip.value = false;
        }, 2000);
    });
};
</script>
