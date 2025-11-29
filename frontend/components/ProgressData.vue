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
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
        @click.self="close"
      >
        <div
          class="bg-white rounded-3xl py-7 px-9 w-full max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-transform duration-300 ease"
        >
          <button
            class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
            @click="close"
          >
            &times;
          </button>

          <h2 class="text-2xl font-semibold text-np mb-4">
            Histórico de Peso
          </h2>

          <div class="overflow-y-auto flex-grow mb-6">
            <div v-if="displayHistory.length === 0" class="text-center text-gray-500 py-4">
              Nenhum registro encontrado.
            </div>
            <ul v-else class="space-y-3">
              <li v-for="item in displayHistory" :key="item.id" class="flex justify-between items-center p-3 bg-p-100 rounded-xl border border-p-300">
                <div>
                  <p class="font-semibold text-gray-800">{{ item.weight }} kg</p>
                  <p class="text-sm text-gray-500">{{ formatDate(item.date) }}</p>
                </div>
                <button 
                  @click="confirmDelete(item)" 
                  class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-200 hover:scale-110 active:scale-95 transition"
                  title="Excluir registro"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>

          <div class="flex justify-center mt-6">
            <Button
              gray
              outlined
              class="w-max pr-3 pl-2 h-[42px]"
              label="Fechar"
              @click="close"
            />
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { remove } from '~/crud.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  history: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'refresh']);

const displayHistory = computed(() => {
  return [...props.history].reverse();
});

const close = () => {
  emit('close');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const confirmDelete = async (item) => {
  if (confirm(`Tem certeza que deseja excluir o registro de ${item.weight}kg de ${formatDate(item.date)}?`)) {
    await deleteItem(item.id);
  }
};

const deleteItem = async (id) => {
  const result = await remove('health-data', id);
  if (!result.error) {
    emit('refresh');
  } else {
    alert('Erro ao excluir registro.');
    console.error(result);
  }
};
</script>