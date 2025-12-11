<template>
    <Card v-if="item" class="sticky top-[30px] self-start z-20" :bg="props.bg">
        <div class="flex w-full justify-between items-center mb-4">
            <h2 :class="props.bg === true ? 'h2' : 'h1'">{{ item?.recipe?.name }}</h2>
            <Button
             class="mt-0"
            :red="item?.isFavorite"
            :outlined="item?.isFavorite"
            :mediumPurple="!item?.isFavorite"
            :disabled="isTogglingFavorite"
            :class="handleFavoriteButtonClass(item?.isFavorite)"
            :icon="handleFavoriteButtonIcon(item?.isFavorite)"
            :label="handleFavoriteButtonLabel(item?.isFavorite)"
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
            <span><i class="fa-solid fa-fire mr-1"></i> {{ item?.calories }} kcal</span>
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
            <div class="w-full flex justify-center pt-5">
                <Button
                    mediumPurple
                    class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                    label="Gerar PDF"
                    @click="generatePDF"
                    :loading="isGeneratingPDF"
                />
            </div>
        </div>
    </Card>
    
<div v-else 
     class="sticky top-[30px] text-center bg-white rounded-3xl shadow-lg border-2 
            z-0 p-6 py-20 w-[65%] flex items-center justify-center h-max text-gray-500
            hidden md:flex">
    <p>Selecione uma receita ao lado para ver os detalhes!</p>
</div>

<!-- Hidden PDF Template -->
<div style="position: fixed; left: -9999px; top: 0; z-index: -1;">
    <div ref="pdfContent">
        <RecipePdfTemplate :item="item" v-if="item"/>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { insert } from '../crud';
import RecipePdfTemplate from './RecipePdfTemplate.vue';

const error = ref({ message: null });
const isTogglingFavorite = ref(false);

const props = defineProps({
    item: {
        type: Object,
        default: () => (null)
    },
    bg: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['toggleFavorite']);

function handleFavoriteButtonClass(isFavorite = false) {
    return isFavorite ? 'w-max ml-2 h-[42px] transition' : 'w-max ml-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition';
}

function handleFavoriteButtonIcon(isFavorite = false) {
    return isFavorite
        ? 'fa-solid fa-heart md:mr-2 text-red-500'
        : 'fa-regular fa-heart md:mr-2';
}

function handleFavoriteButtonLabel(isFavorite = false) {
    return window.innerWidth >= 768 
        ? (isFavorite ? 'Favoritado' : 'Favoritar')
        : '';
}

async function toggleFavorite(recipe) {
    if (!recipe || !recipe.id || isTogglingFavorite.value) return;
    
    isTogglingFavorite.value = true;
    const originalIsFavorite = recipe.isFavorite;
    recipe.isFavorite = !recipe.isFavorite;
    
    try {
        const result = await insert('recipe/favorite', { recipeId: recipe.id });
        
        if (!result || result.error) {
            recipe.isFavorite = originalIsFavorite;
            error.value = result?.message || 'Erro ao atualizar favorito.';
        } else {
            emit('toggleFavorite', recipe.id, result.data.favorited);
        }
    } catch (err) {
        recipe.isFavorite = originalIsFavorite;
        error.value = 'Erro ao atualizar favorito.';
    } finally {
        isTogglingFavorite.value = false;
    }
}

const isGeneratingPDF = ref(false);
const pdfContent = ref(null);

async function generatePDF() {
    if (!props.item) return;
    isGeneratingPDF.value = true;
    try {
        const element = pdfContent.value;
        const recipeName = props.item.recipe?.name || 'Receita';
        const filename = `${recipeName}.pdf`;

        const opt = {
            margin: [0, 0],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
        isGeneratingPDF.value = false;
    }
}
</script>