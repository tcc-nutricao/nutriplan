<template>
  <div class="flex flex-col gap-5 h-full">
    <div class="grid grid-cols-2 gap-5">
        <div class="flex flex-col gap-2">
            <Label label="Calorias (kcal)" required />
            <Input type="number" v-model="calories" :error="errors.calories" placeholder="Ex: 2000" />
        </div>
        <div class="flex flex-col gap-2">
            <Label label="Objetivo" required />
            <Select v-model="objective" :options="objectiveOptions" :error="errors.objective" placeholder="Selecione um objetivo" />
        </div>
        <div class="col-span-2 flex flex-col gap-2">
            <Label label="Restrições Alimentares" required />
            <SelectMultiple v-model="restrictions" :options="restrictionOptions" :error="errors.restrictions" placeholder="Selecione as restrições" />
        </div>
    </div>

    <div class="flex flex-col items-center border-t-2 border-gray-200 pt-6 pb-1 gap-3">
        <WeekDaysBar v-model="selectedDay" />
    </div>

    <p class="text-gray-600 font-bold text-np text-2xl text-center"> {{ weekDay(selectedDay) }} 
        <span class="ml-2 text-lg text-gray-500 font-normal">({{ dailyCalories }} kcal)</span>
    </p>

    <div class="flex flex-col gap-6 pr-2 pb-3">
        <div 
            v-for="meal in meals" 
            :key="meal.id" 
            class="flex flex-col group gap-2 p-3 bg-p-50 rounded-xl hover:bg-p-50 transition border border-p-300 hover:border-p-400"
        >
            <div class=" flex items-center justify-between">
                <span class="font-semibold text-gray-700">
                    {{ meal.name }}
                    <span class="ml-2 text-sm text-gray-500 font-normal" v-if="getMealCalories(meal.id) > 0">
                        ({{ getMealCalories(meal.id) }} kcal)
                    </span>
                </span>
                
                <Button 
                    mediumPurple 
                    class="opacity-0 group-hover:opacity-100 transition-opacity px-3 h-[32px] text-sm"
                    icon="fa-solid fa-plus"
                    label="Adicionar receita"
                    @click="addRecipe(meal)"
                />
            </div>

             <div v-if="mealRecipes[meal.id] && mealRecipes[meal.id][selectedDay]" class="flex flex-col gap-2 mt-1">
                <div v-for="(recipe, idx) in mealRecipes[meal.id][selectedDay]" :key="idx" class="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-600 font-medium">
                        {{ recipe.name }}
                        <span class="ml-5 text-p-500 font-medium">{{ recipe.calories }} kcal</span>
                    </span>
                    <div class="flex gap-2">
                        <Button 
                            mediumPurple 
                            class="px-0 h-[32px] text-sm"
                            icon="fa-solid fa-eye"
                            @click="openRecipeModal(recipe)"
                        />
                        <Button 
                            red 
                            class="px-0 h-[32px] text-sm"
                            icon="fa-solid fa-trash-can"
                            @click="removeRecipe(meal.id, idx)"
                        />
                    </div>
                </div>
             </div>
        </div>
        <div v-if="meals.length === 0" class="text-center text-gray-400 py-4">
            Carregando refeições...
        </div>
    </div>

    <div class="mt-auto flex justify-center gap-3 pt-4 ">
        <Button outlined lightPurple label="Cancelar" @click="$emit('close')" />
        <Button mediumPurple label="Salvar" @click="save" :loading="loading" />
    </div>

    <RecipeList 
        v-if="showRecipeModal" 
        @close="closeRecipeModal" 
        @selected="handleRecipeSelected" 
    />
    
    <RecipeModal
        v-if="selectedRecipe"
        :recipe="selectedRecipe"
        @close="closeRecipe"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { get, insert } from '../crud'

const emit = defineEmits(['close', 'save'])

const calories = ref('')
const objective = ref('')
const restrictions = ref([])

const selectedDay = ref('MON')

const objectiveOptions = ref([])
const restrictionOptions = ref([])
const meals = ref([])

const selectedRecipe = ref(null)
const loading = ref(false)

