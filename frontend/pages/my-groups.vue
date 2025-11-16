<template>
    <div class="flex flex-col w-full gap-3 px-10">
        <div class="flex w-full">
            <h1 class="h1">Meus Grupos</h1>
        </div>
        <div class="flex w-full gap-5">
            <div class="flex flex-col gap-5 w-[30%]">
                <div class="flex flex-col justify-center px-6 pt-5 h-max rounded-3xl shadow-lg gap-3 bg-white pb-6">
                    <Button mediumPurple
                        class="w-full px-3 h-[42px] text-nowrap shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        icon="fa-solid fa-plus short flex justify-center" label="Criar novo grupo"
                        @click="openCreateModal" />
                    <div class="flex flex-col 2xl:flex-row items-end gap-3 border-t-2 pt-2 mt-2 border-p-200">
                        <InputText class="mb-0 w-full" label="Entrar em um grupo"
                            placeholder="Digite o código do grupo" />
                        <Button mediumPurple
                            class="w-full 2xl:w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                            label="Entrar" />
                    </div>
                </div>
                <div v-if="!pending && itemList.length > 0" class="flex flex-col gap-3 w-full">
                    <GroupButton v-for="item in itemList" :key="item.id" :title="item.title"
                        :daysRemaining="calculateDaysRemaining(item.endDate)" :participants="item.participantCount" :picture="item.picture"
                        :is-selected="item.id === selectedItemId" @selecionado="selectItem(item.id)" />
                </div>
                <div v-else-if="pending" class="mt-5 text-center text-gray-500">
                    <p>Carregando grupos...</p>
                </div>
                <div v-else class="mt-5 text-center text-gray-500">
                    <p>Você ainda não participa de nenhum grupo.</p>
                </div>
            </div>
            <div v-if="!pending && selectedItem" class="flex flex-col gap-5 w-[65%]">
                <div class="flex items-start justify-between p-6 h-max rounded-3xl shadow-lg gap-5 bg-white">

                    <div class="flex gap-5">
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
                                    icon="fa-regular fa-trash-can short flex justify-center" label="Apagar" />
                            </div>
                            <div v-else class="flex gap-3">
                                <Button red
                                    class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                                    icon="fa-solid fa-right-from-bracket short flex justify-center" label="Sair" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <h3 class="h3">Participantes:</h3>
                        <div class="flex flex-col gap-1 mt-2">
                            <p v-for="participant in selectedItem.participants" :key="participant.id"
                                class="font-semibold flex items-center text-lg text-gray-700 cursor-default text-nowrap" :title="participant.name">
                                <i class="fa-solid fa-circle-user mr-2 text-2xl text-p-700"></i>
                                {{ participant.name }}
                                <!-- <i v-if="participant.name === selectedItem.owner" class="fa-solid fa-crown ml-2 mb-1 text-xl text-yellow-400"></i> -->
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="flex flex-col items-center justify-center p-6 pb-10 h-max mb-8 rounded-3xl shadow-lg gap-3 bg-white">
                    <div class="flex">
                        <h2 class="h2">Progresso</h2>
                    </div>
                    <div class="flex flex-col w-full px-10 gap-8">
                        <div>
                            <div class="flex justify-between items-center mb-3 gap-8">
                                <h3 class="text-lg text-center" :class="endingClass(calculateDaysRemaining(selectedItem.endDate))">
                                    {{ calculateDaysRemaining(selectedItem.endDate) }}
                                </h3>
                                <div class="flex gap-8">
                                    <p class="text-md text-gray-600">
                                        Início: <span class="h3main">{{ formattedStartDate }}</span>
                                    </p>
                                    <p class="text-md text-gray-600">
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
                                <div v-for="participant in selectedItem.participants" :key="participant.id">
                                    <div class="flex justify-between items-center mb-0">
                                        <p class=" text-md text-gray-700" :class="participant.name === 'Você' ? 'font-black text-p-600' : ''">{{ participant.name }}</p>
                                        <span class="text-md font-bold text-gray-600">{{ participant.progress }}%</span>
                                    </div>
                                    <p class="font-light text-sm text-gray-600 mb-1">{{ participant.objective }}</p>
                                    <ProgressBar :progress="participant.progress" :type="'2'" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else
                class="stickyProfile bg-white rounded-3xl text-nowrap shadow-lg border-2 p-6 py-20 w-[70%] flex items-center justify-center text-gray-500">
                <h3 class="h2">{{ pending ? 'Carregando...' : 'Crie ou entre em um grupo!' }}</h3>
            </div>
        </div>
        <ModalGroupCreate v-if="showModal === 'Criar' || showModal === 'Editar'" :title="showModal" @close="closeModal" @save="handleGroupCreate" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCookie, useNuxtApp } from 'nuxt/app';
