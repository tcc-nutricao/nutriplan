<template>
  <div class="flex flex-col items-center justify-start w-full max-h-screen p-8">
    <h2 class="text-4xl font-semibold text-p-600 text-center mb-8">
      Vamos cadastrar seus dados pessoais!
    </h2>
    <div class="bg-white rounded-3xl shadow-lg p-8 w-full max-w-5xl">
      <div class="grid grid-cols-2 gap-6">
        <div v-for="input in inputValues" :key="input.ref" class="col-span-1">
          <Label class="mb-2" :label="input.label" />
          <Select
            v-if="input.type === 'select'"
            :ref="input.ref"
            :options="input.options"
            v-model="input.value"
            required
          />
          <Input
            v-else
            :type="input.type"
            :ref="input.ref"
            :placeholder="input.placeholder"
            v-model="input.value"
            required
          />
          <div v-if="input.error" class="text-red-500 text-sm mt-1">
            {{ input.error }}
          </div>
        </div>

        <div class="col-span-2 flex justify-center gap-3 mt-8">
          <Button
            gray
            outlined
            class="w-max px-3 h-[42px] shadow-lg border-2 border-gray-300 transition"
            @click="navigateTo('/profile')"
          >
            Pular
          </Button>
          <Button mediumPurple @click.prevent="submitForm"> Salvar </Button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
//Imports 
import { ref, onMounted } from "vue";
import { insert, search, update } from "../crud";
import { useRouter } from "vue-router";

const router = useRouter();

const route = ref("objective");

definePageMeta({
  hideTopBar: false,
  hideSideBar: true,
});

const inputValues = ref([
  {
    label: "Que dia você nasceu?",
    type: "date",
    placeholder: "Data de nascimento",
    ref: "birth_date",
    value: "",
    error: "",
  },
  {
    label: "Qual gênero você se identifica?",
    type: "select",
    placeholder: "Selecione",
    ref: "gender",
    value: "",
    error: "",
    options: [
      { value: "Feminino", label: "Feminino" },
      { value: "Masculino", label: "Masculino" },
      { value: "Outro", label: "Outro" },
      { value: "Prefiro não informar", label: "Prefiro não informar" },
    ],
  },
  {
    label: "Qual é seu peso?",
    type: "number",
    placeholder: "Seu peso em kg",
    value: "",
    error: "",
    ref: "weight",
  },
  {
    label: "Qual é a sua altura? (ex: 170cm)",
    type: "number",
    placeholder: "Sua altura em cm",
    value: "",
    error: "",
    ref: "height",
  },
  {
    label: "Você tem alguma restrição alimentar?",
    type: "select",
    placeholder: "Selecione",
    ref: "restrictions",
    value: "",
    error: "",
    options: [
      { value: "Nenhuma", label: "Nenhuma" },
      { value: "Sem glúten", label: "Sem glúten" },
      { value: "Sem lactose", label: "Sem lactose" },
      { value: "Vegano", label: "Vegano" },
      { value: "Vegetariano", label: "Vegetariano" },
    ],
  },
  {
    label: "Você tem alguma preferência alimentar?",
    type: "select",
    placeholder: "Selecione",
    ref: "preferences",
    value: "",
    error: "",
    options: [
      { value: "Nenhuma", label: "Nenhuma" },
      { value: "Dieta Vegetariana", label: "Dieta Vegetariana" },
      { value: "Dieta low carb", label: "Dieta low carb" },
      { value: "Dieta plant-based", label: "Dieta plant-based" },
      { value: "Dieta balanceada", label: "Dieta balanceada" },
    ],
  },
  {
    label: "Qual é seu objetivo?",
    type: "select",
    placeholder: "Selecione",
    ref: "objective",
    value: "",
    error: "",
    options: [],
  },
]);

const userData = ref(null);

onMounted(async () => {
  getObjectives();
});

function submitForm() {
  let isFormValid = true;
  inputValues.value.forEach((input) => {
    if (!input.value) {
      input.error = "Este campo é obrigatório";
      isFormValid = false;
    } else {
      input.error = "";
    }
  });

  if (!isFormValid) {
    console.log("Formulário inválido. Corrija os erros.");
    return;
  }

  const formData = {
    birth_date: inputValues.value.find((f) => f.ref === "birth_date").value,
    gender: mapGender(inputValues.value.find((f) => f.ref === "gender").value),
    height: parseFloat(inputValues.value.find((f) => f.ref === "height").value),
    weight: parseFloat(inputValues.value.find((f) => f.ref === "weight").value),
    restrictions: mapRestrictions(
      inputValues.value.find((f) => f.ref === "restrictions").value
    ),
    preferences: mapPreferences(
      inputValues.value.find((f) => f.ref === "preferences").value
    ),
    objectives: [inputValues.value.find((f) => f.ref === "objective").value],
  };
  handleSubmit(formData);
}

function mapGender(inputGender) {
  if (inputGender === "Feminino") return "FEM";
  if (inputGender === "Masculino") return "MASC";
  return "NONE";
}

function mapRestrictions(input) {
  if (input === "Nenhuma") return [];
  return []; // , mapeia os IDs das restrições aqui
}

function mapPreferences(input) {
  if (input === "Nenhuma") return [];
  return []; // ajustar com o ID da entidade
}

function handleSubmit(formData) {
  console.log("Dados recebidos do formulário:", formData);

  update("user/personal-data", "", formData)
    .then((res) => {
      if (res.error) {
        console.error("Erro ao salvar dados:", res);
        alert("Erro ao salvar os dados. Tente novamente.");
      } else {
        console.log("Dados salvos com sucesso:", res);
        navigateTo("/profile");
      }
    })
    .catch((err) => {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição. Tente novamente.");
    });
}
function getObjectives() {
  const response = search(route.value, null);
  response.then((response) => {
    const options = response.data.map((item) => ({
      value: item.id,
      label: item.description,
    }));
    const objectiveInput = inputValues.value.find((i) => i.ref === "objective");
    if (objectiveInput) {
      objectiveInput.options = options;
    }
  });
}
</script>
