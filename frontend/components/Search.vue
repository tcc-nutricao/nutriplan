<template>
  <div class="relative" ref="searchMenu">
    <div class="relative w-full">
      <input 
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @focus="handleFocus"
        :placeholder="placeholder"
        class="relative w-full cursor-text rounded-xl border-2 text-sm h-[42px] bg-white py-2 pl-3 pr-10 focus:outline-none transition"
        :class="classes"
      />
      
      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg v-if="isLoading" class="animate-spin h-5 w-5 text-p-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
    </div>

    <transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-2"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-2"
    >
      <ul v-if="isOpen && (results.length > 0 || (!isLoading && searchQuery.length > 0))"
        class="absolute ring-2 ring-p-200 border-1 border-p-300 z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-lg focus:outline-none"
        style="min-width: max-content;"
        role="listbox">

        <li v-for="result in results" :key="result.id" @click="selectResult(result)"
          class="relative cursor-pointer select-none py-[10px] px-4 mx-2 rounded-lg text-p-950 hover:bg-p-100 hover:text-p-700 transition"
          role="option">
          <span class="block truncate font-normal">
            {{ result.name }}
          </span>
        </li>

        <li v-if="results.length === 0 && !isLoading && searchQuery.length > 0" 
          class="px-4 py-3 text-sm text-gray-500 text-center">
          Nenhum resultado encontrado
        </li>

        <li v-if="results.length > 0" 
          class="px-4 pb-1 pt-3 text-xs text-gray-500 border-t-2 border-gray-300 mt-1">
          <div class="flex items-center justify-between gap-2">
            <span>Mostrando {{ results.length }} de {{ totalResults }} resultados</span>
            <button 
              v-if="results.length < totalResults"
              @click.stop="loadMore"
              class="text-p-600 hover:text-p-700 font-medium hover:underline transition whitespace-nowrap">
              Ver mais resultados
            </button>
          </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { searchDynamic } from '~/crud.js';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['recipes', 'patients', 'foods'].includes(value)
  },
  placeholder: {
    type: String,
    default: 'Pesquise aqui'
  },
  error: {
    type: [Boolean, String],
    default: false
  },
  modelValue: {
    type: [Object, null],
    default: null
  }
});

const emits = defineEmits(['update:modelValue']);

const searchQuery = ref('');
const results = ref([]);
const totalResults = ref(0);
const isOpen = ref(false);
const isLoading = ref(false);
const searchMenu = ref(null);
const currentLimit = ref(10); 
let debounceTimeout = null;

const classes = computed(() => {
  const hasError = !!props.error;

  return {
    'border-red-500': hasError,
    'text-red-500': hasError,
    'border-p-600': !hasError && isOpen.value,
    'border-p-g2': !hasError && !isOpen.value,
  };
});

const performSearch = async (limit = currentLimit.value) => {
  if (searchQuery.value.trim().length === 0) {
    results.value = [];
    totalResults.value = 0;
    isOpen.value = false;
    return;
  }

  isLoading.value = true;

  try {
    const response = await searchDynamic(props.type, searchQuery.value, limit);
    
    if (response.error) {
      console.error('Erro na pesquisa:', response);
      results.value = [];
      totalResults.value = 0;
    } else {
      results.value = response.data || [];
      totalResults.value = response.total || 0;
      isOpen.value = true;
    }
  } catch (error) {
    console.error('Erro ao pesquisar:', error);
    results.value = [];
    totalResults.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const loadMore = async () => {
  currentLimit.value += 10;
  await performSearch(currentLimit.value);
};

const handleInput = () => {
  currentLimit.value = 10;
  
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    performSearch();
  }, 300);
};

const handleFocus = () => {
  if (searchQuery.value.trim().length > 0 && results.value.length > 0) {
    isOpen.value = true;
  }
};

const selectResult = (result) => {
  emits('update:modelValue', result);
  searchQuery.value = result.name;
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (isOpen.value && searchMenu.value && !searchMenu.value.contains(event.target)) {
    isOpen.value = false;
  }
};

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    searchQuery.value = '';
    results.value = [];
    totalResults.value = 0;
    currentLimit.value = 10;
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
});
</script>