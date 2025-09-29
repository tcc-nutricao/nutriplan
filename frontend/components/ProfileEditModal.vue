<template>
  <teleport to="body">
    <Transition name="modal" appear>
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white rounded-3xl py-7 px-9 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto modal-container"
      >
        <button
          class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
          @click="$emit('close')"
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
            placeholder="Insira o Nome" />
          <InputEmail
            class="mb-5"
            label="Email"
            placeholder="Insira o Email" />
          <InputPassword 
            class="mb-5"
            label="Senha Atual"
            placeholder="Insira sua senha atual" />
          <InputPassword 
            class="mb-5"
            label="Nova Senha"
            placeholder="Insira a nova senha" />
        </div>

        <div v-else>
          <InputText
            class="mb-5"
            label="Idade"
            placeholder="Insira sua idade" />
          <InputText
            class="mb-5"
            label="Sexo"
            placeholder="Digite aqui" />
          <InputText
            class="mb-5"
            label="Altura"
            placeholder="Digite aqui" />
          <InputText
            class="mb-5"
            label="Peso"
            placeholder="Digite aqui" />
          <InputText
            class="mb-5"
            label="Restrições Alimentares"
            placeholder="Digite aqui" />
          <InputText
            class="mb-5"
            label="Objetivo"
            placeholder="Digite aqui" />
          <InputText
            class="mb-5"
            label="Preferências"
            placeholder="Digite aqui" />
        </div>
        <div class="flex justify-center mt-6">

          <Button mediumPurple
          class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition" label="Salvar" 
        />
        </div>
      </div>
    </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  section: { type: String, required: true },
});
defineEmits(["close"]);
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