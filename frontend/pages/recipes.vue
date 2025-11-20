<template>
    <div class="px-4 lg:px-10 flex flex-col gap-3">
        <h1 class="h1">Receitas</h1>

        <div class="flex flex-row gap-5">
            <div class="flex flex-col w-[50%] mb-8">
                <SearchBar 
                    :filter="true" 
                    :sort="true" 
                    :filterOptions="getFilterOptions()" 
                    placeholder="Pesquise uma receita"
                    searchType="recipes"
                    @searchSelected="onRecipeSelected"
                    class="sticky top-[30px] self-start w-full bg-p-50 z-20 shadowSearch" 
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

            <RecipeCard :item="selectedItem" />
        
        </div>

        <RecipeModal
            v-if="showModal"
            :selected="selectedItem?.id"
            @close="closeModal()"
        />
    </div>
</template>

<script setup>
import { get } from '../crud';
import { ref, computed, onMounted } from 'vue';
const userCookie = useCookie('user-data');
const isNutri = computed(() => userCookie.value?.role === 'PROFESSIONAL');

const showModal = ref('');
const recipeListTop = ref(null);
const selectedItemId = ref(null);
const items = ref([]); 
const preferences = ref([]);
const loading = ref(true); 
const route = ref('meal-plan-recipe');
const errors = ref({});

const currentPage = ref(1);
const totalPages = ref(0);
const itemsPerPage = 10;

const modalRecipe = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

function preparationMethodMapper(preparationMethod) {
  if (!preparationMethod) return [];
  const steps = preparationMethod
    .split(',')
    .map(step => step.trim())
    .filter(step => step !== '');
  
  return steps.map((step, index) => {
    const capitalized = step.charAt(0).toUpperCase() + step.slice(1);
    const isLast = index === steps.length - 1;
    return isLast ? capitalized : (capitalized.endsWith(';') ? capitalized : capitalized + ';');
  });
}

async function loadItems(page = 1) {
  loading.value = true;
  const response = await get(route.value, { page, limit: itemsPerPage });

  if (!response || response.message) {
    errors.value = response.message || 'Erro ao carregar receitas.';
    return
  }

  const recipesFromApi = response.data; 
  const totalItems = response.data.total;

  items.value = recipesFromApi.map(apiRecipe => ({
    ...apiRecipe,
    steps: preparationMethodMapper(apiRecipe.preparation_method)
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
  recipeListTop.value?.scrollIntoView({ behavior: 'smooth' });
}

onMounted(async () => {
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
    animation: fade-shadow linear;
    animation-timeline: scroll();
    animation-range-start: 120px;
    animation-range-end: 200px;

    animation-fill-mode: forwards;
}
</style>