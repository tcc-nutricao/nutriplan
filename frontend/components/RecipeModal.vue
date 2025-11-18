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
          <Card class="w-xl relative max-h-[90vh] overflow-y-auto z-50">
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
                placeholder="Qual é o nome da receita?" />
      
                <div 
                  class="flex flex-col px-4 pb-3 pt-4 border-2 rounded-2xl mb-5"
                  :class="{ 'border-red-500': errors.ingredients, 'border-p-400': !errors.ingredients }"
                >
                  <Label label="Ingredientes" class="text-xl font-semibold mb-1" :error="errors.ingredients"/>
                  <p v-if="!hasAnyItems" :class="{'text-red-500' : errors.ingredients}" class="text-gray-medium mt-1 pb-3 mb-3 border-b-2 border-p-200">Adicione ingredientes abaixo!</p>
                  <div v-if="hasAnyItems" class="flex flex-col flex-wrap gap-2 w-full gap-4 mt-1 pb-3 mb-3 max-w-full border-b-2 border-p-200">
                    <ItemButton
                      v-for="(item, index) in newMealItems"
                      :key="index"
                      :label="item.food"
                      :quantity="item.quantity"
                      :unity="item.unit"
                      class="w-full"
                      @delete-item="deleteItem(index)" 
                    />
                  </div>
                  <Input
                    v-model="object.food"
                    class="mb-5"
                    placeholder="Buscar"
                    :error="errors.food"
                  />
                  <div class="flex gap-2">
                    <InputText
                      v-model="object.quantity"
                      class="mb-5"
                      label="Quantidade"
                      placeholder="Digite aqui"
                      type="number"
                      :error="errors.quantity"
                      />
                    <InputText
                      v-model="object.unit"
                      class="mb-5"
                      label="Unidade"
                      placeholder="Buscar"
                      :error="errors.unit"
                    />
                  </div>
                  <div class="flex flex-row justify-center gap-2">
                    <Button 
                      mediumPurple
                      class="w-max px-0 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                      label="Adicionar ingrediente"
                      icon="fa-solid fa-plus short flex justify-center"
                      @click="addItem"
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-col w-full">
                <InputText
                  v-model="object.portions"
                  class="mb-5"
                  label="Porções"
                  placeholder="Informe quantas porções essa receita rende" 
                  :error="errors.portions"
                />
                <InputText
                  v-model="object.time"
                  class="mb-5"
                  label="Tempo de preparo"
                  placeholder="Tempo em minutos" 
                  :error="errors.time"
                />
                <TextArea
                  v-model="object.preparation"
                  class="mb-5"
                  label="Modo de preparo"
                  rows="10"
                  placeholder="Digite o passo a passo de preparo separado por vírgulas para cada passo" 
                  :error="errors.preparation"
                />
                <div class="flex justify-center mt-6">
                  <Button mediumPurple
                    class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition" label="Salvar" 
                    @click="save"
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
import { ref } from "vue";

const props = defineProps({
  selected: {
    type: String,
    required: true,
    default: () => (null)
  }
});

defineEmits(["close"]);

const newMealItems = ref([]);

const object = ref({
  ingredients: '',
  name: '',
  portions: '',
  time: '',
  preparation: ''
});

const errors = ref({
  food: null,
  quantity: null,
  unit: null,
  name: null,
  ingredients: null,
  portions: null,
  time: null,
  preparation: null
});

async function save() {
  let response = false;
  const mappedObject = {
    name: object.value.name,
    ingredients: newMealItems.value,
    portions: object.value.portions,
    preparation_time: object.value.time,
    steps: object.value.preparation.split(',').map(step => step.trim())
  };
  
  if (props.selected) {
    response = await update('meal-plan-recipe', props.selected, mappedObject);
  } else {
    response = await create('meal-plan-recipe', mappedObject);
  }
  
  if (response && !response.error) {
    resetForm();
    emit('close');
  } else {
    errors.value = response.errors || {};
  }
}
</script>