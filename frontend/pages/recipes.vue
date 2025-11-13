<template>
    <div class="px-10 flex flex-col gap-3">
        <div ref="recipeListTop"></div>
        <h1 class="h1">Receitas</h1>
        <div class="flex flex-row gap-5">
            <div class="flex flex-col w-[50%] mb-8">
                <SearchBar :filter="true" :sort="true" :filterOptions="filterOptions" :sortOptions="sortOptions" placeholder="Pesquise uma receita" class="stickyProfile w-full shadowSearch z-20" />
                <Button
                    v-if="isNutri"
                    mediumPurple
                    class="w-max px-3 h-[42px] mt-5"
                    icon="fa-solid fa-plus short flex justify-center"
                    label="Criar uma receita"
                    @click="openCreate"
                />
                <div v-if="!pending && itemList.length > 0" listaReceitas class="flex flex-col gap-3 w-full mt-5">
                    <ReceitaButton
                        v-for="item in itemList"
                        :key="item.id"
                        :title="item.title"
                        :categories="item.categories"
                        :time="item.time"
                        :portions="item.portions"
                        :is-selected="item.id === selectedItemId"
                        :is-fav="item.isFav"
                        @selecionado="selectItem(item.id)"
                    />
                    <Pagination
                        :currentPage="currentPage"
                        :totalPages="totalPages"
                        @page-changed="handlePageChange"
                        class="mt-4"
                    />
                </div>
                <div v-else-if="pending" class="mt-5 text-center text-gray-500">
                    <p>Carregando receitas...</p>
                </div>
                <div v-else class="mt-5 text-center text-gray-500">
                    <p>Nenhuma receita encontrada.</p>
                </div>
            </div>

            <div v-if="selectedItem" class="stickyProfile bg-white rounded-3xl shadow-lg border-2 p-6 w-[50%] mb-8 z-20">
                <div class="flex w-full justify-between items-center mb-4">
                    <h2 class="h2">{{ selectedItem.title }}</h2>
                    <Button
                        v-if="selectedItem.isFav"
                        red outlined
                        class="w-max px-3 h-[42px] transition"
                        icon="fa-solid fa-heart short flex justify-center text-red-500"
                        label="Favoritado"
                        @click="toggleFavorite(selectedItem)"
                    />
                    <Button
                        v-else
                        mediumPurple
                        class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        icon="fa-regular fa-heart short flex justify-center"
                        label="Favoritar"
                        @click="toggleFavorite(selectedItem)"
                    />
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                    <p v-for="(category, index) in selectedItem.categories" :key="index" class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                        <span><i :class="'mr-2 fa-solid '+ category.icon"></i></span>{{ category.label }}
                    </p>
                </div>
                <p class="mb-2"></p>
                <div class="flex gap-4 mt-4 text-gray-600">
                    <span><i class="fa-regular fa-clock mr-1"></i> {{ selectedItem.time }} min</span>
                    <span><i class="fa-solid fa-utensils mr-1"></i> {{ selectedItem.portions }} porções</span>
                </div>
                <h3 class="h3 mt-4 mb-2">Ingredientes:</h3>
                <p v-for="(ingredient, index) in selectedItem.ingredients" :key="index">{{ '• ' + ingredient }}</p>
                <h3 class="h3 mt-4 mb-2">Modo de preparo:</h3>
                <p class="mb-1.5" v-for="(step, index) in selectedItem.steps" :key="index"><span class="font-bold">{{ index + 1 }}. </span>{{ step }}</p>
                <div class="w-full flex justify-center mt-5">
                    <Button
                        mediumPurple
                        class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        label="Gerar PDF"
                    />
                </div>
            </div>
            <div v-else class="stickyProfile bg-white rounded-3xl shadow-lg border-2 z-0 p-6 py-20 w-[50%] flex items-center justify-center text-gray-500">
                <p>Selecione uma receita ao lado para ver os detalhes!</p>
            </div>
        </div>

        <RecipeModal
            v-if="showModal"
            :section="showModal"
            @close="closeModal()"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCookie, useNuxtApp } from 'nuxt/app';

const userCookie = useCookie('user-data');
const { $axios } = useNuxtApp(); 

const isNutri = computed(() => userCookie.value?.role === 'PROFESSIONAL');

const showModal = ref('');
const recipeListTop = ref(null);
const selectedItemId = ref(null);
const itemList = ref([]); 
const pending = ref(true); 

const currentPage = ref(1);
const totalPages = ref(0);
const itemsPerPage = 10;

const openCreate = () => {
  showModal.value = 'create';
};

const closeModal = () => {
  showModal.value = '';
};

