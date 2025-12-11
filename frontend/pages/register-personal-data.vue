<template>
  <div
    class="flex flex-col items-center justify-start w-full min-h-screen px-4 py-6 md:p-8"
  >
    <h2
      class="text-2xl md:text-4xl font-semibold text-p-600 text-center mb-6 md:mb-8"
    >
      Vamos cadastrar seus dados pessoais!
    </h2>
    <Card>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div class="col-span-1">
          <Label class="mb-2" label="Que dia você nasceu?" :error="errors.birth_date" />
          <Input
            type="date"
            v-model="form.birth_date"
            placeholder="Data de nascimento"
            required
            :error="errors.birth_date"
          />
          <Error :message="errors.birth_date" />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Qual gênero você se identifica?" :error="errors.gender" />
          <Select v-model="form.gender" :options="genderOptions" required :error="errors.gender" />
          <Error :message="errors.gender" />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Qual é seu peso?" :error="errors.weight" />
          <Input
            type="number"
            v-model.number="form.weight"
            placeholder="Seu peso em kg"
            required
            :error="errors.weight"
          />
          <Error :message="errors.weight" />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Qual é a sua altura? (ex: 170cm)" :error="errors.height" />
          <Input
            type="number"
            v-model.number="form.height"
            placeholder="Sua altura em cm"
            required
            :error="errors.height"
          />
          <Error :message="errors.height" />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Você tem uma meta de peso?" :error="errors.target_weight" />
          <Input
            type="number"
            v-model.number="form.target_weight"
            placeholder="Sua meta em kg"
            :error="errors.target_weight"
          />
          <Error :message="errors.target_weight" />
        </div>
        <div class="col-span-1">
          <Label class="mb-2" label="Você tem alguma restrição alimentar?" :error="errors.restrictions" />
          <SelectMultiple
            :modelValue="form.restrictions"
            @update:modelValue="handleRestrictionsUpdate"
            :options="restrictionOptions"
            placeholder="Selecione as restrições"
            :error="errors.restrictions"
          />
          <Error :message="errors.restrictions" />
        </div>
        <!-- <div class="col-span-1">
          <Label class="mb-2" label="Você tem alguma preferência alimentar?" />
          <Select
            v-model="form.preferences"
            :options="preferenceOptions"
            multiple
          />
        </div> -->
        <div class="col-span-1">
          <Label class="mb-2" label="Qual é seu objetivo?" required :error="errors.objective" />
          <Select
            v-model="form.objective"
            :options="objectiveOptions"
            multiple
            required
            :error="errors.objective"
          />
          <Error :message="errors.objective" />
        </div>
        <div
          class="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-center gap-3 mt-6"
        >
          <Button class="w-full md:w-auto px-3" mediumPurple @click.prevent="save">
            Salvar
          </Button>
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
  // preferences: [],
  objective: [], // array de ids
  target_weight: null, // number
});

const errors = ref({
  birth_date: null,
  gender: null,
  weight: null,
  height: null,
  restrictions: null,
  objective: null,
  target_weight: null,
});

const genderOptions = [
  { value: "FEM", label: "Feminino" },
  { value: "MASC", label: "Masculino" },
  { value: "NONE", label: "Prefiro não informar" },
];
const restrictionOptions = ref([]);
// const preferenceOptions = ref([]);
const objectiveOptions = ref([]);

onMounted(async () => {
  const selectRoutes = [
    { route: "restriction", target: restrictionOptions },
    // { route: "preference", target: preferenceOptions },
    { route: "objective", target: objectiveOptions },
  ];
  await Promise.all(
    selectRoutes.map(({ route, target }) => getSelectItems(route, target))
  );
});

function validate() {
  let isValid = true;
  errors.value = {
    birth_date: null,
    gender: null,
    weight: null,
    height: null,
    restrictions: null,
    objective: null,
    target_weight: null,
  };

  if (!form.value.birth_date) {
    errors.value.birth_date = "Campo obrigatório";
    isValid = false;
  } else {
    const birthDate = new Date(form.value.birth_date);
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

  if (!form.value.gender) {
    errors.value.gender = "Campo obrigatório";
    isValid = false;
  }

  if (!form.value.weight) {
    errors.value.weight = "Campo obrigatório";
    isValid = false;
  } else if (form.value.weight < 20 || form.value.weight > 500) {
    errors.value.weight = "Peso deve ser entre 20 e 500";
    isValid = false;
  }

  if (!form.value.height) {
    errors.value.height = "Campo obrigatório";
    isValid = false;
  } else if (form.value.height < 60 || form.value.height > 270) {
    errors.value.height = "Altura deve ser entre 60 e 270";
    isValid = false;
  }

  if (form.value.target_weight) {
    if (form.value.target_weight < 20 || form.value.target_weight > 500) {
      errors.value.target_weight = "Meta de peso deve ser entre 20 e 500";
      isValid = false;
    }
  }

  if (!form.value.restrictions || form.value.restrictions.length === 0) {
    errors.value.restrictions = "Restrição alimentar deve ter no mínimo uma selecionada";
    isValid = false;
  }

  if (!form.value.objective || form.value.objective.length === 0) {
    errors.value.objective = "Campo obrigatório";
    isValid = false;
  }

  return isValid;
}

async function save() {
  if (!validate()) return;

  const payload = {
    birth_date: form.value.birth_date,
    gender: form.value.gender,
    weight: Number(form.value.weight),
    height: Number(form.value.height),
    target_weight: form.value.target_weight ? Number(form.value.target_weight) : undefined,
    restrictions: Array.isArray(form.value.restrictions) ? form.value.restrictions : (form.value.restrictions ? [form.value.restrictions] : []),
    objectives: Array.isArray(form.value.objective) ? form.value.objective : (form.value.objective ? [form.value.objective] : []),
  };
  await update("user/personal-data", payload);
  navigateTo("/meal-plan");
}

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
    form.value.restrictions = newRestrictions;
    return;
  }

  const noneId = noneOption.value;
  const wasNoneSelected = form.value.restrictions.includes(noneId);
  const isNoneSelected = newRestrictions.includes(noneId);

  if (isNoneSelected && !wasNoneSelected) {
    form.value.restrictions = [noneId];
  } else if (isNoneSelected && newRestrictions.length > 1) {
    form.value.restrictions = newRestrictions.filter((id) => id !== noneId);
  } else {
    form.value.restrictions = newRestrictions;
  }
}
</script>
