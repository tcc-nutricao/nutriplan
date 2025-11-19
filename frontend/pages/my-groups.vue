<template>
  <div class="flex flex-col w-full gap-3 px-10">
    <h1 class="h1">Meus Grupos</h1>

    <div class="grid grid-cols-6 gap-6">
      <div class="flex flex-col gap-3 col-span-2">
        <Card>
          <Button
            mediumPurple
            class="w-full px-3 h-[42px] text-nowrap shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
            icon="fa-solid fa-plus short flex justify-center"
            label="Criar novo grupo"
            @click="openCreateModal"
          />
          <div
            class="flex flex-col 2xl:flex-row items-end gap-3 border-t-2 pt-2 mt-2 border-p-200"
          >
            <InputText
              class="mb-0 w-full"
              label="Entrar em um grupo"
              placeholder="Digite o código do grupo"
            />
            <Button
              mediumPurple
              class="w-full 2xl:w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
              label="Entrar"
            />
          </div>
        </Card>
        <GroupButton
          v-if="!loading && itemList.length > 0"
          v-for="item in itemList"
          :key="item.id"
          :title="item.title"
          :item="item"
          :loading="loading"
          :is-selected="item.id === selectedItemId"
          @selected="selectItem(item.id)"
        />
      </div>

      <div class="flex flex-col gap-3 col-span-4">
        <GroupCard :selectedItem="selectedItem" :loading="loading" />
        <GroupProgressCard
            :selectedItem="selectedItem"
            :loading="loading"
        />
      </div>
    </div>

    <ModalGroupCreate
      v-if="showModal === 'Criar' || showModal === 'Editar'"
      :title="showModal"
      @close="closeModal"
      @save="handleGroupCreate"
    />
    <ModalDanger
      v-if="showModal == 'delete'"
      title="Tem certeza?"
      :content="
        showModal === 'delete'
          ? 'Esse grupo também será apagado para todos os participantes permanentemente.'
          : 'Ao sair do grupo, será necessário entrar com o mesmo código novamente.'
      "
      btnLabel="Apagar"
      @confirm="
        [
          { handleGroupDelete: showModal === 'delete' },
          { handleGroupLeave: showModal === 'sair' },
        ]
      "
      @closeModal="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCookie } from "nuxt/app";
import { insert, get } from "../crud";

const userCookie = useCookie("user-data");

const itemList = ref([]);
const selectedItemId = ref(null);
const loading = ref(true);
const groupListTop = ref(null);
const showModal = ref("");

function mapApiDataToFrontend(apiGroup) {
  const participants = apiGroup.participantNames.map((name, index) => ({
    id: index,
    name: name === userCookie.value?.name.split(" ")[0] ? "Você" : name,
    progress: 0,
    objective: "Não definido",
  }));

  return {
    id: apiGroup.id,
    title: apiGroup.name,
    picture: apiGroup.picture
      ? `data:image/jpeg;base64,${apiGroup.picture}`
      : null,
    code: apiGroup.invite_code,
    startDate: apiGroup.start_date,
    endDate: apiGroup.end_date,
    owner: "Você",
    participantCount: apiGroup.participantCount,
    participants: participants,
  };
}

async function getGroups() {
  try {
    loading.value = true;
    const response = await get("/group/progress");
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
    loading.value = false;
  }
}

async function handleGroupCreate(groupData) {
  try {
    const dataToSave = {
      name: groupData.name,
      picture: groupData.image,
      invite_code: null,
    };

    const response = await insert("group", dataToSave);

    if (!response.error) {
      await getGroups(); //
      closeModal();
    } else {
      console.error("Erro ao criar o grupo:", response.data);
      alert("Ocorreu um erro ao criar o grupo. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro na chamada da API para criar grupo:", error);
  }
}

function selectItem(id) {
  selectedItemId.value = id;
  groupListTop.value?.scrollIntoView({ behavior: "smooth" });
}

const openCreateModal = () => {
  showModal.value = "Criar";
};

const closeModal = () => {
  showModal.value = "";
};

const selectedItem = computed(() => {
  if (!selectedItemId.value) {
    return null;
  }
  return itemList.value.find((item) => item.id === selectedItemId.value);
});

onMounted(async () => {
  getGroups();
});
</script>
