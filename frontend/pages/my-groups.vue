<template>
    <div class="flex flex-col w-full gap-3 px-10">
        <div class="flex w-full">
            <h1 class="h1">Meus Grupos</h1>
        </div>
        <div class="flex w-full gap-5">
            <div class="flex flex-col gap-5 w-[30%]">
                <Card>
                    <Button mediumPurple
                        class="w-full px-3 h-[42px] text-nowrap shadow-lg border-2 mb-4 border-p-500 shadow-p-600/20 transition"
                        icon="fa-solid fa-plus short flex justify-center" label="Criar novo grupo"
                        @click="openCreateModal" />
                    <div class="flex flex-col 2xl:flex-row items-start 2xl:items-end gap-3 border-t-2 pt-3 mt-2 border-p-200">
                        <InputText class="mb-0 w-full" label="Entrar em um grupo" placeholder="Digite o código"
                            v-model="groupCode" :error="groupCodeError" @update:modelValue="handleGroupCodeInput" />
                        <Button mediumPurple
                            class="w-full 2xl:w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition" label="Entrar"
                            @click="joinGroup" />
                    </div>
                </Card>
                <div v-if="!pending && itemList.length > 0" class="flex flex-col gap-3 w-full mb-10">
                    <GroupButton v-for="item in itemList" :key="item.id" :title="item.title"
                        :daysRemaining="item.endDate ? calculateDaysRemaining(item.endDate) : daysSince(item.startDate)" 
                        :participants="item.participantCount" :picture="item.picture"
                        :is-selected="item.id === selectedItemId" @selected="selectItem(item.id)" />
                </div>
            </div>
            <div v-if="!pending && selectedItem" class="flex flex-col gap-5 w-[65%]">
                <GroupCard 
                    :group="selectedItem"
                    @edit="openEditModal"
                    @delete="openDeleteModal"
                    @leave="openLeaveModal"
                />

                <GroupProgressCard :group="selectedItem" />
            </div>
            <div v-else
                class="stickyProfile bg-white rounded-3xl text-nowrap shadow-lg border-2 p-6 py-20 w-[70%] flex items-center justify-center text-gray-500">
                <h3 class="h2">{{ pending ? 'Carregando...' : 'Crie ou entre em um grupo!' }}</h3>
            </div>
        </div>
        <ModalGroupCreate v-if="showModal === 'Criar' || showModal === 'Editar'" :title="showModal" :initialData="showModal === 'Editar' ? selectedItem : {}" 
            @close="closeModal" @save="handleSaveGroup" 
        />
        <ModalDanger
            v-if="showModal == 'delete'"
            title="Tem certeza?"
            :content="showModal === 'delete' ? 'Esse grupo também será apagado para todos os participantes permanentemente.' : 'Ao sair do grupo, será necessário entrar com o mesmo código novamente.'"
            btnLabel="Apagar"
            @confirm="[{handleGroupDelete : showModal === 'delete'}, {handleGroupLeave : showModal === 'sair'}]"
            @closeModal="closeModal"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCookie, useNuxtApp } from 'nuxt/app';
import { insert, update } from '../crud';

const { $axios } = useNuxtApp();
const userCookie = useCookie('user-data');

const itemList = ref([]);
const selectedItemId = ref(null);
const pending = ref(true);
const groupListTop = ref(null);

const groupCode = ref('');
const groupCodeError = ref(null);

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
    startDate: apiGroup.created_at,
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

async function handleSaveGroup(groupData) {
  try {
    // Prepara o payload comum
    const payload = {
      name: groupData.name,
      picture: groupData.image,
      end_date: groupData.endDate
    };

    let response;

    if (showModal.value === 'Criar') {
      // --- LÓGICA DE CRIAÇÃO ---
      response = await insert('group', payload);
    } 
    else if (showModal.value === 'Editar') {
      // --- LÓGICA DE EDIÇÃO ---
      // Precisamos do ID. Como o modal de edição é aberto com base no 'selectedItem', pegamos dele.
      if (!selectedItem.value?.id) {
        console.error("Erro: Nenhum item selecionado para edição.");
        return;
      }
      
      // O método update do crud geralmente espera: tabela, id, dados
      response = await update('group', selectedItem.value.id, payload);
    }

    // Tratamento da resposta
    if (response && !response.error) {
      await fetchGroups(); // Atualiza a lista
      closeModal();
    } else {
      console.error("Erro ao salvar grupo:", response?.data || response);
      alert('Ocorreu um erro ao salvar. Tente novamente.');
    }

  } catch (error) {
    console.error("Erro na operação de grupo:", error);
  }
}

function selectItem(id) {
    selectedItemId.value = id;
    groupListTop.value?.scrollIntoView({ behavior: 'smooth' });
}

function handleGroupCodeInput(value) {
    groupCodeError.value = null;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    groupCode.value = sanitizedValue.slice(0, 6);
}

function joinGroup() {
    groupCodeError.value = null;

    if (!groupCode.value) {
        groupCodeError.value = 'O código é obrigatório.';
        return;
    }

    if (groupCode.value.length !== 6) {
        groupCodeError.value = 'O código deve ter 6 caracteres.';
        return;
    }

    // Lógica para entrar no grupo aqui...
    console.log(`Tentando entrar no grupo com o código: ${groupCode.value}`);
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

const openLeaveModal = () => {
  showModal.value = "sair";
};

const closeModal = () => {
  showModal.value = "";
};

const handleGroupDelete = () => {
// logica aqui
  showModal.value = "";
};

const handleGroupLeave = () => {
// logica aqui
  showModal.value = "";
};

function daysSince(startDateString) {
    const today = new Date();
    const startDate = new Date(startDateString);
    const timeDiff = today - startDate ;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
    if (daysDiff === 0) {
        return 'Começou hoje';
    }
    if (daysDiff === 1) {
        return 'Começou ontem';
    }
    return `Começou há ${daysDiff} dias`;
}

function calculateDaysRemaining(endDateString) {
    if (!endDateString) return '';

    const today = new Date();
    const endDate = new Date(endDateString);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < today) {
        return 'Finalizado';
    }

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Termina hoje';
    if (diffDays === 1) return 'Termina amanhã';
    return `Termina em ${diffDays} dias`;
}

const selectedItem = computed(() => {
    if (!selectedItemId.value) {
        return null;
    }
    return itemList.value.find(item => item.id === selectedItemId.value);
});

</script>