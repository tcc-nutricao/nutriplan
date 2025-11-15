<template>
    <Card 
        :class="{'border-p-600 shadow-xl shadow-p-600/20 w-full transition': item.isSelected, 'w-[85%]' : !item.isSelected}" 
        class="border-2 cursor-pointer transition-all duration-100 active:scale-[98%]" 
        @click="$emit('selected')"
    >
        <div class="flex flex-col items-between gap-2">
            <div class="flex w-full items-center justify-between">
                <h2 class="h2">{{ item.recipe.name }}</h2>
                <i v-if="isFav" class="fa-solid fa-heart text-xl text-red-500"></i>
            </div>
        </div>
        <div class="flex justify-between items-end">
            <div class="flex flex-wrap gap-2">
                <p v-for="(recipeObjective, index) in item.recipe.recipeObjectives" :key="index">
                    <i :class="'mr-2 fa-solid '+ recipeObjective.objective.icon"></i>{{ recipeObjective.objective.name }}
                </p>
            </div>
            <div class="ml-auto">
                <div>
                    <i class="fa-regular fa-clock mr-1"></i> 
                    <span>{{ item.recipe.preparation_time }} min</span>
                </div>
                <div>
                    <i class="fa-solid fa-utensils mr-1"></i> 
                    <span>{{ item.recipe.portion }} porções</span>
                </div>
            </div>  
        </div>
    </Card>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
            default: () => ({
                title: null,
                recipeObjectives: [],
                time: null,
                portions: null,
                isSelected: false,
                isFav: false
            })
        }
    },
    emits: ['selected']
}
</script>