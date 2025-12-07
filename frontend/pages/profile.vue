<template>
  <div class="px-4 sm:px-6 lg:mr-40 xl:mr-60 pb-12">
    <div class="flex justify-center mb-3">
      <div class="w-full max-w-4xl text-start">
        <h1 class="h1">Meu perfil</h1>
      </div>
    </div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl shadow-lg p-6 w-full max-w-4xl mx-auto"
    >
      <div class="flex items-center gap-4">
        <div
          class="relative hover:scale-110 active:scale-95 transition cursor-pointer group"
          @click="openAvatarModal()"
        >
          <img
            v-if="profilePicture"
            :src="profilePicture"
            alt="Foto de perfil"
            class="w-20 h-20 rounded-full object-cover border-2 border-p-200 shadow-md"
          />
          <div
            v-else
            class="w-20 h-20 flex items-center justify-center rounded-full bg-transparent border-purple-200"
          >
            <svg
              class="w-20 h-20 mb-3 mt-1 text-p-600 block drop-shadow-np"
              viewBox="36.5 20 165 165"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M65.3246 140.859C66.8926 143.004 69.9071 143.297 72.106 141.805C78.1062 137.736 84.6625 134.431 91.775 131.891C100.437 128.797 109.512 127.25 119 127.25C128.487 127.25 137.562 128.797 146.225 131.891C153.337 134.431 159.894 137.736 165.894 141.805C168.093 143.297 171.107 143.004 172.675 140.859C176.102 136.172 178.87 131.016 180.978 125.394C183.659 118.244 185 110.612 185 102.5C185 84.2125 178.572 68.6406 165.716 55.7844C152.859 42.9281 137.287 36.5 119 36.5C100.712 36.5 85.1406 42.9281 72.2844 55.7844C59.4281 68.6406 53 84.2125 53 102.5C53 110.612 54.3406 118.244 57.0219 125.394C59.1304 131.016 61.898 136.172 65.3246 140.859ZM119 110.75C110.887 110.75 104.047 107.966 98.4781 102.397C92.9094 96.8281 90.125 89.9875 90.125 81.875C90.125 73.7625 92.9094 66.9219 98.4781 61.3531C104.047 55.7844 110.887 53 119 53C127.112 53 133.953 55.7844 139.522 61.3531C145.091 66.9219 147.875 73.7625 147.875 81.875C147.875 89.9875 145.091 96.8281 139.522 102.397C133.953 107.966 127.112 110.75 119 110.75ZM119 185C107.587 185 96.8625 182.834 86.825 178.503C76.7875 174.172 68.0562 168.294 60.6312 160.869C53.2062 153.444 47.3281 144.712 42.9969 134.675C38.6656 124.637 36.5 113.912 36.5 102.5C36.5 91.0875 38.6656 80.3625 42.9969 70.325C47.3281 60.2875 53.2062 51.5562 60.6312 44.1312C68.0562 36.7062 76.7875 30.8281 86.825 26.4969C96.8625 22.1656 107.587 20 119 20C130.412 20 141.137 22.1656 151.175 26.4969C161.212 30.8281 169.944 36.7062 177.369 44.1312C184.794 51.5562 190.672 60.2875 195.003 70.325C199.334 80.3625 201.5 91.0875 201.5 102.5C201.5 113.912 199.334 124.637 195.003 134.675C190.672 144.712 184.794 153.444 177.369 160.869C169.944 168.294 161.212 174.172 151.175 178.503C141.137 182.834 130.412 185 119 185Z"
              />
            </svg>
          </div>
          <button
            @click="isOpen = false"
            class="hidden group-hover:flex absolute z-50 -top-1 -right-2 cursor-pointer p-1 bg-white rounded-full w-7 h-7 items-center justify-center shadow-xl"
          >
            <i class="fa-solid fa-pen text-p-600"></i>
          </button>
        </div>

        <div class="w-full">
          <p class="text-2xl font-bold text-p-950">{{ personalData.nome }}</p>
          <p class="text-gray-600 text-sm">{{ personalData.email }}</p>
        </div>
      </div>

      <Button
        mediumPurple
        class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
        icon="fa-solid fa-edit short flex justify-center"
        label="Editar"
        @click="openProfileModal('basic')"
      />
    </div>

    <div
      v-if="user.role === 'STANDARD'"
      class="bg-white rounded-3xl shadow-lg p-6 w-full max-w-4xl mx-auto mt-6"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="h2main">Dados Pessoais</h2>
        <Button
          mediumPurple
          class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
          icon="fa-solid fa-edit short flex justify-center"
          label="Editar"
          @click="openProfileModal('personal')"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col w-full gap-4">
          <InfoArea
            :value="
              personalData.idade
                ? `${personalData.idade} anos`
                : 'Não informado'
            "
            :title="'Idade'"
          />
          <InfoArea
            :value="
              personalData.peso ? `${personalData.peso} kg` : 'Não informado'
            "
            :title="'Peso'"
          />
          <InfoArea
            :value="
              personalData.meta ? `${personalData.meta} kg` : 'Não informado'
            "
            :title="'Meta de Peso'"
          />
          <InfoArea
            :value="personalData.objetivo || 'Não informado'"
            :title="'Objetivo'"
          />
        </div>
        <div class="flex flex-col w-full gap-4">
          <InfoArea
            :value="personalData.sexo || 'Não informado'"
            :title="'Sexo'"
          />
          <InfoArea
            :value="
              personalData.altura
                ? `${personalData.altura} cm`
                : 'Não informado'
            "
            :title="'Altura'"
          />
          <InfoArea
            :array="
              personalData.restricoes == ''
                ? ['Nenhuma']
                : personalData.restricoes || 'Não informado'
            "
            :title="'Restrições Alimentares'"
          />
        </div>
      </div>
    </div>

    <div
      v-if="user.role === 'STANDARD'"
      class="bg-white rounded-3xl shadow-lg p-6 w-full max-w-4xl mx-auto mt-6"
    >
      <h2 class="h2main mb-6">Nutricionista</h2>
      <div
        v-if="personalData.nutritionistName"
        class="flex items-center justify-between w-full"
      >
        <div
          class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
        >
          <div
            class="w-16 h-16 rounded-full bg-p-100 flex items-center justify-center text-p-600 text-2xl font-bold"
          >
            {{ personalData.nutritionistName.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-800">
              {{ personalData.nutritionistName }}
            </p>
            <p class="text-gray-500 text-sm">Seu nutricionista vinculado</p>
          </div>
        </div>
        <Button
          red
          class="w-max pr-3 pl-2 h-[42px]"
          icon="fa-solid fa-link-slash short flex justify-center"
          label="Desvincular"
          @click="openUnlinkModal"
          :loading="unlinking"
        />
      </div>
      <div v-else class="flex flex-col gap-4">
        <p class="text-gray-600">
          Você não tem um nutricionista vinculado. Insira o código fornecido
          pelo seu nutricionista para vincular.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 max-w-md w-full">
          <Input
            class="bg-white shadow-lg shadow-gray-600/10 focus-within:shadow-p-600/20 hover:shadow-p-600/20 transition uppercase"
            v-model="inviteCode"
            placeholder="Código de vínculo (ex: A1B2)"
          />
          <Button
            mediumPurple
            class="w-full sm:w-max px-6 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
            label="Vincular"
            @click="linkNutritionist"
            :loading="linking"
          />
        </div>
      </div>
    </div>
    <div
      v-if="user.role === 'PROFESSIONAL'"
      class="bg-white rounded-3xl shadow-lg p-6 w-full max-w-4xl mx-auto mt-6"
    >
      <h2 class="h2main mb-6">Código de vínculo</h2>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-4 w-[70%]">
          <p class="text-md font-normal text-gray-600">
            Consulte seu código e informe-o ao seu paciente para que ele possa
            se vincular a você.
          </p>
        </div>
        <Button
          mediumPurple
          class="w-max px-3 h-[42px] text-nowrap"
          icon="fa-solid fa-key short flex justify-center"
          label="Código"
          @click="fetchInviteCode"
        />
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row gap-4 items-center sm:justify-between bg-white rounded-3xl shadow-lg p-6 w-full max-w-4xl mx-auto mt-10 border-2 border-danger text-center sm:text-left"
    >
      <h2 class="text-2xl font-semibold w-full text-start text-danger">
        Apagar conta
      </h2>
      <Button
        red
        class="sm:ml-2 w-full sm:w-auto"
        icon="fa-regular fa-trash-can"
        label="Apagar"
        @click="openDangerModal('delete')"
      />
    </div>

    <ProfileEditModal
      v-if="showModal == 'profileEdit'"
      :key="activeSection"
      :section="activeSection"
      :user-data="
        activeSection === 'basic'
          ? { name: user.name, email: user.email }
          : personalData
      "
      @close="closeModal"
    />
    <ModalAvatarEdit
      v-if="showModal == 'avatarEdit'"
      :title="showModal"
      :current-image="imageToEdit"
      @close="closeModal"
      @save="handleAvatarSave"
    />
    <ModalAvatarAdd
      v-if="showModal == 'avatarAdd'"
      @close="closeModal"
      @imageSelected="handleImageSelected"
    />
    <ModalDanger
      v-if="showModal == 'delete'"
      title="Tem certeza?"
      content="Ao apagar sua conta, ela será desativada e você não terá mais acesso ao sistema."
      btnLabel="Apagar"
      @confirm="handleDeleteAccount"
      @closeModal="closeModal"
    />
    <ModalDanger
      v-if="showModal == 'unlink'"
      title="Desvincular Nutricionista?"
      content="Ao desvincular, você deixará de compartilhar seus dados com este nutricionista."
      btnLabel="Desvincular"
      @confirm="handleUnlinkNutritionist"
      @closeModal="closeModal"
    />
    <teleport to="body">
      <Transition
        name="modal"
        appear
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
        enter-active-class="transition-opacity duration-300 ease"
        leave-active-class="transition-opacity duration-300 ease"
      >
        <div
          v-if="showInviteModal"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
          @click.self="showInviteModal = false"
        >
          <div
            class="bg-white rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-lg relative flex flex-col gap-5 items-center"
          >
            <button
              class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-[50]"
              @click="showInviteModal = false"
            >
              &times;
            </button>
            <h2 class="text-2xl font-semibold text-p-600">Código de Vínculo</h2>
            <p class="text-center text-gray-600">
              Compartilhe este código com seu paciente para que ele possa se
              vincular a você.
            </p>

            <div
              class="bg-gray-100 p-6 rounded-xl w-full flex justify-center items-center border-2 border-dashed border-p-400 relative"
            >
              <span
                class="text-4xl sm:text-5xl font-bold text-p-700 tracking-widest"
              >
                {{ inviteCode }}</span
              >
              <div class="absolute -bottom-3 -right-3">
                <Button
                  mediumPurple
                  class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"
                  icon="fa-solid fa-rotate-right"
                  @click="regenerateInviteCode"
                  :loading="loading"
                />
              </div>
            </div>

            <p class="text-sm text-gray-500" v-if="inviteCodeExpiresAt">
              Válido até:
              {{ new Date(inviteCodeExpiresAt).toLocaleTimeString() }}
            </p>

            <Button
              mediumPurple
              class="w-full h-[42px]"
              icon="fa-regular fa-copy short flex justify-center"
              label="Copiar e fechar"
              @click="copyAndClose"
            />
          </div>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { useCookie, useNuxtApp, navigateTo } from "nuxt/app";
import { get, remove, update, insert } from "../crud";

const { $axios } = useNuxtApp();

const ProfileEditModal = defineAsyncComponent(() =>
  import("../components/ProfileEditModal.vue")
);

const userCookie = useCookie("user-data");
const user = ref(userCookie.value);

const showModal = ref("");
const activeSection = ref(null);
const profilePicture = ref(null);
const imageToEdit = ref(null);
const showInviteModal = ref(false);
const loading = ref(true);
const inviteCodeExpiresAt = ref(null);

const inviteCode = ref("");
const linking = ref(false);

const personalData = ref({
  nome: userCookie.value?.name || "",
  email: userCookie.value?.email || "",
  idade: null,
  sexo: "",
  altura: null,
  peso: null,
  restricoes: [],
  objetivo: "",
  preferencias: "",
  meta: null,
  nutritionistName: null,
});

const openProfileModal = (section) => {
  activeSection.value = section;
  showModal.value = "profileEdit";
};

const openAvatarModal = () => {
  imageToEdit.value = null;
  showModal.value = "avatarAdd";
};

const openDangerModal = () => {
  showModal.value = "delete";
};

const closeModal = (shouldReload = false) => {
  showModal.value = "";
  activeSection.value = null;
  imageToEdit.value = null;
  if (shouldReload) {
    window.location.reload();
  }
};

const fetchInviteCode = async () => {
  loading.value = true;
  try {
    const res = await get("nutritionist/invite-code");
    if (res.success) {
      inviteCode.value = res.data.code;
      inviteCodeExpiresAt.value = res.data.expiresAt;
      showInviteModal.value = true;
    } else {
      alert("Erro ao buscar código: " + (res.message || "Erro desconhecido"));
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar código");
  } finally {
    loading.value = false;
  }
};

const regenerateInviteCode = async () => {
  loading.value = true;
  try {
    const res = await insert("nutritionist/invite-code", {});
    if (res.success) {
      inviteCode.value = res.data.code;
      inviteCodeExpiresAt.value = res.data.expiresAt;
    } else {
      alert("Erro ao gerar código: " + (res.message || "Erro desconhecido"));
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao gerar código");
  } finally {
    loading.value = false;
  }
};

const copyAndClose = async () => {
  if (inviteCode.value) {
    try {
      await navigator.clipboard.writeText(inviteCode.value);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
  showInviteModal.value = false;
};

const handleImageSelected = (imageData) => {
  imageToEdit.value = imageData;
  showModal.value = "avatarEdit";
};

const handleAvatarSave = async (croppedImageData) => {
  const payload = {
    profile_picture: croppedImageData,
  };

  try {
    const response = await update("user", payload);

    if (response && !response.error) {
      closeModal(true);
    } else {
      console.error("Erro ao atualizar a foto:", response);
      alert("Ocorreu um erro ao salvar sua foto. Tente novamente.");
      closeModal();
    }
  } catch (error) {
    console.error("Erro na chamada da API:", error);
    alert("Ocorreu um erro na comunicação com o servidor.");
    closeModal();
  }
};

const handleDeleteAccount = async () => {
  const response = await remove("user");
  if (response && response.error) {
    console.error(
      "Erro ao apagar conta:",
      response.message || "Erro desconhecido"
    );
    return;
  }

  closeModal();
  await navigateTo("/");
};

const linkNutritionist = async () => {
  if (!inviteCode.value) {
    alert("Por favor, insira o código.");
    return;
  }
  linking.value = true;
  try {
    const res = await insert("nutritionist/link-patient", {
      code: inviteCode.value.toUpperCase(),
    });
    if (res.success) {
      // alert("Vinculado com sucesso!");
      const dataRes = await $axios.get("/user/personal-data");
      if (dataRes.data.success) {
        personalData.value = dataRes.data.data;
      }
      inviteCode.value = "";
    } else {
      alert(
        "Erro ao vincular: " + (res.message || "Código inválido ou expirado.")
      );
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao vincular. Tente novamente.");
  } finally {
    linking.value = false;
  }
};

const unlinking = ref(false);

const openUnlinkModal = () => {
  showModal.value = "unlink";
};

const handleUnlinkNutritionist = async () => {
  unlinking.value = true;
  try {
    const res = await remove("patient/nutritionist");
    if (res.success) {
      personalData.value.nutritionistName = null;
      closeModal();
    } else {
      alert("Erro ao desvincular: " + (res.message || "Erro desconhecido."));
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao desvincular. Tente novamente.");
  } finally {
    unlinking.value = false;
  }
};

async function fetchProfilePicture() {
  try {
    const response = await $axios.get("user/profile_picture");

    if (response.data && response.data.success && response.data.data) {
      const bufferData = Object.values(response.data.data);

      let binaryString = "";
      const chunkSize = 8192;
      const uint8Array = new Uint8Array(bufferData);
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        binaryString += String.fromCharCode.apply(null, chunk);
      }
      const base64String = btoa(binaryString);

      profilePicture.value = `data:image/jpeg;base64,${base64String}`;
    }
  } catch (error) {
    console.error("Erro ao buscar a foto de perfil:", error);
  }
}

onMounted(async () => {
  if (user.value.role === "STANDARD") {
    try {
      const res = await $axios.get("/user/personal-data");
      if (res.data.success) {
        personalData.value = res.data.data;
      }
    } catch (err) {
      console.error("Erro ao buscar dados pessoais:", err);
    }
  }
  await fetchProfilePicture();
});
</script>
