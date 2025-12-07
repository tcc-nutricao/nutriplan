<template>
    <div class="w-[210mm] min-h-[296mm] bg-white p-10 flex flex-col gap-6 text-gray-800 relative">
        <!-- Header -->
         <div class="flex w-full justify-center">
            <Logo class="text-4xl" />
        </div>
        <div class="w-full flex justify-between items-start">
            
            <div class="flex flex-col gap-1">
                <h1 class="text-3xl font-bold text-p-600">Plano para {{ planDetails.objective.name }}</h1>
                <h2 class="text-xl font-semibold text-gray-700">
                    {{ planDetails?.calories }} kcal
                </h2>
                 <!-- Restrictions -->
                <div v-if="planDetails?.mealPlanDietaryRestrictions?.length" class="flex flex-wrap gap-2 text-sm mt-2">
                    <span v-for="(restriction, index) in planDetails.mealPlanDietaryRestrictions" :key="index" class="bg-gray-100 text-gray-600 px-3 pt-0 pb-4 rounded-full border border-gray-200 flex items-center">
                        <i :class="restriction.dietaryRestriction?.icon" class="mr-2"></i>
                        <span>{{ restriction.dietaryRestriction?.name }}</span>
                    </span>
                </div>

            </div>
            <div class="text-right mt-3">
                <p class="text-lg text-gray-600">{{ new Date().toLocaleDateString('pt-BR') }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ creatorText }}</p>

            </div>
        </div>

        <!-- Days Loop -->
         <div class="flex flex-col gap-6 flex-grow">
            <div v-for="day in orderedDays" :key="day.key" class="break-inside-avoid">
                 <div v-if="day.meals.length > 0">
                    <div class="bg-p-500 rounded-xl flex justify-center items-center px-4 pt-0 pb-2">
                        <h3 class="text-xl font-bold text-white inline-block -translate-y-2">
                            {{ day.label }}
                        </h3>
                    </div>
                    
                    <div class="flex flex-col gap-3 ml-2 border-l-2 border-p-200 pl-4">
                        <div v-for="(meal, index) in day.meals" :key="index" class="flex flex-col">
                             <h4 class="font-bold text-gray-700 text-lg mb-1">{{ meal.meal?.name }}</h4>
                             
                             <div v-if="meal.mealPlanRecipes?.length" class="flex flex-col gap-1">
                                <div v-for="recipeItem in meal.mealPlanRecipes" :key="recipeItem.id" class="text-gray-600 text-sm">
                                    • {{ recipeItem.recipe?.name }}
                                     <span class="text-xs text-gray-400" v-if="recipeItem.recipe?.calories">
                                        ({{ Math.round(recipeItem.recipe.calories) }} kcal)
                                     </span>
                                </div>
                             </div>
                             <p v-else class="text-gray-400 italic text-sm">Sem receitas planejadas</p>
                        </div>
                    </div>
                 </div>
            </div>
         </div>

        <!-- Footer -->
        <!-- <div class="mt-auto w-full pt-6 border-t border-gray-100 flex justify-between items-center text-gray-500 text-sm break-before-avoid">
            <div class="flex items-center gap-2 translate-y-3">
                 <Logo class="text-sm mx-auto" />
            </div>
            <p>Gerado em {{ new Date().toLocaleDateString('pt-BR') }}</p>
        </div> -->
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    planDetails: {
         type: Object,
        default: () => ({})
    },
    creatorText: {
        type: String,
        default: ''
    }
});

const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const dayLabels = {
    'MON': 'Segunda-feira',
    'TUE': 'Terça-feira',
    'WED': 'Quarta-feira',
    'THU': 'Quinta-feira',
    'FRI': 'Sexta-feira',
    'SAT': 'Sábado',
    'SUN': 'Domingo'
};

const orderedDays = computed(() => {
    return dayOrder.map(key => ({
        key,
        label: dayLabels[key],
        meals: props.items.filter(item => item.day === key)
    })).filter(day => day.meals.length > 0);
});

</script>

<style scoped>
* {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}
</style>
