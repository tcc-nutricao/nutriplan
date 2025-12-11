<template>
  <div class="flex flex-col w-full gap-6 px-5 md:px-10 mt-6 md:mt-0">
    <div class="flex w-full">
      <h1 class="h1">Meus Grupos</h1>
    </div>
    <div class="flex flex-col md:flex-row w-full gap-6 md:gap-5">
      <div class="w-full md:w-[30%] order-1 md:order-1 sticky top-0 z-50 md:top-6 md:self-start">
        <div class="flex flex-col gap-6">
        <Card>
          <Button mediumPurple
            class="w-full px-3 h-[42px] text-nowrap shadow-lg border-2 mb-4 border-p-500 shadow-p-600/20 transition"
            icon="fa-solid fa-plus short flex justify-center"
            label="Criar novo grupo"
            @click="openCreateModal" />
          <div class="flex flex-col 2xl:flex-row items-start 2xl:items-end gap-3 border-t-2 pt-3 mt-2 border-p-200">
            <InputText class="mb-0 w-full"
              label="Entrar em um grupo"
              placeholder="Digite o código"
              v-model="groupCode"
              :error="groupCodeError"
              @update:modelValue="handleGroupCodeInput"
              @keyup.enter="joinGroup" />
            <Button mediumPurple
              class="w-full 2xl:w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
              label="Entrar"
              @click="joinGroup" />
          </div>
        </Card>
        <div
          v-if="!pending && itemList.length > 0"
          class="flex flex-col gap-3 w-full mb-10">
          <template v-for="item in itemList" :key="item.id">
            <GroupButton
              :title="item.title"
              :daysRemaining="item.endDate ? calculateDaysRemaining(item.endDate) : daysSince(item.startDate)"
              :participants="item.participantCount"
              :picture="item.picture"
              :is-selected="item.id === selectedItemId"
              @selected="selectItem(item.id)" />
            <div
              v-if="item.id === selectedItemId"
              class="flex flex-col gap-6 md:hidden"
            >
              <GroupCard
                :group="selectedItem"
                @edit="openEditModal"
                @delete="openDeleteModal"
                @leave="openLeaveModal" />
              <GroupProgressCard :group="selectedItem" />
            </div>
          </template>
        </div>
        </div>
      </div>
      <div
        v-if="!pending && selectedItem"
        class="hidden md:flex flex-col gap-6 w-full md:w-[65%] md:order-2"
      >
        <GroupCard
          :group="selectedItem"
          @edit="openEditModal"
          @delete="openDeleteModal"
          @leave="openLeaveModal" />
        <GroupProgressCard :group="selectedItem" />
      </div>
      <div v-else
        class="bg-white rounded-3xl shadow-lg border-2 p-6 py-20
               w-full md:w-[70%] flex items-center justify-center
               text-gray-500 order-3 md:order-3">
        <h3 class="h2">{{ pending ? 'Carregando...' : 'Crie ou entre em um grupo!' }}</h3>
      </div>
    </div>
    <div class="p-4">
    <ModalGroupCreate
      v-if="showModal === 'Criar' || showModal === 'Editar'"
      :title="showModal"
      :initialData="showModal === 'Editar' ? selectedItem : {}"
      @close="closeModal"
      @save="handleSaveGroup" />
    </div>
    <ModalDanger
      v-if="showModal == 'delete' || showModal == 'leave'"
      title="Tem certeza?"
      :content="showModal === 'delete'
        ? 'Esse grupo também será apagado para todos os participantes permanentemente.'
        : 'Ao sair do grupo, será necessário entrar com o mesmo código novamente.'"
      :btnLabel="showModal === 'delete' ? 'Apagar' : 'Sair'"
      :confirm="showModal"
      @leave="handleGroupLeave"
      @delete="handleGroupDelete"
      @closeModal="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCookie, useNuxtApp } from 'nuxt/app';
import { insert, update, get } from '../crud';