import { insert } from '../crud';
import defaultGroupImage from '~/assets/images/groupPhoto.jpg';

const { $axios } = useNuxtApp();
const userCookie = useCookie('user-data');

const itemList = ref([]);
const selectedItemId = ref(null);
const pending = ref(true);
const groupListTop = ref(null);

function mapApiDataToFrontend(apiGroup) {
  const participants = apiGroup.participantNames.map((name, index) => ({
    id: index, 
    name: name === userCookie.value?.name.split(' ')[0] ? 'Você' : name,
    progress: 0, 
    objective: 'Não definido',
  }));

  return {
    id: apiGroup.id,
    title: apiGroup.name,
    picture: apiGroup.picture ? `data:image/jpeg;base64,${apiGroup.picture}` : null,
    code: apiGroup.invite_code,
    startDate: apiGroup.start_date,
    endDate: apiGroup.end_date,
    owner: 'Você',
    participantCount: apiGroup.participantCount,
    participants: participants,
  };
}

async function fetchGroups() {
  try {
    pending.value = true;
    const response = await $axios.get('/group/progress');
    const groupsFromApi = response.data.data.groups;

    if (groupsFromApi && groupsFromApi.length > 0) {
      itemList.value = groupsFromApi.map(mapApiDataToFrontend);
      selectItem(itemList.value[0].id);
    } else {
      itemList.value = [];
    }
  } catch (error) {
    console.error("Erro ao buscar os grupos:", error);
    itemList.value = [];
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  fetchGroups();
});

function generateInviteCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function handleGroupCreate(groupData) {
  try {
    const dataToSave = { 
      name: groupData.name,
      picture: groupData.image, // Opcional - Corrigido de 'image' para 'picture'
      invite_code: generateInviteCode() 
    };

    // DIAGNÓSTICO: O que está sendo enviado para a API?
    console.log('Payload enviado para a API (insert):', dataToSave);

    const response = await insert('group', dataToSave);

    if (!response.error) {
      await fetchGroups(); // Atualiza a lista de grupos
      closeModal(); // Fecha o modal APÓS o sucesso
    } else {
      console.error("Erro ao criar o grupo:", response.data);
      alert('Ocorreu um erro ao criar o grupo. Tente novamente.');
    }
  } catch (error) {
    console.error("Erro na chamada da API para criar grupo:", error);
  }
}

function selectItem(id) {
    selectedItemId.value = id;
    groupListTop.value?.scrollIntoView({ behavior: 'smooth' });
}

const showModal = ref("");

const openCreateModal = () => {
  showModal.value = "Criar";
};

const openEditModal = () => {
  showModal.value = "Editar";
};

const openDeleteModal = () => {
  showModal.value = "delete";
};

const closeModal = () => {
  showModal.value = "";
};

function calculateDaysRemaining(endDateString) {
    const today = new Date();
    const endDate = new Date(endDateString + 'T00:00:00');

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < today) {
        return 'Finalizado';
    }

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Termina hoje';
    }
    if (diffDays === 1) {
        return 'Termina amanhã';
    }
    return `Termina em ${diffDays} dias`;
}

function endingClass(diffDays) {
    if (diffDays === 'Finalizado' || diffDays === 'Termina hoje' || diffDays === 'Termina amanhã') {
        return 'text-danger-light';
    } else {
        return 'text-p-950';
    }
}

const selectedItem = computed(() => {
    if (!selectedItemId.value) {
        return null;
    }
    return itemList.value.find(item => item.id === selectedItemId.value);
});

const formattedStartDate = computed(() => {
    if (!selectedItem.value) return '';
    const dateString = selectedItem.value.startDate || '';
    const parts = dateString.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
});

const formattedEndDate = computed(() => {
    if (!selectedItem.value) return '';
    const dateString = selectedItem.value.endDate || '';
    const parts = dateString.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
});

const groupProgress = computed(() => {
    if (!selectedItem.value || selectedItem.value.participants.length === 0) {
        return 0;
    }

    const totalProgress = selectedItem.value.participants.reduce((sum, participant) => {
        return sum + (participant.progress || 0);
    }, 0);

    const average = totalProgress / selectedItem.value.participants.length;
    return Math.round(average);
});
</script>