<template>
  <teleport to="body">
    <Transition name="modal" appear>
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      @click.self="$emit('close', false)"
    >
      <div
        class="bg-white rounded-3xl py-7 px-9 w-full shadow-lg relative max-h-[90vh] overflow-y-auto modal-container"
        :class="section === 'basic' ? 'max-w-lg' : 'max-w-3xl'"
      >
        <button
          class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
          @click="$emit('close', false)"
        >&times;
        </button>

        <h2 class="text-2xl font-semibold text-np mb-4">
          Editar
          {{ section === "basic" ? "Perfil" : "dados pessoais" }}
        </h2>

        <div v-if="section === 'basic'">
          <InputText
            class="mb-5"
            label="Nome"
            v-model="basicFormData.name"
            placeholder="Insira o Nome" />
          <InputEmail
            class="mb-5"
            label="Email"
            v-model="basicFormData.email"
            placeholder="Insira o Email" />
          <InputPassword 
            class="mb-5"
            label="Senha Atual"
            v-model="basicFormData.currentPassword"
            placeholder="Insira sua senha atual" />
          <InputPassword 
            class="mb-5"
            label="Nova Senha"
            v-model="basicFormData.newPassword"
            placeholder="Insira a nova senha" />
        </div>

        <div v-else class="flex w-full justify-between gap-3">
          <div class="flex flex-col w-full">
            <InputText
            class="mb-5"
            label="Data de Nascimento"
            type="date"
            v-model="personalFormData.birth_date"
            placeholder="Insira sua data de nascimento" />
            <InputText
            class="mb-5"
            label="Peso"
            type="number"
            v-model="personalFormData.weight"
            placeholder="Digite aqui" />
            <InputText
            class="mb-5"
            label="Restrições Alimentares"
            v-model="personalFormData.restrictions"
            placeholder="Digite aqui" />
          </div>
          <div class="flex flex-col w-full">
          <InputText
            class="mb-5"
            label="Sexo"
            v-model="personalFormData.gender"
            placeholder="Digite aqui" />
          <InputText
            class="mb-5"
            label="Altura"
            type="number"
            v-model="personalFormData.height"
            placeholder="Digite aqui" />
          <InputText
            class="mb-5"
            label="Objetivo"
            v-model="personalFormData.objectives"
            placeholder="Digite aqui" />
          </div>
        </div>
        <div class="flex justify-center mt-6">
          <Button mediumPurple
          @click="handleSubmit"
          class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition" label="Salvar" 
        />
        </div>
      </div>
    </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { update } from "../crud";
import { useCookie } from "nuxt/app";

const props = defineProps({
  section: { type: String, required: true },
});
const emit = defineEmits(["close"]);

// Valores dos campos para a seção basic
const basicFormData = ref({
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
});

// Valores dos campos para a seção personal
const personalFormData = ref({
  birth_date: "",
  gender: "",
  height: "",
  weight: "",
  restrictions: [],
  preferences: [],
  objectives: [],
});

const userCookie = useCookie("user-data");

async function handleSubmit() {
  if (props.section === "basic") {
    const formData = {
      name: basicFormData.value.name,
      email: basicFormData.value.email,
      currentPassword: basicFormData.value.currentPassword,
      newPassword: basicFormData.value.newPassword,
    };

    try {
      const res = await update("user", formData);
      if (res.error) {
        console.error("Erro ao atualizar perfil:", res);
        alert("Erro ao atualizar perfil. Tente novamente.");
      } else {
        console.log("Perfil atualizado com sucesso:", res.data.data);

        // Atualiza o cookie com os novos dados do usuário
        const updatedUser = res.data;
        userCookie.value.name = updatedUser.name;
        userCookie.value.email = updatedUser.email;

        alert("Perfil atualizado com sucesso!");
        emit("close", true); // Emitir 'true' para indicar sucesso e recarregar
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição. Tente novamente.");
    }
  } else {
    // Atualizar dados pessoais
    const formData = {
      birth_date: personalFormData.value.birth_date,
      gender: personalFormData.value.gender,
      height: parseFloat(personalFormData.value.height),
      weight: parseFloat(personalFormData.value.weight),
      restrictions: personalFormData.value.restrictions,
      preferences: personalFormData.value.preferences,
      objectives: personalFormData.value.objectives,
    };

    try {
      const res = await update("user/personal-data", formData);
      if (res.error) {
        console.error("Erro ao atualizar dados pessoais:", res);
        alert("Erro ao atualizar dados pessoais. Tente novamente.");
      } else {
        console.log("Dados pessoais atualizados com sucesso:", res.data.data);
        alert("Dados pessoais atualizados com sucesso!");
        emit("close", true); // Emitir 'true' para indicar sucesso e recarregar
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição. Tente novamente.");
    }
  }
}
</script>

<style>
.modal-enter-from {
opacity: 0;
}
.modal-enter-from .modal-container {
transform: scale(0.9);
}

.modal-leave-to {
opacity: 0;
}
.modal-leave-to .modal-container {
transform: scale(0.9);
}

.modal-enter-active,
.modal-leave-active {
transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
transition: transform 0.3s ease;
}
</style>