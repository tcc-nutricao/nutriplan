<template>
  <teleport to="body">
    <Transition name="modal" appear>
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto modal-container"
      >
        <button
          class="absolute top-3 right-4 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
          @click="$emit('close')"
        >&times;
        </button>

        <h2 class="text-2xl font-semibold text-np mb-4">
          Editar
          {{ section === "basic" ? "Perfil" : "dados pessoais" }}
        </h2>

        <div v-if="section === 'basic'">
          <label class="block mb-2">
            Nome:
            <input
              type="text"
              class="border rounded w-full p-2 mt-1"
              placeholder="Digite seu nome"
            />
          </label>

          <label class="block mb-2">
            Email:
            <input
              type="email"
              class="border rounded w-full p-2 mt-1"
              placeholder="Digite seu email"
            />
          </label>

          <label class="block mb-2">
            Senha atual:
            <input
              type="password"
              class="border rounded w-full p-2 mt-1"
              placeholder="Digite sua senha"
            />
          </label>

          <label class="block mb-2">
            Nova senha:
            <input
              type="password"
              class="border rounded w-full p-2 mt-1"
              placeholder="Digite a nova senha"
            />
          </label>
        </div>

        <div v-else>
          <label class="block mb-2">
            Idade:
            <input type="number" class="border rounded w-full p-2 mt-1" />
          </label>

          <label class="block mb-2">
            Sexo:
            <input type="text" class="border rounded w-full p-2 mt-1" />
          </label>

          <label class="block mb-2">
            Altura:
            <input type="number" class="border rounded w-full p-2 mt-1" />
          </label>

          <label class="block mb-2">
            Peso:
            <input type="number" class="border rounded w-full p-2 mt-1" />
          </label>

          <label class="block mb-2">
            Restrições Alimentares:
            <input type="text" class="border rounded w-full p-2 mt-1" />
          </label>

          <label class="block mb-2">
            Objetivo:
            <input type="text" class="border rounded w-full p-2 mt-1" />
          </label>

          <label class="block mb-2">
            Preferências:
            <input type="text" class="border rounded w-full p-2 mt-1" />
          </label>
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