function mapApiDataToFrontend(apiRecipe) {
  const steps = apiRecipe.preparation_method 
    ? apiRecipe.preparation_method.split('\n').filter(step => step.trim() !== '') 
    : [];

  return {
    id: apiRecipe.id,
    title: apiRecipe.name, 
    categories: apiRecipe.categories?.map(cat => ({
        label: cat.name,
        icon: getIconForCategory(cat.name) || 'fa-solid fa-utensils'
    })) || [],
    time: apiRecipe.preparation_time, 
    portions: apiRecipe.portion,      
    isFav: apiRecipe.isFavorite,      
    ingredients: apiRecipe.recipeFoods?.map(rf => 
        `${rf.quantity} ${rf.unit_of_measurement.abbreviation || rf.unit_of_measurement.name} de ${rf.food.name}`
    ) || [],
    steps: steps,
  };
}

function getIconForCategory(categoryName) {
    const categoryMap = {
        'Perda de Peso': 'fa-solid fa-fire text-ic-emagrecer',
        'Energia': 'fa-solid fa-bolt text-ic-energia',
        'Vegano': 'fa-solid fa-seedling text-ic-vegano',
    };
    return categoryMap[categoryName];
}

async function fetchRecipes(page = 1) {
  try {
    pending.value = true;
    const response = await $axios.get('/recipe', {
      params: {
        page: page,
        limit: itemsPerPage,
      }
    });

    const recipesFromApi = response.data.data; 
    const totalItems = response.data.total;
    
    if (recipesFromApi && recipesFromApi.length > 0) {
      itemList.value = recipesFromApi.map(mapApiDataToFrontend);
      selectItem(itemList.value[0].id);
    } else {
      itemList.value = [];
    }
    totalPages.value = Math.ceil(totalItems / itemsPerPage);
    currentPage.value = page;
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
  } finally {
    pending.value = false;
  }
}

async function toggleFavorite(recipe) {
    const originalIsFav = recipe.isFav;
    recipe.isFav = !recipe.isFav; 

    try {
        const method = recipe.isFav ? 'POST' : 'DELETE';
        await $axios({
            method: method,
            url: `/recipe/${recipe.id}/favorite`
        });
    } catch (e) {
        console.error("Falha ao favoritar a receita:", e);
        recipe.isFav = originalIsFav; 
        alert("Ocorreu um erro ao tentar favoritar a receita.");
    }
}

function handlePageChange(page) {
  fetchRecipes(page);
  recipeListTop.value?.scrollIntoView({ behavior: 'smooth' });
}

onMounted(() => {
  fetchRecipes();
});

function selectItem(id) {
    selectedItemId.value = id;
}

const filterOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'favorites', label: 'Favoritos', icon: 'fa-heart text-ic-colesterol' },
  { value: 'gluten-free', label: 'Sem Glúten', icon: 'fa-wheat-awn text-ic-gluten' },
  { value: 'sugar-free', label: 'Sem açúcar', icon: 'fa-candy-cane text-ic-sugar' },
  { value: 'lactose-free', label: 'Sem lactose', icon: 'fa-glass-water text-ic-lactose' },
  { value: 'vegetarian', label: 'Vegetariano', icon: 'fa-carrot text-ic-vegetariano' },
  { value: 'vegan', label: 'Vegano', icon: 'fa-seedling text-ic-vegano' },
  { value: 'lose-weight', label: 'Emagrecer', icon: 'fa-fire text-ic-emagrecer' },
  { value: 'muscle', label: 'Ganho de músculo', icon: 'fa-dumbbell text-ic-musculo' },
  { value: 'keep-weight', label: 'Manter peso', icon: 'fa-scale-balanced text-ic-manterpeso' },
  { value: 'colesterol', label: 'Colesterol', icon: 'fa-heart-circle-plus text-ic-colesterol' },
  { value: 'sleep', label: 'Sono', icon: 'fa-moon text-ic-sono' },
  { value: 'energy', label: 'Energia', icon: 'fa-bolt text-ic-energia' },
  { value: 'antiinflammatory', label: 'Antinflamatório', icon: 'fa-droplet text-ic-antinfl' },
  { value: 'antioxidant', label: 'Antioxidante', icon: 'fa-atom text-ic-antiox' },
  { value: 'nut-free', label: 'Sem  nozes', icon: 'fa-hand-dots text-ic-nozes' },
  { value: 'no-fish', label: 'Sem peixe', icon: 'fa-fish text-ic-peixe' },
  { value: 'intestine', label: 'Intestino', icon: 'fa-worm text-ic-intestino' },
  { value: 'easy', label: 'Fácil', icon: 'fa-hands text-ic-vegan' },
  { value: 'sweet', label: 'Doce', icon: 'fa-ice-cream text-ic-sono' },
];

const sortOptions = [
  { value: 'alphabetic', label: 'Ordem alfabética' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'time', label: 'Tempo de Preparo' },
];

const selectedItem = computed(() => {
    if (!selectedItemId.value) {
        return null;
    }
    return itemList.value.find(item => item.id === selectedItemId.value);
});
</script>

<style>
.stickyProfile {
    position: sticky;
    top: 30px;
    align-self: flex-start;
  }

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
</style>