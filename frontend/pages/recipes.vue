<template>
    <div class="px-5 md:px-10 flex flex-col gap-3 mt-6 md:mt-0">
        <h1 class="h1">Receitas</h1>

        <div class="hidden md:flex flex-row gap-5">
            <div class="flex flex-col w-[50%] mb-8">
                <SearchBar 
                    :filter="true" 
                    :sort="true" 
                    :filterOptions="getFilterOptions()" 
                    placeholder="Pesquise uma receita"
                    searchType="recipes"
                    @searchSelected="handleSearchSelected"
                    @filterSelected="handleFilterSelected"
                    @sortSelected="handleSortSelected"
                    class="sticky top-[30px] bg-g self-start w-full z-[400] shadowSearch" 
                />
                <Button
                    v-if="isNutri"
                    mediumPurple
                    class="w-max px-3 h-[42px] mt-5"
                    icon="fa-solid fa-plus short flex justify-center"
                    label="Criar uma receita"
                    @click="modalRecipe"
                />
                <div v-if="!loading && items.length > 0" class="flex flex-col gap-3 w-full mt-5">
                    <ReceitaButton
                        v-for="item in items"
                        :key="item.id"
                        :item="item"
                        @selected="selectItem(item.id)"
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

            <RecipeCard  wdth="65" :item="selectedItem" @toggleFavorite="handleToggleFavorite" />
        
        </div>

        <!-- MOBILE -->
        <div class="flex flex-col gap-3 md:hidden">
            <div class="search-sticky-wrapper md:static flex w-full gap-3">
                <SearchBar 
                    :filter="true"
                    :sort="true"
                    :filterOptions="getFilterOptions()"
                    placeholder="Pesquise uma receita"
                    searchType="recipes"
                    @searchSelected="handleSearchSelected"
                    @filterSelected="handleFilterSelected"
                    @sortSelected="handleSortSelected"
                    class="w-full shadowSearch z-[200]"
                />
            </div>
            <Button
                v-if="isNutri"
                mediumPurple
                class="w-full px-3 h-[42px] mt-2"
                icon="fa-solid fa-plus short flex justify-center"
                label="Criar uma receita"
                @click="modalRecipe"
            />
            <div v-if="!loading && items.length > 0" class="flex flex-col gap-3 w-full mt-5">
                <div 
                    v-for="item in items" 
                    :key="item.id"
                    class="flex flex-col gap-2"
                >
                    <ReceitaButton
                        :item="item"
                        @selected="selectItem(item.id)"
                    />
                    <RecipeCard 
                        v-if="item.id === selectedItemId"
                        :item="item"
                        @toggleFavorite="handleToggleFavorite"
                        wdth="100"
                    />
                </div>
                <Pagination
                    :currentPage="currentPage"
                    :totalPages="totalPages"
                    @page-changed="handlePageChange"
                    class="mt-4 mb-5"
                />
            </div>
            <div v-else-if="loading" class="mt-10 text-center text-lg text-gray-500">
                <p>Carregando receitas...</p>
            </div>
            <div v-else class="mt-10 text-center text-lg text-gray-500">
                <p>Nenhuma receita encontrada.</p>
            </div>
        </div>

        <RecipeCreate
            v-if="showModal"
            :selected="selectedItem?.id"
            @close="closeModal()"
            @saved="handleRecipeSaved"
        />
    </div>
</template>

<script setup>
import { get, insert } from '../crud';
import { ref, computed, onMounted } from 'vue';
const userCookie = useCookie('user-data');
const isNutri = computed(() => userCookie.value?.role === 'PROFESSIONAL');

const showModal = ref('');
const recipeListTop = ref(null);
const selectedItemId = ref(null);
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

const modalRecipe = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

async function handleRecipeSaved() {
  await loadItems(currentPage.value);
}

async function handleSearchSelected(recipe) {
  if (!recipe || !recipe.id) return;

  const response = await get(`recipe/${recipe.id}`);
  
  if (response && response.data) {
    const fullRecipe = response.data;
    
    const formattedRecipe = {
      ...fullRecipe,
      recipe: fullRecipe,
      steps: preparationMethodMapper(fullRecipe.preparation_method),
      isSelected: true,
      isFavorite: favoriteRecipeIds.value.has(fullRecipe.id)
    };

    const existingIndex = items.value.findIndex(item => item.id === fullRecipe.id);
    
    if (existingIndex !== -1) {
      selectItem(fullRecipe.id);
    } else {
      items.value.unshift(formattedRecipe);
      
      selectItem(fullRecipe.id);
    }
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
    const preferenceFilters = filters.map(id => ({ 
      field: 'recipePreferences', 
      operator: 'some', 
      value: { id_preference: id } 
    }));
    params.filters = JSON.stringify(preferenceFilters);
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
    isFavorite: favoriteRecipeIds.value.has(apiRecipe.id)
  }));

  totalPages.value = Math.ceil(totalItems / itemsPerPage);
  currentPage.value = page;
  loading.value = false;
}

async function getPreferences() {
  const response = await get('preference', { limit: 20 });
  if (response && response.data) {
    preferences.value = response.data;
  }
}

async function handleToggleFavorite(recipeId, favorited) {
  if (favorited) {
    favoriteRecipeIds.value.add(recipeId);
  } else {
    favoriteRecipeIds.value.delete(recipeId);
  }
  
  const recipe = items.value.find(item => item.id === recipeId);
  if (recipe) {
    recipe.isFavorite = favorited;
  }
}

function handlePageChange(page) {
  loadItems(page);
  recipeListTop.value?.scrollIntoView({ behavior: 'smooth' });
}

onMounted(async () => {
  await loadFavorites();
  await loadItems();
  await getPreferences();
});

function selectItem(id) {
    items.value.forEach(item => {
        item.isSelected = item.id === id;
    });
    selectedItemId.value = id;
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



const selectedItem = computed(() => {
    if (!selectedItemId.value) {
        return null;
    }
    return items.value.find(item => item.id === selectedItemId.value);
});
</script>

<style scoped>
@keyframes fade-shadow {
  from {
      box-shadow: 0 0 40px 40px rgba(246, 245, 253, 0),
          0 -10px 0 rgba(246, 245, 253, 0);
  }
  to {
      box-shadow: 0 0 40px 40px rgba(246, 245, 253, 1),
          0 -30px 0 rgba(246, 245, 253, 1);
  }
}
.shadowSearch {
    background-color: #f6f5fd;

    animation: fade-shadow linear;
    animation-timeline: scroll();
    animation-range-start: 120px;
    animation-range-end: 200px;
    animation-fill-mode: forwards;
}


@media (max-width: 768px) {
  .search-sticky-wrapper {
    position: sticky;
    top: calc(var(--menu-height) + 25px);
    z-index: 500;
    background-color: #f6f5fd;
  }
}

</style>