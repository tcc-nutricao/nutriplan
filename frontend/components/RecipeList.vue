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
            <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[400]" @click.self="$emit('close')">
                <div class="bg-white rounded-3xl py-7 px-9 w-full max-w-4xl shadow-lg relative max-h-[90vh] overflow-y-auto modal-container transition-transform duration-300 ease">
                    <button
                        class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-[50]"
                        @click="$emit('close')"
                    >&times;
                    </button>
                    
                    <div class="flex flex-col gap-3 h-full mt-8">
                        <div class="flex flex-col w-full mb-4">
                            <SearchBar 
                                :filter="true" 
                                :sort="true" 
                                :filterOptions="getFilterOptions()" 
                                placeholder="Pesquise uma receita"
                                searchType="recipes"
                                @searchSelected="handleSearchSelected"
                                @filterSelected="handleFilterSelected"
                                @sortSelected="handleSortSelected"
                                class="bg-white self-start w-full z-20 shadowSearch" 
                            />
                            
                            <div v-if="!loading && items.length > 0" class="flex flex-col gap-3 w-full mt-5 pr-2">
                                <ReceitaButton
                                    v-for="item in items"
                                    :key="item.id"
                                    :item="item"
                                    :fullWidth="true"
                                    @selected="selectItem(item)"
                                />
                                <Pagination
                                    :currentPage="currentPage"
                                    :totalPages="totalPages"
                                    @page-changed="handlePageChange"
                                    class="mt-4"
                                />
                            </div>

                            <div v-else-if="loading" class="mt-10 text-center text-lg text-gray-500">
                                <p>Carregando receitas...</p>
                            </div>
                            <div v-else class="mt-10 text-center text-lg text-gray-500">
                                <p>Nenhuma receita encontrada.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<script setup>
import { get } from '../crud';
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['selected', 'close']);

const items = ref([]); 
const preferences = ref([]);
const loading = ref(true); 
const route = ref('recipe');
const errors = ref({});
const favoriteRecipeIds = ref(new Set());
const currentFilter = ref(['all']);
const currentSort = ref({ column: 'created_at', direction: 'desc' });

const currentPage = ref(1);
const totalPages = ref(0);
const itemsPerPage = 10;
const recipeListTop = ref(null);

async function handleSearchSelected(recipe) {
  if (!recipe || !recipe.id) return;
  // Directly select the searched recipe
  const response = await get(`recipe/${recipe.id}`);
  if (response && response.data) {
      const fullRecipe = response.data;
      const formattedRecipe = {
        ...fullRecipe,
        recipe: fullRecipe,
        steps: preparationMethodMapper(fullRecipe.preparation_method),
        isFavorite: favoriteRecipeIds.value.has(fullRecipe.id)
      };
      emit('selected', formattedRecipe);
  }
}

function preparationMethodMapper(preparationMethod) {
  if (!preparationMethod) return [];
  const steps = preparationMethod
    .split(';')
    .map(step => step.trim())
    .filter(step => step !== '');
  
  return steps.map((step) => {
    return step.charAt(0).toUpperCase() + step.slice(1);
  });
}

async function loadFavorites() {
  const response = await get('recipe/favorites');
  if (response && response.data) {
    favoriteRecipeIds.value = new Set(response.data.map(fav => fav.id));
  }
}

async function handleFilterSelected(filterValue) {
  currentFilter.value = filterValue;
  await loadItems(1);
}

async function handleSortSelected({ column, direction }) {
  currentSort.value = { column, direction };
  await loadItems(1);
}

async function loadItems(page = 1) {
  loading.value = true;
  let endpoint = route.value;
  let params = { 
    page, 
    limit: itemsPerPage,
    orderColumn: currentSort.value.column,
    order: currentSort.value.direction
  };

  const filters = currentFilter.value;

  if (filters.includes('favorites')) {
    endpoint = 'recipe/favorites';
  } else if (!filters.includes('all') && filters.length > 0) {
    // Filter by preferences
    params.filters = JSON.stringify([{ 
      field: 'recipePreferences', 
      operator: 'some', 
      value: { id_preference: { in: filters } } 
    }]);
  }

  const response = await get(endpoint, params);

  if (!response || response.message) {
    errors.value = response.message || 'Erro ao carregar receitas.';
    loading.value = false;
    return
  }

  const recipesFromApi = response.data; 
  const totalItems = response.total || recipesFromApi.length;

  items.value = recipesFromApi.map(apiRecipe => ({
    ...apiRecipe,
    recipe: apiRecipe,
    steps: preparationMethodMapper(apiRecipe.preparation_method),
    isFavorite: favoriteRecipeIds.value.has(apiRecipe.id),
    isSelected: false // Reset selection in list view
  }));

  totalPages.value = Math.ceil(totalItems / itemsPerPage);
  currentPage.value = page;
  loading.value = false;
}

async function getPreferences() {
  const response = await get('preference');
  if (response && response.data) {
    preferences.value = response.data;
  }
}

function handlePageChange(page) {
  loadItems(page);
  // Optional: scroll to top of list
}

onMounted(async () => {
  await loadFavorites();
  await loadItems();
  await getPreferences();
});

function selectItem(item) {
    emit('selected', item);
}

function getFilterOptions() {
  const baseFilterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'favorites', label: 'Favoritos', icon: 'fa-heart text-ic-colesterol' },
  ];

  const preferenceOptions = preferences.value.map(pref => ({
    value: pref.id,
    label: pref.name,
    icon: pref.icon
  }));

  return [...baseFilterOptions, ...preferenceOptions];
}
</script>

<style scoped>
.shadowSearch {
    background-color: #f6f5fd;
}
</style>
