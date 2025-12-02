<template>
  <teleport to="body">
    <Transition
      name="modal"
      appear
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-300 ease"
      leave-active-class="transition-opacity duration-300 ease"
    >
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      @click.self="$emit('close', false)"
    >
      <div
        class="bg-white rounded-3xl py-7 px-9 w-full shadow-lg relative max-h-[90vh] overflow-y-shown modal-container transition-transform duration-300 ease"
        :class="section === 'basic' ? 'max-w-lg' : 'max-w-3xl'"
      >
        <button
          class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-[50]"
          @click="$emit('close', false)"
        >&times;
        </button>

        <h2 class="text-2xl font-semibold text-np mb-4">
          {{ section === "create" || section === "create-offline" ? "Criar" : "Editar" }}
          paciente
        </h2>

        <div class="flex w-full justify-between gap-3">
          <div class="flex flex-col w-full">
            <div class="grid grid-cols-2 gap-6">
          <div class="col-span-1">
            <Label class="mb-2" label="Nome completo" :error="errors.name" />
            <Input
              type="text"
              v-model="formData.name"
              placeholder="Nome do paciente"
              required
              :error="errors.name"
            />
            <Error :message="errors.name" />
          </div>
          <div class="col-span-1" v-if="section !== 'create-offline'">
            <Label class="mb-2" label="Email" :error="errors.email" />
            <Input
              type="email"
              v-model="formData.email"
              placeholder="Email do paciente"
              required
              :error="errors.email"
            />
            <Error :message="errors.email" />
          </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Data de nascimento" />
                  <Input
                    type="date"
                    v-model="formData.birth_date"
                    placeholder="Data de nascimento"
                    required
                  />
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Sexo" />
                  <Select v-model="formData.gender" :options="genderOptions" required />
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Peso" />
                  <Input
                    type="number"
                    v-model.number="formData.weight"
                    placeholder="Peso em kg"
                    required
                  />
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Altura" />
                  <Input
                    type="number"
                    v-model.number="formData.height"
                    placeholder="Altura em cm"
                    required
                  />
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Meta de peso" />
                  <Input
                    type="number"
                    v-model.number="formData.target_weight"
                    placeholder="Meta em kg"
                   />  
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Tem alguma restrição alimentar?" :error="errors.restrictions" />
                  <SelectMultiple
                    :modelValue="formData.restrictions"
                    @update:modelValue="handleRestrictionsUpdate"
                    :options="restrictionOptions"
                    placeholder="Selecione as restrições"
                    :error="errors.restrictions"
                  />
                  <Error :message="errors.restrictions" />
                </div>
                <div class="col-span-1 ">
                  <Label class="mb-2" label="Objetivo" />
                  <Select
                    v-model="formData.objective"
                    :options="objectiveOptions"
                    placeholder="Selecione o objetivo"
                    :error="errors.objective"
                  />
                  <Error :message="errors.objective" />
                </div>
            </div>
        </div>
        </div>
        <div class="flex justify-center mt-6">
          <Button mediumPurple
          @click="handleSubmit"
          class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition" label="Salvar" 
        />
        </div>
      </div>
    </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { update, get, insert } from "../crud";
import { useCookie } from "nuxt/app";

