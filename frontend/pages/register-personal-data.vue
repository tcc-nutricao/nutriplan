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
          <Button
            mediumPurple
            class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
            @click="submitForm"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { search, insert, update } from "../crud";
import { useRouter } from "vue-router";

const router = useRouter();

const route_objective = ref("objective");
const route_patient = ref("patient");

//  Aqui precisa ter acesso ao usuário logado
const userData = ref({ id: 4 }); // substitua isso pelo user logado real

definePageMeta({
  hideTopBar: false,
  hideSideBar: true,
});

const inputValues = ref([
  {
    label: "Qual é a sua data de nascimento?",
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
      { value: "FEM", label: "Feminino" },
      { value: "MASC", label: "Masculino" },
      { value: "NONE", label: "Prefiro não informar" },
    ],
  },
  {
    label: "Qual é seu peso?",
    type: "number",
    placeholder: "Seu peso em kg",
    ref: "weight",
    value: "",
    error: "",
  },
  {
    label: "Qual é a sua altura? (ex: 170cm)",
    type: "number",
    placeholder: "Sua altura em cm",
    ref: "height",
    value: "",
    error: "",
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

onMounted(async () => {
  await getData();
});

function validateForm() {
  let isFormValid = true;
  inputValues.value.forEach((input) => {
    if (
      !input.value &&
      input.ref !== "restrictions" &&
      input.ref !== "preferences"
    ) {
      input.error = "Este campo é obrigatório";
      isFormValid = false;
    } else {
      input.error = "";
    }
  });
  return isFormValid;
}

async function submitForm() {
  if (!validateForm()) {
    console.log("Formulário inválido. Corrija os erros.");
    return;
  }

  const formData = inputValues.value.reduce((acc, field) => {
    acc[field.ref] = field.value;
    return acc;
  }, {});

  const patientData = {
    id_user: userData.value.id,
    birth_date: new Date(formData.birth_date).toISOString(),
    gender: formData.gender,
    height: Number(formData.height),
    weight: Number(formData.weight),
  };

  console.log("patientData preparado para insert:", patientData);

  try {
    // 🔹 Primeiro verifica se já existe um paciente com esse usuário
    const existingPatient = await search(route_patient.value, {
      filters: '[{ "field": "id_user", "value": ' + userData.value.id + " }]",
    });

    if (existingPatient?.data?.length > 0) {
      const patientId = existingPatient.data[0].id;
      console.log("Atualizando paciente existente ID:", patientId);

      const response = await update(
        route_patient.value,
        patientId,
        patientData
      );
      console.log("Paciente atualizado:", response?.data ?? response);
    } else {
      console.log("Criando novo paciente...");
      const response = await insert(route_patient.value, patientData);
      console.log("Paciente criado:", response?.data ?? response);
    }
    navigateTo("/profile");
  } catch (err) {
    console.error("Erro ao salvar paciente:", err);
    alert("Erro ao salvar os dados. Tente novamente.");
  }
}

async function getData() {
  try {
    const respObjectives = await search(route_objective.value, null);
    if (respObjectives && respObjectives.data) {
      const options = respObjectives.data.map((item) => ({
        value: item.name,
        label: item.description,
      }));
      const objectiveInput = inputValues.value.find(
        (i) => i.ref === "objective"
      );
      if (objectiveInput) objectiveInput.options = options;
    }
  } catch (err) {
    console.warn("Erro ao carregar objetivos:", err);
  }
}
</script>
