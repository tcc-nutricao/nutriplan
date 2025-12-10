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
          class="bg-white rounded-3xl py-4 sm:py-7 px-4 sm:px-9 w-full shadow-lg relative max-h-[85vh] sm:max-h-[90vh]  modal-container transition-transform duration-300 ease"
          :class="
            section === 'basic'
              ? 'max-w-[90vw] sm:max-w-lg'
              : 'max-w-[95vw] sm:max-w-3xl'
          "
        >
          <button
            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
            @click="$emit('close', false)"
          >
            &times;
          </button>

          <h2 class="text-2xl font-semibold text-np mb-4">
            Editar
            {{ section === "basic" ? "Perfil" : "dados pessoais" }}
          </h2>

          <div v-if="section === 'basic'">
            <InputText
              class="mb-5"
              label="Nome"
              v-model="basicFormData.name"
              placeholder="Insira o Nome"
              :error="errors.name"
            />
            <span v-if="errors.name" class="text-red-500 text-xs mt-1 block">{{ errors.name }}</span>
            <InputEmail
              class="mb-5"
              label="Email"
              v-model="basicFormData.email"
              placeholder="Insira o Email"
              :error="errors.email"
            />
            <span v-if="errors.email" class="text-red-500 text-xs mt-1 block">{{ errors.email }}</span>
            <InputPassword
              class="mb-5"
              label="Senha Atual"
              v-model="basicFormData.currentPassword"
              placeholder="Insira sua senha atual"
              :error="errors.currentPassword"
            />
            <span v-if="errors.currentPassword" class="text-red-500 text-xs mt-1 block">{{ errors.currentPassword }}</span>
            <InputPassword
              class="mb-5"
              label="Nova Senha"
              v-model="basicFormData.newPassword"
              placeholder="Insira a nova senha"
              :error="errors.newPassword"
            />
            <span v-if="errors.newPassword" class="text-red-500 text-xs mt-1 block">{{ errors.newPassword }}</span>
          </div>

          <div v-else class="flex w-full justify-between gap-3">
            <div class="flex flex-col w-full">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="col-span-1">
                  <Label class="mb-2" label="Que dia você nasceu?" />
                  <Input
                    type="date"
                    v-model="personalFormData.birth_date"
                    placeholder="Data de nascimento"
                    required
                    :error="errors.birth_date"
                  />
                  <span v-if="errors.birth_date" class="text-red-500 text-xs mt-1 block">{{ errors.birth_date }}</span>
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Qual gênero você se identifica?" />
                  <Select
                    v-model="personalFormData.gender"
                    :options="genderOptions"
                    required
                    :error="errors.gender"
                  />
                  <span v-if="errors.gender" class="text-red-500 text-xs mt-1 block">{{ errors.gender }}</span>
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Peso" />
                  <Input
                    type="number"
                    v-model.number="personalFormData.weight"
                    placeholder="Seu peso em kg"
                    required
                    :error="errors.weight"
                  />
                  <span v-if="errors.weight" class="text-red-500 text-xs mt-1 block">{{ errors.weight }}</span>
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Altura (ex: 170cm)" />
                  <Input
                    type="number"
                    v-model.number="personalFormData.height"
                    placeholder="Sua altura em cm"
                    required
                    :error="errors.height"
                  />
                  <span v-if="errors.height" class="text-red-500 text-xs mt-1 block">{{ errors.height }}</span>
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Meta de peso" />
                  <Input
                    type="number"
                    v-model.number="personalFormData.target_weight"
                    placeholder="Sua meta em kg"
                    :error="errors.target_weight"
                  />
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Restrições alimentares" />
                  <SelectMultiple
                    v-model="personalFormData.restrictions"
                    :options="restrictionOptions"
                    required
                    :error="errors.restrictions"
                  />
                  <span v-if="errors.restrictions" class="text-red-500 text-xs mt-1 block">{{ errors.restrictions }}</span>
                </div>
                <div class="col-span-1">
                  <Label class="mb-2" label="Objetivo" />
                  <Select
                    v-model="personalFormData.objectives"
                    :options="objectiveOptions"
                    required
                    :error="errors.objectives"
                  />
                  <span v-if="errors.objectives" class="text-red-500 text-xs mt-1 block">{{ errors.objectives }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-6">
            <Button
              mediumPurple
              @click="handleSubmit"
              class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
              label="Salvar"
            />
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { update, get } from "../crud";
import { useCookie } from "nuxt/app";

const props = defineProps({
  section: { type: String, required: true },
  userData: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close"]);

const basicFormData = ref({
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
});

const personalFormData = ref({
  birth_date: "",
  gender: "",
  height: "",
  weight: "",
  restrictions: [],
  preferences: [],
  objectives: [],
  target_weight: "",
});

const errors = ref({});

const validate = () => {
  errors.value = {};
  let isValid = true;

  if (props.section === "basic") {
     if (!basicFormData.value.name) { errors.value.name = "Nome é obrigatório"; isValid = false; }
     if (!basicFormData.value.email) { errors.value.email = "Email é obrigatório"; isValid = false; }
  } else {
    if (!personalFormData.value.birth_date) { errors.value.birth_date = "Data de nascimento é obrigatória"; isValid = false; }
    if (!personalFormData.value.gender) { errors.value.gender = "Gênero é obrigatório"; isValid = false; }
    if (!personalFormData.value.height) { errors.value.height = "Altura é obrigatória"; isValid = false; }
    if (!personalFormData.value.weight) { errors.value.weight = "Peso é obrigatório"; isValid = false; }
    if (!personalFormData.value.restrictions || personalFormData.value.restrictions.length === 0) { errors.value.restrictions = "Selecione ao menos uma restrição (ou 'Nenhuma')"; isValid = false; }
     
    const objs = personalFormData.value.objectives;
    if (!objs || (Array.isArray(objs) && objs.length === 0)) { errors.value.objectives = "Objetivo é obrigatório"; isValid = false; }
  }

  return isValid;
};

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

  // Pre-fill form data
  if (props.section === "basic" && props.userData) {
    basicFormData.value.name = props.userData.name || "";
    basicFormData.value.email = props.userData.email || "";
  } else if (props.section === "personal" && props.userData) {
    // Format birth_date to YYYY-MM-DD for date input
    if (props.userData.birth_date) {
      const date = new Date(props.userData.birth_date);
      personalFormData.value.birth_date = date.toISOString().split("T")[0];
    }
    personalFormData.value.gender = props.userData.gender || "";
    personalFormData.value.height = props.userData.altura || "";
    personalFormData.value.weight = props.userData.peso || "";
    personalFormData.value.target_weight = props.userData.target_weight || "";
    personalFormData.value.restrictions = props.userData.restrictions || [];
    personalFormData.value.preferences = props.userData.preferences || [];
    // Handle single select for objectives - take first item if array
    const objs = props.userData.objectives || [];
    personalFormData.value.objectives = Array.isArray(objs) && objs.length > 0 ? objs[0] : (objs || "");
  }
});

async function getSelectItems(route, target) {
  const response = await get(route);
  target.value = (response.data || []).map((item) => ({
    value: item.id,
    label: item.name,
  }));
}

async function handleSubmit() {
  if (!validate()) return;

  if (props.section === "basic") {
    const formData = {
      name: basicFormData.value.name,
      email: basicFormData.value.email,
      currentPassword: basicFormData.value.currentPassword,
      newPassword: basicFormData.value.newPassword,
    };

    try {
      const res = await update("user", formData);
      if (res.error) {
        console.error("Erro ao atualizar perfil:", res);
        alert("Erro ao atualizar perfil. Tente novamente.");
      } else {

        const updatedUser = res.data;
        userCookie.value.name = updatedUser.name;
        userCookie.value.email = updatedUser.email;

        emit("close", true);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição. Tente novamente.");
    }
  } else {
    const formData = {
      birth_date: personalFormData.value.birth_date,
      gender: personalFormData.value.gender,
      height: parseFloat(personalFormData.value.height),
      weight: parseFloat(personalFormData.value.weight),
      target_weight: personalFormData.value.target_weight ? parseFloat(personalFormData.value.target_weight) : undefined,
      restrictions: personalFormData.value.restrictions,
      preferences: personalFormData.value.preferences,
      objectives: Array.isArray(personalFormData.value.objectives) ? personalFormData.value.objectives : [personalFormData.value.objectives],
    };

    try {
      const res = await update("user/personal-data", formData);
      if (res.error) {
        console.error("Erro ao atualizar dados pessoais:", res);
        alert("Erro ao atualizar dados pessoais. Tente novamente.");
      } else {
        console.log("Dados pessoais atualizados com sucesso:", res.data.data);
        emit("close", true);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição. Tente novamente.");
    }
  }
}
</script>