const errors = ref({
  calories: null,
  objective: null,
  restrictions: null,
  enoughRecipes: null
})

const openRecipeModal = (recipe) => {
  selectedRecipe.value = recipe
}

const closeRecipe = () => {
  selectedRecipe.value = null
}

const weekDay = (day) => {
    switch (day) {
        case 'MON': return 'Segunda-feira'
        case 'TUE': return 'Terça-feira'
        case 'WED': return 'Quarta-feira'
        case 'THU': return 'Quinta-feira'
        case 'FRI': return 'Sexta-feira'
        case 'SAT': return 'Sábado'
        case 'SUN': return 'Domingo'
    }
}

const showRecipeModal = ref(false)
const currentMealId = ref(null)
const mealRecipes = reactive({})

const dailyCalories = computed(() => {
    let total = 0
    for (const mealId in mealRecipes) {
        if (mealRecipes[mealId][selectedDay.value]) {
            total += mealRecipes[mealId][selectedDay.value].reduce((sum, recipe) => {
                return sum + (Number(recipe.calories) || 0)
            }, 0)
        }
    }
    return total
})

const getMealCalories = (mealId) => {
    if (mealRecipes[mealId] && mealRecipes[mealId][selectedDay.value]) {
        return mealRecipes[mealId][selectedDay.value].reduce((sum, recipe) => {
            return sum + (Number(recipe.calories) || 0)
        }, 0)
    }
    return 0
}

onMounted(async () => {
    try {
        const [objRes, restRes, mealRes] = await Promise.all([
            get('objective'),
            get('restriction'),
            get('meal')
        ])

        objectiveOptions.value = (objRes.data || []).map(i => ({ label: i.name, value: i.id }))
        restrictionOptions.value = (restRes.data || []).map(i => ({ label: i.name, value: i.id }))
        meals.value = mealRes.data || []
    } catch (error) {
        console.error('Erro ao carregar dados:', error)
        if (!meals.value || meals.value.length === 0) {
             meals.value = [
                { id: 1, name: 'Café da Manhã' },
                { id: 2, name: 'Lanche da Manhã' },
                { id: 3, name: 'Almoço' },
                { id: 4, name: 'Lanche da Tarde' },
                { id: 5, name: 'Jantar' },
                { id: 6, name: 'Ceia' }
            ]
        }
    }
})

const addRecipe = (meal) => {
    currentMealId.value = meal.id
    showRecipeModal.value = true
}

const closeRecipeModal = () => {
    showRecipeModal.value = false
    currentMealId.value = null
}

const handleRecipeSelected = (recipe) => {
    if (!currentMealId.value) return

    if (!mealRecipes[currentMealId.value]) {
        mealRecipes[currentMealId.value] = {}
    }
    if (!mealRecipes[currentMealId.value][selectedDay.value]) {
        mealRecipes[currentMealId.value][selectedDay.value] = []
    }

    mealRecipes[currentMealId.value][selectedDay.value].push(recipe)
    closeRecipeModal()
}

const removeRecipe = (mealId, index) => {
    if (mealRecipes[mealId] && mealRecipes[mealId][selectedDay.value]) {
        mealRecipes[mealId][selectedDay.value].splice(index, 1)
    }
}

const save = async () => {
    errors.value = { calories: null, objective: null, restrictions: null, enoughRecipes: null }
    
    if (!calories.value) errors.value.calories = 'Campo obrigatório'
    if (!objective.value) errors.value.objective = 'Campo obrigatório'
    
    if (errors.value.calories || errors.value.objective) return

    loading.value = true
    try {
        const payload = {
            calories: calories.value,
            objective: objective.value,
            restrictions: restrictions.value,
            mealRecipes: mealRecipes
        }

        const res = await insert('meal-plan', payload)
        if (res.error) throw res

        alert('Plano alimentar criado com sucesso!')
        emit('save')
        emit('close')
    } catch (error) {
        console.error('Erro ao salvar plano:', error)
        alert('Erro ao salvar plano alimentar')
    } finally {
        loading.value = false
    }
}
</script>
