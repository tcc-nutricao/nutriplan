<template>
  <div class="bg-white rounded-2xl shadow p-6 w-full max-w-4xl mx-auto mt-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-purple-700">Dados Pessoais</h2>
      <!-- <button
        class="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-lg transition font-medium"
        @click="$emit('edit')"
      >
        Editar
      </button> -->
      <button @click="$emit('edit')">Editar</button>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <p class="text-gray-600 text-sm">Idade</p>
        <p class="info-box">{{ idade }} anos</p>
      </div>

      <div>
        <p class="text-gray-600 text-sm">Sexo</p>
        <p class="info-box">{{ sexo }}</p>
      </div>

      <div>
        <p class="text-gray-600 text-sm">Altura</p>
        <p class="info-box">{{ altura }} cm</p>
      </div>

      <div>
        <p class="text-gray-600 text-sm">Peso</p>
        <p class="info-box">{{ peso }} kg</p>
      </div>

      <div>
        <p class="text-gray-600 text-sm">Restrições Alimentares</p>
        <p class="info-box">{{ restricoes }}</p>
      </div>

      <div>
        <p class="text-gray-600 text-sm">Objetivo</p>
        <p class="info-box">{{ objetivo }}</p>
      </div>

      <div class="col-span-2">
        <p class="text-gray-600 text-sm">Preferências</p>
        <p class="info-box">{{ preferencias }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  idade: { type: Number, default: null },
  sexo: { type: String, default: "" },
  altura: { type: Number, default: null },
  peso: { type: Number, default: null },
  restricoes: { type: String, default: "Não informado" },
  objetivo: { type: String, default: "Não informado" },
  preferencias: { type: String, default: "Não informado" },
});

defineEmits(["edit"]);

</script>

<style scoped>
.info-box {
  @apply bg-purple-50 text-purple-800 font-semibold px-3 py-1 rounded-md inline-block;
}
</style>
