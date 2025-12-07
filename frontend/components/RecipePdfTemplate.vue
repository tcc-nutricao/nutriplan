<template>
    <div class="w-[210mm] h-[296mm] bg-white p-10 flex flex-col gap-6 text-gray-800 relative">
        <!-- Header -->
        <div class="w-full flex flex-col mb-2">
            <!-- <div class="flex w-full justify-center">
                <Logo class="text-3xl" />
            </div> -->
            <h1 class="text-start text-3xl font-bold text-p-600">{{ item?.recipe?.name }}</h1>
        </div>

        <!-- Tags/Preferences -->
        <div v-if="item?.recipe?.recipePreferences?.length" class="flex flex-wrap gap-2 text-sm">
            <span v-for="(recipePreference, index) in item.recipe.recipePreferences" :key="index" class="bg-gray-100 text-gray-600 px-3 pt-0 pb-4 rounded-full border border-gray-200">
                <i :class="recipePreference?.preference?.icon"></i>
                <span class="ml-2">{{ recipePreference?.preference?.name }}</span>
            </span>
        </div>
        
        <!-- Stats -->
        <div class="flex gap-8 text-gray-700 font-medium">
            <div class="flex items-center gap-2">
                <i class="fa-regular fa-clock text-p-500"></i> 
                <span>{{ item?.preparation_time }} min</span>
            </div>
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-utensils text-p-500"></i> 
                <span>{{ item?.portion }} porções</span>
            </div>
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-fire text-p-500"></i> 
                <span>{{ item?.calories }} kcal</span>
            </div>
        </div>

        <!-- Ingredients -->
        <div class="space-y-3">
            <h3 class="text-xl font-bold text-gray-700 pb-1">Ingredientes</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li v-for="(ingredient, index) in item?.recipeFoods ?? []" :key="index">
                    <span>{{ ingredient?.quantity ?? '' }}</span>
                    <span>{{ ingredient?.unit_of_measurement?.symbol ?? '' }}</span>
                    <span> de {{ ingredient?.food?.name.toLowerCase() ?? '' }}</span>
                </li>
            </ul>
        </div>

        <!-- Preparation Method -->
        <div class="space-y-3">
            <h3 class="text-xl font-bold text-gray-700 pb-1">Modo de preparo</h3>
            <div class="space-y-3 text-gray-700">
                <p v-for="(step, index) in item?.steps ?? []" :key="index" class="leading-relaxed">
                    <span class="font-bold text-gray-700 mr-1">{{ index + 1 }}.</span>
                    {{ step }}
                </p>
            </div>
        </div>
        <!-- Footer -->
        <div class="mt-auto w-full pt-6 border-t border-gray-100 flex justify-between items-center text-gray-500 text-sm">
            <div class="flex items-center gap-2 translate-y-3">
                <Logo class="text-sm mx-auto" />
            </div>
            <p>Gerado em {{ new Date().toLocaleDateString('pt-BR') }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        default: () => null
    }
});
</script>

<style scoped>
* {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}
</style>
