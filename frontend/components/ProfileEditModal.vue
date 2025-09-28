<template>
  <teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto"
      >
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-50"
          @click="$emit('close')"
        >
          ✕
        </button>

        <h2 class="text-xl font-bold text-purple-700 mb-4">
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

        <button
          class="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Salvar
        </button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  section: { type: String, required: true },
});
defineEmits(["close"]);
</script>
