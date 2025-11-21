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
        class="bg-white rounded-3xl py-7 px-9 w-full shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-transform duration-300 ease"
        :class="section === 'basic' ? 'max-w-lg' : 'max-w-3xl'"
      >
        <button
          class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
          @click="$emit('close', false)"
        >&times;
        </button>

        <h2 class="text-2xl font-semibold text-np mb-4">
          {{ section === "create" ? "Criar" : "Editar" }}
          paciente
        </h2>

        <div class="flex w-full justify-between gap-3">
          <div class="flex flex-col w-full">
            <div class="grid grid-cols-2 gap-6">
                <div class="col-span-1">
                <Label class="mb-2" label="Que dia você nasceu?" />
                <Input
                    type="date"
                    v-model="formData.birth_date"
                    placeholder="Data de nascimento"
                    required
                />
                </div>
                <div class="col-span-1">
                <Label class="mb-2" label="Qual gênero você se identifica?" />
                <Select v-model="formData.gender" :options="genderOptions" required />
                </div>
                <div class="col-span-1">
                <Label class="mb-2" label="Qual é seu peso?" />
                <Input
                    type="number"
                    v-model.number="formData.weight"
                    placeholder="Seu peso em kg"
                    required
                />
                </div>
                <div class="col-span-1">
                <Label class="mb-2" label="Qual é a sua altura? (ex: 170cm)" />
                <Input
                    type="number"
                    v-model.number="formData.height"
                    placeholder="Sua altura em cm"
                    required
                />
                </div>
                <div class="col-span-1">
                <Label class="mb-2" label="Você tem uma meta de peso?" />
                <Input
                    type="number"
                    v-model.number="formData.target_weight"
                    placeholder="Sua meta em kg"
                />
                </div>
                <div class="col-span-1">
                <Label class="mb-2" label="Você tem alguma restrição alimentar?" />
                <Select
                    v-model="formData.restrictions"
                    :options="restrictionOptions"
                    multiple
                    required
                />
                </div>
                <div class="col-span-1">
                <Label class="mb-2" label="Você tem alguma preferência alimentar?" />
                <Select
                    v-model="formData.preferences"
                    :options="preferenceOptions"
                    multiple
                    required
                />
                </div>
                <div class="col-span-1">
                <Label class="mb-2" label="Qual é seu objetivo?" />
                <Select
                    v-model="formData.objectives"
                    :options="objectiveOptions"
                    multiple
                    required
                />
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
import { update, get } from "../crud";
import { useCookie } from "nuxt/app";

const props = defineProps({
  section: { type: String, required: true },
  patientData: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["save", "close"]);

const formData = ref({
    birth_date: "",
    gender: "",
    height: "",
    weight: "",
    restrictions: [],
    preferences: [],
    objectives: [],
    target_weight: "",
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
    formData.value.gender = props.patientData.gender || "";
    formData.value.height = props.patientData.altura || "";
    formData.value.weight = props.patientData.peso || "";
    formData.value.target_weight = props.patientData.target_weight || "";
    formData.value.restrictions = props.patientData.restrictions || [];
    formData.value.preferences = props.patientData.preferences || [];
    formData.value.objectives = props.patientData.objectives || [];
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
        console.log("Perfil atualizado com sucesso:", res.data.data);

        const updatedUser = res.data;
        userCookie.value.name = updatedUser.name;
        userCookie.value.email = updatedUser.email;

        alert("Perfil atualizado com sucesso!");
        emit("close", true); 
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição. Tente novamente.");
    }
  } else {
    const formData = {
      birth_date: formData.value.birth_date,
      gender: formData.value.gender,
      height: parseFloat(formData.value.height),
      weight: parseFloat(formData.value.weight),
      restrictions: formData.value.restrictions,
      preferences: formData.value.preferences,
      objectives: formData.value.objectives,
    };

    try {
      const res = await update("user/personal-data", formData);
      if (res.error) {
        console.error("Erro ao atualizar dados pessoais:", res);
        alert("Erro ao atualizar dados pessoais. Tente novamente.");
      } else {
        console.log("Dados pessoais atualizados com sucesso:", res.data.data);
        alert("Dados pessoais atualizados com sucesso!");
        emit("close", true);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição. Tente novamente.");
    }
  }
}
</script>