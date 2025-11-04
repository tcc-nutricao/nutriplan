<template>
  <teleport to="body">
    <Transition name="modal" appear>
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white rounded-3xl py-7 px-9 w-[50%] shadow-lg relative max-h-[90vh] overflow-y-auto modal-container"
      >
        <button
          class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
          @click="$emit('close')"
        >&times;
        </button>

        <h2 class="text-3xl font-semibold text-np mb-4">
          {{ section === 'create' ? 'Criar' : 'Editar'}} receita
        </h2>

        <div class="flex w-full justify-between gap-3">
          <div class="flex flex-col w-full">
            <InputText
            class="mb-5"
            label="Título"
            v-model="inputs.name"
            :error="errors.name"
            placeholder="Qual é o nome da receita?" />

            <div 
              class="flex flex-col px-4 pb-3 pt-4 border-2 rounded-2xl mb-5"
              :class="{ 'border-red-500': errors.ingredients, 'border-p-400': !errors.ingredients }"
            >
              <Label label="Ingredientes" class="text-xl font-semibold mb-1" :error="errors.ingredients"/>
              <p v-if="!hasAnyItems" :class="{'text-red-500' : errors.ingredients}" class="text-gray-medium mt-1 pb-3 mb-3 border-b-2 border-p-200">Adicione ingredientes abaixo!</p>
              <div v-if="hasAnyItems" class="flex flex-col gap-4 mt-1 pb-3 mb-3 max-w-full border-b-2 border-p-200">
                <div class="flex flex-wrap gap-2 w-full">
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
              </div>
              <Input
                v-model="newItem.food"
                class="mb-5"
                placeholder="Buscar"
                :error="errors.food"
              />
              <div class="flex gap-2">
                <InputText
                  v-model="newItem.quantity"
                  class="mb-5"
                  label="Quantidade"
                  placeholder="Digite aqui"
                  type="number"
                  :error="errors.quantity"
                  />
                <InputText
                  v-model="newItem.unit"
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
              v-model="inputs.portions"
              class="mb-5"
              label="Porções"
              placeholder="Informe quantas porções essa receita rende" 
              :error="errors.portions"
            />
            <InputText
              v-model="inputs.time"
              class="mb-5"
              label="Tempo de preparo"
              placeholder="Tempo em minutos" 
              :error="errors.time"
            />
            <TextArea
              v-model="inputs.preparation"
              class="mb-5"
              label="Modo de preparo"
              rows="10"
              placeholder="Digite o passo a passo de preparo" 
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
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive, computed } from "vue";

defineProps({
  section: { type: String, required: true },
});

defineEmits(["close"]);

const newMealItems = ref([]);

const newItem = reactive({
  food: '',
  quantity: '',
  unit: ''
});

const inputs = reactive({
  ingredients: '',
  name: '',
  portions: '',
  time: '',
  preparation: ''
})

const errors = reactive({
  food: null,
  quantity: null,
  unit: null,
  name: null,
  ingredients: null,
  portions: null,
  time: null,
  preparation: null
});

const hasAnyItems = computed(() => {
  return newMealItems.value.length > 0;
});

function addItem() {
  errors.food = null;
  errors.quantity = null;
  errors.unit = null;

  let isValid = true;
  if (!newItem.food) { 
      errors.food = 'Campo obrigatório';
      isValid = false;
  }
  if (!newItem.quantity) { 
      errors.quantity = 'Campo obrigatório';
      isValid = false;
  }
  if (!newItem.unit) { 
      errors.unit = 'Campo obrigatório';
      isValid = false;
  }

  if (!isValid) {
      return;
  }
  
  newMealItems.value.push({ ...newItem });
  clearInputs(); 
}

function deleteItem(itemIndex) {
  newMealItems.value.splice(itemIndex, 1);
}

function clearInputs() {
  newItem.food = '';
  newItem.quantity = '';
  newItem.unit = '';
  errors.food = null;
  errors.quantity = null;
  errors.unit = null;
}

function save() {
  errors.name = null
  errors.time = null
  errors.preparation = null
  errors.portions = null
  errors.ingredients = null

  let isValid = true;
  if (!inputs.name) { 
      errors.name = 'Campo obrigatório';
      isValid = false;
  }
  if (!inputs.portions) { 
      errors.portions = 'Campo obrigatório';
      isValid = false;
  }
  if (!inputs.time) { 
      errors.time = 'Campo obrigatório';
      isValid = false;
  }
  if (!inputs.preparation) { 
      errors.preparation = 'Campo obrigatório';
      isValid = false;
  }
  if (!hasAnyItems.value) { 
      errors.ingredients = 'Campo obrigatório';
      isValid = false;
  }

  if (!isValid) {
      return;
  }
  
  // logica add receita backend aqui
}

</script>

<style>
.modal-enter-from {
opacity: 0;
}
.modal-enter-from .modal-container {
transform: scale(0.9);
}

.modal-leave-to {
opacity: 0;
}
.modal-leave-to .modal-container {
transform: scale(0.9);
}

.modal-enter-active,
.modal-leave-active {
transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
transition: transform 0.3s ease;
}
</style>