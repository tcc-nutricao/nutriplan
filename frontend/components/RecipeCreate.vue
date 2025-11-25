<template>
  <teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      appear
    >
      <div
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
        @click.self="$emit('close')"
      >
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="scale-90"
          enter-to-class="scale-100"
          leave-active-class="transition-transform duration-300 ease-in"
          leave-from-class="scale-100"
          leave-to-class="scale-90"
          appear
        >
          <Card class="w-2xl relative max-h-[90vh] p-8 z-50 ">
            <button
              class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
              @click="$emit('close')"
              >&times;
            </button>
      
            <h2 class="text-3xl font-semibold text-np mb-4">
              {{ selected ? 'Editar' : 'Criar'}} receita
            </h2>
      
            <div class="flex w-full justify-between gap-3">
              <div class="flex flex-col w-full">
                <InputText
                class="mb-5"
                label="Título"
                v-model="object.name"
                :error="errors.name"
                required
                placeholder="Qual é o nome da receita?" />

                <SelectMultiple 
                  v-model="object.preferences"
                  :options="preferenceOptions"
                  label="Categorias"
                  class="mb-5 w-full"
                  :error="errors.preferences"
                  required
                />
      
                <div 
                  class="flex flex-col px-4 pb-3 pt-4 border-2 rounded-2xl mb-5"
                  :class="{ 'border-red-500': errors.ingredients, 'border-p-400': !errors.ingredients }"
                >
                  <Label label="Ingredientes" class="text-xl font-semibold mb-1" :error="errors.ingredients" required/>
                  <p v-if="!hasAnyItems" :class="{'text-red-500' : errors.ingredients}" class="text-gray-medium mt-1 pb-3 mb-3 border-b-2 border-p-200">Adicione ingredientes abaixo!</p>
                  <div v-if="hasAnyItems" class="flex flex-col flex-wrap w-full gap-4 mt-1 pb-3 mb-3 max-w-full border-b-2 border-p-200">
                    <ItemButton
                      v-for="(item, index) in newMealItems"
                      :key="index"
                      :label="item.food?.name"
                      :quantity="item.quantity"
                      :unity="item.unit_label"
                      class="w-full"
                      @delete-item="deleteItem(index)" 
                    />
                  </div>
                  <Search
                    type="foods"
                    placeholder="Buscar ingredientes"
                    v-model="object.food"
                    @update:modelValue=""
                    class="w-full mb-3"
                    required
                  />
                  <div class="flex gap-2">
                    <InputText
                      v-model="object.quantity"
                      class="mb-5 w-1/2"
                      label="Quantidade"
                      placeholder="Digite aqui"
                      type="number"
                      :error="errors.quantity"
                      required
                      />
                    <Select
                      v-model="object.id_unit_of_measurement"
                      :options="unitOptions"
                      label="Unidade"
                      class="mb-5 w-1/2"
                      :error="errors.id_unit_of_measurement"
                      required
                    />
                  </div>
                  <div class="flex flex-row justify-center gap-2">
                    <Button 
                      mediumPurple
                      class="w-max px-0 h-[42px]"
                      label="Adicionar ingrediente"
                      icon="fa-solid fa-plus short flex justify-center"
                      @click="addItem"
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-col w-full">
                <InputText
                  v-model="object.portion"
                  class="mb-5"
                  label="Porções"
                  placeholder="Quantidade de porções" 
                  :error="errors.portion"
                  required
                />
                <InputText
                  v-model="object.time"
                  class="mb-5"
                  label="Tempo de preparo"
                  placeholder="Tempo em minutos" 
                  :error="errors.time"
                  required
                />
                <TextArea
                  v-model="object.preparation"
                  subtitle="Separe cada passo por ponto e vírgula ( ; )"
                  class="mb-5"
                  label="Modo de preparo"
                  rows="10"
                  placeholder="Exemplo: Separe 200ml de água; Ferva; Sirva." 
                  :error="errors.preparation"
                  required
                />
                <div class="flex justify-center mt-6">
                  <Button mediumPurple
                    class="w-max pr-3 pl-2 h-[42px]" label="Salvar" 
                    @click="saveRecipe"
                  />
                </div>
              </div>
              </div>
          </Card>
        </Transition>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from "vue";
import { get, insert } from "~/crud";