const props = defineProps({
  section: { type: String, required: true },
  patientData: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["save", "close"]);

const formData = ref({
    name: "",
    email: "",
    birth_date: "",
    gender: "",
    height: "",
    weight: "",
    restrictions: [],
    preferences: [],
    objective: "",
    target_weight: "",
});

const errors = ref({
  name: null,
  email: null,
  birth_date: null,
  gender: null,
  height: null,
  weight: null,
  restrictions: null,
  objective: null,
  target_weight: null,
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

const userCookie = useCookie("user-data");

onMounted(async () => {
  const selectRoutes = [
    { route: "restriction", target: restrictionOptions },
    { route: "preference", target: preferenceOptions },
    { route: "objective", target: objectiveOptions },
  ];
  await Promise.all(
    selectRoutes.map(({ route, target }) => getSelectItems(route, target))
  );

  if(props.section === "edit"){
    if (props.patientData.birth_date) {
      const date = new Date(props.patientData.birth_date);
      formData.value.birth_date = date.toISOString().split('T')[0];
    }
    formData.value.name = props.patientData.name || "";
    formData.value.email = props.patientData.email || "";
    formData.value.gender = props.patientData.gender || "";
    formData.value.height = props.patientData.height || ""; 
    formData.value.weight = props.patientData.weight || ""; 
    formData.value.target_weight = props.patientData.target_weight || "";
    formData.value.restrictions = props.patientData.restrictionIds || [];
    formData.value.preferences = props.patientData.preferences || [];
    formData.value.objective = props.patientData.objectiveIds && props.patientData.objectiveIds.length > 0 ? props.patientData.objectiveIds[0] : ""; 
  }
});

async function getSelectItems(route, target) {
  const response = await get(route);
  target.value = (response.data || []).map((item) => ({
    value: item.id,
    label: item.name,
  }));
}

function handleRestrictionsUpdate(newRestrictions) {
  const noneOption = restrictionOptions.value.find(
    (opt) => opt.label.toLowerCase() === "nenhuma"
  );

  if (!noneOption) {
    formData.value.restrictions = newRestrictions;
    return;
  }

  const noneId = noneOption.value;
  const wasNoneSelected = formData.value.restrictions.includes(noneId);
  const isNoneSelected = newRestrictions.includes(noneId);

  if (isNoneSelected && !wasNoneSelected) {
    formData.value.restrictions = [noneId];
  } else if (isNoneSelected && newRestrictions.length > 1) {
    formData.value.restrictions = newRestrictions.filter((id) => id !== noneId);
  } else {
    formData.value.restrictions = newRestrictions;
  }
}

function validate() {
  let isValid = true;
  errors.value = {
    name: null,
    email: null,
    birth_date: null,
    gender: null,
    height: null,
    weight: null,
    restrictions: null,
    objective: null,
    target_weight: null,
  };

  if (props.section === 'create' || props.section === 'create-offline') {
      if (!formData.value.name) {
          errors.value.name = "Campo obrigatório";
          isValid = false;
      }
      if (props.section === 'create' && !formData.value.email) {
          errors.value.email = "Campo obrigatório";
          isValid = false;
      }
  }

  if (!formData.value.birth_date) {
    errors.value.birth_date = "Campo obrigatório";
    isValid = false;
  } else {
    const birthDate = new Date(formData.value.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 5) {
      errors.value.birth_date = "Deve ter no mínimo 5 anos de idade";
      isValid = false;
    }
    if (age > 120) {
      errors.value.birth_date = "Deve ter no máximo 120 anos de idade";
      isValid = false;
    }
  }

  if (!formData.value.gender) {
    errors.value.gender = "Campo obrigatório";
    isValid = false;
  }

  if (!formData.value.weight) {
    errors.value.weight = "Campo obrigatório";
    isValid = false;
  } else if (formData.value.weight < 20 || formData.value.weight > 500) {
    errors.value.weight = "Peso deve ser entre 20 e 500";
    isValid = false;
  }

  if (!formData.value.height) {
    errors.value.height = "Campo obrigatório";
    isValid = false;
  } else if (formData.value.height < 60 || formData.value.height > 270) {
    errors.value.height = "Altura deve ser entre 60 e 270";
    isValid = false;
  }

  if (formData.value.target_weight) {
    if (formData.value.target_weight < 20 || formData.value.target_weight > 500) {
      errors.value.target_weight = "Meta de peso deve ser entre 20 e 500";
      isValid = false;
    }
  }

  if (!formData.value.restrictions || formData.value.restrictions.length === 0) {
    errors.value.restrictions = "Restrição alimentar deve ter no mínimo uma selecionada";
    isValid = false;
  }

  if (!formData.value.objective) {
    errors.value.objective = "Campo obrigatório";
    isValid = false;
  }

  return isValid;
}

async function handleSubmit() {
  if (!validate()) return;

  const payload = {
    name: formData.value.name,
    email: formData.value.email,
    birth_date: formData.value.birth_date,
    gender: formData.value.gender,
    height: parseFloat(formData.value.height),
    weight: parseFloat(formData.value.weight),
    target_weight: formData.value.target_weight ? parseFloat(formData.value.target_weight) : undefined,
    restrictions: formData.value.restrictions,
    preferences: formData.value.preferences,
    objectives: [formData.value.objective],
  };

  try {
    let res;
    if (props.section === "create" || props.section === "create-offline") {
        res = await insert("patient/create-full", payload);
    } else {
        res = await update("patient", props.patientData.id, payload); 
    }

    if (res.error) {
      console.error("Erro ao salvar paciente:", res);
      alert("Erro ao salvar paciente. Tente novamente.");
    } else {
      console.log("Paciente salvo com sucesso:", res.data);
      // alert("Paciente salvo com sucesso!");
      emit("close", true);
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    alert("Erro na requisição. Tente novamente.");
  }
}
</script>