const userCookie = useCookie('user-data');

const { $axios } = useNuxtApp();

const itemList = ref([]);
const selectedItemId = ref(null);
const pending = ref(true);
const groupListTop = ref(null);

const groupCode = ref('');
const groupCodeError = ref(null);

function mapApiDataToFrontend(apiGroup) {
  const participants = apiGroup.progress.participants.map((participant, index) => ({
    id: index,
    name: participant.name === userCookie.value?.name ? 'Você' : participant.name,
    progress: participant.progress,
    objective: 'Não definido',
  }
)
);

console.log(participants.name)
console.log(userCookie.value?.name)

  return {
    id: apiGroup.id,
    title: apiGroup.name,
    picture: apiGroup.picture ? `data:image/jpeg;base64,${apiGroup.picture}` : null,
    code: apiGroup.invite_code,
    startDate: apiGroup.created_at,
    endDate: apiGroup.end_date,
    owner: apiGroup.userRole === 'ADMIN' ? 'Você' : apiGroup.ownerName,
    participantCount: apiGroup.participantCount,
    participants: participants,
    userRole: apiGroup.userRole,
  };
}

async function fetchGroups() {
  pending.value = true;
  const response = await get('group/progress');
  const mappedResponse = response.data.groups.map(group => mapApiDataToFrontend(group))
  if (mappedResponse && mappedResponse.length) {
    itemList.value = mappedResponse
    selectItem(itemList.value[0].id);
  } else {
    itemList.value = [];
  }
  pending.value = false
}

onMounted(() => {
  fetchGroups();
});

async function handleSaveGroup(groupData) {
  try {
    const payload = {
      name: groupData.name,
      picture: groupData.image,
      end_date: groupData.endDate
    };

    let response;

    if (showModal.value === 'Criar') {
      response = await insert('group', payload);
    }
    else if (showModal.value === 'Editar') {
      if (!selectedItem.value?.id) {
        console.error("Erro: Nenhum item selecionado para edição.");
        return;
      }

      response = await update('group', selectedItem.value.id, payload);
    }

    if (response && !response.error) {
      await fetchGroups();
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

async function joinGroup() {
  groupCodeError.value = null;

  if (!groupCode.value) {
    groupCodeError.value = 'O código é obrigatório.';
    return;
  }

  if (groupCode.value.length !== 6) {
    groupCodeError.value = 'O código deve ter 6 caracteres.';
    return;
  }

  try {
    pending.value = true;
    await $axios.post('/group/join', { inviteCode: groupCode.value });
    groupCode.value = '';
    await fetchGroups();
  } catch (error) {
    console.error("Erro ao entrar no grupo:", error);
    groupCodeError.value = error.response?.data?.message || 'Erro ao entrar no grupo.';
  } finally {
    pending.value = false;
  }
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
  showModal.value = "leave";
};

const closeModal = () => {
  showModal.value = "";
};

const handleGroupDelete = async () => {
  if (!selectedItem.value) return;
  pending.value = true;
  try {
    await $axios.delete(`/group/${selectedItem.value.id}`);
    await fetchGroups();
    closeModal();
  } catch (error) {
    console.error('Erro ao excluir grupo:', error);
    alert('Erro ao excluir grupo. Tente novamente.');
  } finally {
    pending.value = false;
  }
};

const handleGroupLeave = async () => {
  try {
    if (!selectedItem.value?.id) {
      console.error("Erro: Nenhum grupo selecionado para sair.");
      return;
    }

    pending.value = true;
    await $axios.post('/group/leave', { groupId: selectedItem.value.id });

    await fetchGroups();
    closeModal();
  } catch (error) {
    console.error("Erro ao sair do grupo:", error);
    alert(error.response?.data?.message || 'Erro ao sair do grupo.');
  } finally {
    pending.value = false;
  }
};

function daysSince(startDateString) {
  const today = new Date();
  const startDate = new Date(startDateString);
  const timeDiff = today - startDate;
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