const props = defineProps({
  selected: {
    type: String,
    required: false,
    default: null
  }
});

const emits = defineEmits(["close", "saved"]);

const newMealItems = ref([]);
const unitOptions = ref([]);
const preferenceOptions = ref([]);

const object = ref({
  food: null,
  quantity: '',
  id_unit_of_measurement: '',
  name: '',
  portion: '',
  time: '',
  preparation: '',
  preferences: []
});

const errors = ref({
  food: null,
  quantity: null,
  id_unit_of_measurement: null,
  name: null,
  ingredients: null,
  portion: null,
  time: null,
  preparation: null,
  preferences: null
});

const hasAnyItems = computed(() => {
  return newMealItems.value.length > 0;
});
  
onMounted(async () => {
  const selectRoutes = [
    { route: "unit-of-measurement", target: unitOptions },
    { route: "preference", target: preferenceOptions },
  ];
  await Promise.all(
    selectRoutes.map(({ route, target }) => getSelectItems(route, target))
  );
});

async function getSelectItems(route, target) {
  const response = await get(route);
  target.value = (response.data || []).map((item) => ({
    value: item.id,
    label: item.name,
  }));
}

function addItem() {
  errors.value.food = null;
  errors.value.quantity = null;
  errors.value.id_unit_of_measurement = null;

  if (!object.value.food || !object.value.food.id) {
    errors.value.food = 'Selecione um alimento';
    return;
  }

  if (!object.value.quantity || object.value.quantity <= 0) {
    errors.value.quantity = 'Informe uma quantidade válida';
    return;
  }

  if (!object.value.id_unit_of_measurement) {
    errors.value.id_unit_of_measurement = 'Selecione uma unidade';
    return;
  }

  const selectedUnit = unitOptions.value.find(u => u.value === object.value.id_unit_of_measurement);
  
  newMealItems.value.push({
    food: { ...object.value.food },
    quantity: object.value.quantity,
    id_unit_of_measurement: object.value.id_unit_of_measurement,
    unit_label: selectedUnit?.label || ''
  });

  object.value.food = null;
  object.value.quantity = '';
  object.value.id_unit_of_measurement = '';
}

function deleteItem(index) {
  newMealItems.value.splice(index, 1);
}

async function saveRecipe() {
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = null;
  });

  let hasErrors = false;

  if (!object.value.name || object.value.name.trim() === '') {
    errors.value.name = 'Nome da receita é obrigatório';
    hasErrors = true;
  }

  if (!object.value.portion || object.value.portion <= 0) {
    errors.value.portion = 'Porções é obrigatório';
    hasErrors = true;
  }

  if (object.value.time === '' || object.value.time < 0) {
    errors.value.time = 'Tempo de preparo é obrigatório';
    hasErrors = true;
  }

  if (!object.value.preferences || object.value.preferences.length === 0) {
    errors.value.preferences = 'Selecione pelo menos 1 categoria';
    hasErrors = true;
  }

  if (!object.value.preparation || object.value.preparation.trim() === '') {
    errors.value.preparation = 'Modo de preparo é obrigatório';
    hasErrors = true;
  }

  if (newMealItems.value.length === 0) {
    errors.value.ingredients = 'Adicione pelo menos um ingrediente';
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }

  const recipeData = {
    name: object.value.name,
    portion: parseInt(object.value.portion),
    preparation_time: parseInt(object.value.time),
    preparation_method: object.value.preparation,
    recipeFoods: newMealItems.value.map(item => ({
      id_food: item.food.id,
      id_unit_of_measurement: item.id_unit_of_measurement,
      quantity: parseFloat(item.quantity)
    })),
    recipePreferences: object.value.preferences.map(id_preference => ({
      id_preference
    }))
  };

  const response = await insert('recipe', recipeData);

  if (response && !response.error) {
    object.value.name = '';
    object.value.portion = '';
    object. value.time = '';
    object.value.preparation = '';
    object.value.preferences = [];
    newMealItems.value = [];
    
    emits('saved');
    emits('close');
  } else {
    if (response.errors) {
      Object.keys(response.errors).forEach(key => {
        if (errors.value.hasOwnProperty(key)) {
          errors.value[key] = response.errors[key];
        }
      });
    }
  }
}
</script>