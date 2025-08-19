<template>
  <div class="w-fit flex flex-col items-center p-5 bg-gradient-to-br from-p-500 via-p-600 to-p-700 rounded-xl h-fit">
    <div class="bg-white flex flex-col items-center mb-3 p-5 rounded-xl">
      <div class="w-[60px] p-3 flex items-center justify-center border-2 border-p-600 rounded-full mb-3">
        <i class="text-p-600 fa-solid fa-user text-2xl"></i>
      </div>

      <p class="text-p-950 font-sora text-xl font-semibold">Ana Beatriz</p>
      <p class="text-p-950 font-sora font-light text-sm">anabeatriz@gmail.com</p>
    </div>

    <ListItem :items="items" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
    { label: 'Plano Alimentar', route: '/' },
    { label: 'Diário Alimentar', route: '/' },
    { label: 'Meu Progresso', route: '/' },
    { label: 'Receitas', route: '/' },
    { label: 'Meus Grupos', route: '/' }
])
</script>
