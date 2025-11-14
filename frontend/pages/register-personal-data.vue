<template>
  <div class="flex flex-col items-center justify-start w-full max-h-screen p-8">
    <h2 class="text-4xl font-semibold text-p-600 text-center mb-8">
      Vamos cadastrar seus dados pessoais!
    </h2>
    <Card>
      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-1">
          <Label class="mb-2" label="Que dia você nasceu?" />
          <Input type="date" v-model="form.birth_date" placeholder="Data de nascimento" required />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Qual gênero você se identifica?" />
          <Select v-model="form.gender" :options="genderOptions" required />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Qual é seu peso?" />
          <Input type="number" v-model.number="form.weight" placeholder="Seu peso em kg" required />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Qual é a sua altura? (ex: 170cm)" />
          <Input type="number" v-model.number="form.height" placeholder="Sua altura em cm" required />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Você tem alguma restrição alimentar?" />
          <Select v-model="form.restrictions" :options="restrictionOptions" multiple required />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Você tem alguma preferência alimentar?" />
          <Select v-model="form.preferences" :options="preferenceOptions" multiple required />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Qual é seu objetivo?" />
          <Select v-model="form.objective" :options="objectiveOptions" multiple required />
        </div>
        <div class="col-span-2 flex justify-center gap-3 mt-8">
          <Button gray outlined class="w-max px-3 h-[42px] shadow-lg border-2 border-gray-300 transition" @click="navigateTo('/profile')">
            Pular
          </Button>
          <Button mediumPurple @click.prevent="save"> Salvar </Button>
        </div>
      </div>
    </Card>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { get, update } from "../crud";

definePageMeta({
  hideTopBar: false,
  hideSideBar: true,
});

const form = ref({
  birth_date: "",
  gender: "",
  weight: null, // number
  height: null, // number
  restrictions: [], // array of ids
  preferences: [], // array de ids
  objective: [] // array de ids
});

const genderOptions = [
  { value: "FEM", label: "Feminino" },
  { value: "MASC", label: "Masculino" },
  { value: "OTHER", label: "Outro" },
  { value: "NONE", label: "Prefiro não informar" },
];
const restrictionOptions = ref([]);
const preferenceOptions = ref([]);
const objectiveOptions = ref([]);

onMounted(async () => {
  const selectRoutes = [
    { route: "restriction", target: restrictionOptions },
    { route: "preference", target: preferenceOptions },
    { route: "objective", target: objectiveOptions },
  ];
  await Promise.all(selectRoutes.map(({ route, target }) => getSelectItems(route, target)));
});

async function save() {
  const payload = {
    ...form.value,
    weight: Number(form.value.weight) ?? null,
    height: Number(form.value.height) ?? null,
    restrictions: form.value.restrictions ? [form.value.restrictions] : [],
    preferences: form.value.preferences ? [form.value.preferences] : [],
    objectives: form.value.objective ? [form.value.objective] : [],
  };
  await update("user/personal-data", payload);
}

async function getSelectItems(route, target) {
  const response = await get(route);
  target.value = (response.data || []).map(item => ({ value: item.id, label: item.name }));
}
</script>
