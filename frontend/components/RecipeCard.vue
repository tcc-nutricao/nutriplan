<template>
    <Card v-if="item" class="sticky top-[30px] self-start w-[50%] mb-8 z-20">
        <div class="flex w-full justify-between items-center mb-4">
            <h2 class="h2">{{ item?.recipe?.name }}</h2>
            <Button
             class="mt-0"
            :red="item?.favorite"
            :outlined="item?.favorite"
            :mediumPurple="!item?.favorite"
            :class="handleFavoriteButtonClass(item?.favorite)"
            :icon="handleFavoriteButtonIcon(item?.favorite)"
            :label="handleFavoriteButtonLabel(item?.favorite)"
            @click="toggleFavorite(item)"
            />
        </div>


        <div class="flex flex-wrap gap-2 mb-4">
            <p v-for="(recipePreference, index) in item.recipe.recipePreferences" :key="index" class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                <span><i :class="'mr-2 fa-solid '+ recipePreference?.preference?.icon"></i></span>{{ recipePreference?.preference?.name }}
            </p>
        </div>
        
        <div class="flex gap-4 mt-4 text-gray-600 mb-2">
            <span><i class="fa-regular fa-clock mr-1"></i> {{ item?.preparation_time }} min</span>
            <span><i class="fa-solid fa-utensils mr-1"></i> {{ item?.portion }} porções</span>
        </div>

        <div class="space-y-2">
            <h3 class="h3">Ingredientes:</h3>
            <ul class="list-disc list-inside">
                <li v-for="(ingredient, index) in item?.recipeFoods ?? []" :key="index">
                    <span>{{ ingredient?.quantity ?? '' }}</span>
                    <span>{{ ingredient?.unit_of_measurement?.symbol ?? '' }}</span>
                    <span> de {{ ingredient?.food?.name.toLowerCase() ?? '' }}</span>
                </li>
            </ul>
        </div>

        <div class="space-y-2">
            <h3 class="h3 mt-4 mb-2">Modo de preparo:</h3>
            <p v-for="(step, index) in item?.steps ?? []" :key="index"><span class="font-bold">
                {{ index + 1 }}. </span>{{ step }}
            </p>
            <div class="w-full flex justify-center mt-5">
                <Button
                    mediumPurple
                    class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                    label="Gerar PDF"
                />
            </div>
        </div>
    </Card>
    
    <div v-else class="sticky top-[30px] text-center bg-white rounded-3xl shadow-lg border-2 z-0 p-6 py-20 w-[50%] flex items-center justify-center h-max text-gray-500">
        <p>Selecione uma receita ao lado para ver os detalhes!</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { update } from '../crud';

const error = ref({ message: null });

const props = defineProps({
    item: {
        type: Object,
        default: () => (null)
    }
});

const emit = defineEmits(['toggleFavorite']);

function handleFavoriteButtonClass(isFavorite = false) {
    return isFavorite ? 'w-max px-3 h-[42px] transition' : 'w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition';
}

function handleFavoriteButtonIcon(isFavorite = false) {
    return isFavorite ? 'fa-solid fa-heart short flex justify-center text-red-500' : 'fa-regular fa-heart short flex justify-center';
}

function handleFavoriteButtonLabel(isFavorite = false) {
    return isFavorite ? 'Favoritado' : 'Favoritar';
}

async function toggleFavorite(recipe) {
    const originalIsFav = recipe.favorite;
    recipe.favorite = !recipe.favorite; 
    const mappedObject = {
        favorite: recipe.favorite,
        id_meal_plan: recipe.id_meal_plan,
        id_recipe: recipe.id_recipe,
        id_meal_plan_meal: recipe.id_meal_plan_meal
    };
    const result = await update('meal-plan-recipe', recipe.id, mappedObject);
    if (!result) {
        recipe.favorite = originalIsFav;
        error.value = result.message || 'Erro ao atualizar favorito.';
    }
}
</script>