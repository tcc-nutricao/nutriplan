<template>
  <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl">
    <h2 class="text-2xl font-bold text-purple-700 text-center mb-8">
      Vamos cadastrar seus dados pessoais!
    </h2>

    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <label class="label-text">Que dia você nasceu?</label>
        <input
          v-model="form.idade"
          type="date"
          class="input-box"
          placeholder="dd/mm/aaaa"
        />
      </div>

      <div class="col-span-1">
        <label class="label-text">Qual gênero você se identifica?</label>
        <select v-model="form.sexo" class="input-box">
          <option disabled value="">Selecione</option>
          <option>Feminino</option>
          <option>Masculino</option>
          <option>Outro</option>
          <option>Prefiro não informar</option>
        </select>
      </div>

      <div class="col-span-1">
        <label class="label-text">Qual é a sua altura?</label>
        <div class="flex">
          <input
            v-model="form.altura"
            type="number"
            class="input-box rounded-r-none"
            placeholder="cm"
          />
          <span class="input-addon">cm</span>
        </div>
      </div>

      <div class="col-span-1">
        <label class="label-text">Qual é o seu peso?</label>
        <div class="flex">
          <input
            v-model="form.peso"
            type="number"
            class="input-box rounded-r-none"
            placeholder="kg"
          />
          <span class="input-addon">kg</span>
        </div>
      </div>

      <div class="col-span-1">
        <label class="label-text">Você tem alguma restrição alimentar?</label>
        <select v-model="form.restricoes" class="input-box">
          <option disabled value="">Selecione</option>
          <option>Nenhuma</option>
          <option>Sem glúten</option>
          <option>Sem lactose</option>
          <option>Vegano</option>
          <option>Vegetariano</option>
        </select>
      </div>

      <div class="col-span-1">
        <label class="label-text">Qual é o seu objetivo?</label>
        <select v-model="form.objetivo" class="input-box">
          <option disabled value="">Selecione</option>
          <option>Perder peso</option>
          <option>Ganhar massa muscular</option>
          <option>Manter peso</option>
          <option>Melhorar hábitos</option>
        </select>
      </div>

      <div class="col-span-2">
        <label class="label-text">Você tem alguma preferência alimentar?</label>
        <select v-model="form.preferencias" class="input-box">
          <option disabled value="">Selecione</option>
          <option>Dieta Vegetariana</option>
          <option>Dieta low carb</option>
          <option>Dieta plant-based</option>
          <option>Dieta balanceada</option>
        </select>
      </div>

      <Select :label="'teste'"/>


      <div class="col-span-2 flex justify-center mt-8">
        <Button mediumPurple
          class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
          @click="submitForm"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["submit"]);

const form = reactive({
  idade: null,
  sexo: "",
  altura: null,
  peso: null,
  restricoes: "",
  objetivo: "",
  preferencias: "",
});

watch(
  () => props.initialData,
  (newData) => {
    Object.assign(form, newData);
  },
  { immediate: true }
);

function submitForm() {
  emit("submit", { ...form });
}
</script>

<style scoped>
.input-box {
  @apply border border-purple-300 rounded-lg px-3 py-2 w-full 
    focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700;
}

.input-addon {
  @apply bg-purple-100 text-purple-700 px-3 flex items-center rounded-r-lg border border-purple-300;
}

.label-text {
  @apply text-gray-700 text-sm mb-2 block font-medium;
}
</style>
