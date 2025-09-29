<template>

 <div class=" flex items-start justify-center w-full min-h-screen p-8">
  <PersonalDataRegister
  class="lg:mr-40"
  :initial-data="userData"
  @submit="handleSubmit"
  />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PersonalDataRegister from "@/components/PersonalDataRegister.vue";

// guardar dados do back
const userData = ref(null);

onMounted(async () => {
  // chamar a API
  const response = await fetch("/api/user/personal-data");
  userData.value = await response.json();
});

function handleSubmit(formData) {
  console.log("Dados recebidos do formulário:", formData);

  //API de update
  fetch("/api/user/personal-data", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}
</script>
