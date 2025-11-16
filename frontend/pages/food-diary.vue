<template>
    <div class="flex flex-col gap-3 px-4 sm:px-6 md:px-10">
        <h1 class="h1">Diário Alimentar</h1>
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
            <Card class="lg:col-span-2">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                    <h2 class="h2">Registrar consumo diário</h2>
                    <Badge :label="new Date().toLocaleDateString('pt-BR')"/>
                </div>

                <p class="text-danger font-bold w-full text-center mt-0 text-sm sm:text-base" v-if="errors.meal && selectedMeal === null">Selecione uma refeição</p>
                <div class="flex flex-wrap gap-2 w-full justify-center">
                    <Button 
                        mediumPurple
                        :red="errors.meal && selectedMeal === null"
                        v-for="meal in mealNames"
                        :key="meal"
                        :label="meal"
                        @click="selectMeal(meal)"
                        :outlined="selectedMeal !== meal"
                        :class="[
                            'w-auto sm:w-max px-2 sm:px-0 h-[38px] sm:h-[42px] text-xs sm:text-sm shadow-lg shadow-p-600/10 transition',
                            { 'bg-p-500 text-white': selectedMeal === meal }
                        ]"
                    />
                </div>
        
        
                <div 
                    class="flex flex-col px-4 mt-2 pb-3 pt-4 border-2 rounded-2xl mb-5"
                    :class="{ 'border-red-500': (errors.meal && selectedMeal === null) || errors.ingredients, 'border-p-400': !errors.ingredients }"
                >
                    <Label label="Alimentos" class="text-xl font-semibold mb-2" :error="errors.ingredients"/>
                    <Input
                        v-model="object.id_food"
                        class="mb-5"
                        placeholder="Buscar"
                        :error="errors.id_food"
                    />
                    <div class="flex gap-2 w-full">
                        <InputText
                        v-model="object.quantity"
                        class="mb-5 w-full"
                        label="Quantidade"
                        placeholder="Digite aqui"
                        type="number"
                        :error="errors.quantity"
                        />
                        <InputText
                        v-model="object.id_unit_of_measurement"
                        class="mb-5 w-full"
                        label="Unidade"
                        placeholder="Buscar"
                        :error="errors.id_unit_of_measurement"
                        />
                    </div>
                    <div class="flex flex-row justify-center gap-2">
                        <Button 
                            mediumPurple
                            class="w-max px-0 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                            label="Adicionar ingrediente"
                            icon="fa-solid fa-plus short flex justify-center"
                            @click="addItem"
                        />
                    </div>
                </div>
        
                <p v-if="!hasAnyItems" :class="{'text-red-500' : errors.ingredients}" class="text-gray-medium mt-1 pb-3 mb-3 border-b-2 border-p-200">Adicione alimentos ou receitas em refeições acima!</p>
                <div v-if="hasAnyItems" class="flex flex-col gap-4 mt-1 pb-3 mb-3 max-w-full border-b-2 border-p-200">
                    <template v-for="mealName in mealNames" :key="mealName" class="max-w-full">
                    <div v-if="newMealItems[mealName].length > 0" class="max-w-full">
                        <h3 class="text-p-800 font-bold text-lg mb-2">{{ mealName }}</h3>
                        <div class="flex flex-wrap gap-2 w-full">
                            <ItemButton
                                v-for="(item, index) in newMealItems[mealName]"
                                :key="index"
                                :label="item.id_food"
                                :quantity="item.quantity"
                                :unity="item.id_unit_of_measurement"
                                class="w-full"
                                @delete-item="deleteItem(mealName, index)" 
                            />
                        </div>
                    </div>
                    </template>
                </div>
                <div class="flex justify-center mt-2">
                    <Button 
                        mediumPurple
                        class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        label="Registrar consumo"
                        @click="save"
                    />
                </div>
            </Card>

            <Card class="lg:col-span-3">
                <PeriodTab 
                    :periods="datePeriods" 
                    @period-changed="handlePeriodChange"
                />
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-3 px-2 sm:px-4 mt-3">
                    <div class="lg:col-span-1 flex flex-col border-r-2 border-gray-200">
                        <div v-for="meal in meals" :key="meal.id" class="mt-3">
                            <h3 class="text-p-900 font-bold text-sm sm:text-base">{{ meal.name.toUpperCase() }}</h3>
                            <p v-for="(consumed, index) in meal.consumedItems" :key="index" class="text-sm sm:text-base break-words sm:text-nowrap">
                                {{ consumed?.item?.name }} ({{ consumed?.quantity + ' ' + consumed?.unitOfMeasurement?.symbol }})
                            </p>
                        </div>
                    </div>
                    <div class="lg:col-span-2 flex flex-col items-center mb-2 mt-4 lg:mt-0">
                        <h3 class="h3 text-center text-sm sm:text-base">
                            Total consumido:
                            <span class="font-bold text-2xl sm:text-3xl text-p-600 mx-1">{{ macros?.totalCalories ?? 0 }}</span>
                            / {{ dailyCalorieGoal }} kcal ({{ Math.round(macros?.totalCalories / macros?.goalCalories * 100) }}%)
                        </h3>
                        <div class="flex flex-col items-start w-full lg:w-[90%] mt-4 cursor-default">
                            <p v-for="(macroLabel, i) in macroLabels" :key="i" :class="[
                                'border-l-[20px] sm:border-l-[25px] border-2 rounded-md pl-1 mb-1 w-full text-sm sm:text-base',
                                getMacroClasses(i)
                            ]">{{ macroLabel.label }}
                            <span class="font-bold text-base sm:text-lg mx-1">{{ macros[macroLabel.key]?.toFixed(1) }} g</span></p>
                        </div>
                        <div class="flex items-center justify-center w-full h-full mt-4">
                            <NutrientsChart
                                class="overflow-visible max-w-full"
                                :chart-data="chartData"
                            />
                        </div>
                        <div class="w-full flex justify-center mt-5">
                            <Button
                                mediumPurple
                                class="w-max px-2 sm:px-3 h-[38px] sm:h-[42px] text-sm sm:text-base shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                                label="Gerar PDF"
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { get } from '@/crud'
import { ref, computed, onMounted, watch } from 'vue';

const dailyCalorieGoal = ref(2000);
const selectedMeal = ref(null);
const macros = ref({})
const meals = ref([]);
const newItems = ref({})
const dateRange = ref({ startDate: null, endDate: null });

const mealNames = meals.value.map(meal => meal.name);

const macroLabels = [
    { key: 'totalCarbohydrates', label: 'Carboidratos' },
    { key: 'totalProteins', label: 'Proteínas' },
    { key: 'totalFats', label: 'Gorduras' },
    { key: 'totalFiber', label: 'Fibras' },
    { key: 'totalAddedSugars', label: 'Açúcares' }
];

const datePeriods = [
    { key: 'daily', label: 'Diário' },
    { key: 'weekly', label: 'Semanal' },
    { key: 'monthly', label: 'Mensal' },
    { key: 'yearly', label: 'Anual' }
];

const object = ref({
  id_food: '',
  quantity: '',
  id_unit_of_measurement: ''
});

const inputs = ref({
  ingredients: '',
  name: '',
  portions: '',
  time: '',
  preparation: ''
})

const errors = ref({
  id_food: null,
  quantity: null,
  id_unit_of_measurement: null,
  meal: null,
  ingredients: null,
});


onMounted(async () => {
    await getStatistics();
});

function handlePeriodChange({ startDate, endDate }) {
    dateRange.value = { startDate, endDate };
    getStatistics();
}

function getMacroClasses(index = 0) {
    return [
        'border-l-[25px] border-2 rounded-md pl-1 mb-1',
        index === 0 ? 'border-p-900' : '',
        index === 1 ? 'border-p-700' : '',
        index === 2 ? 'border-p-500' : '',
        index === 3 ? 'border-p-300' : '',
        index === 4 ? 'border-p-100 ring-1 ring-p-400' : ''
    ];
}

function sumMacros() {
  let total = 0;
  total = macros.value ? macros.value.totalProteins + macros.value.totalCarbohydrates + macros.value.totalFats + macros.value.totalFiber + macros.value.totalAddedSugars : 0;
  return total      
}

function getMacrosPercentage(macro = 0) {
  const total = sumMacros(); 
  const percentage = (macro / total) * 100;
  let label = `${percentage.toFixed(1)}%`;
  return label;
}

const chartData = computed(() => {
  return {
      labels: [
          `Carboidratos (${getMacrosPercentage(macros.value?.totalCarbohydrates)})`, 
          `Proteínas (${getMacrosPercentage(macros.value?.totalProteins)})`, 
          `Gorduras (${getMacrosPercentage(macros.value?.totalFats)})`, 
          `Fibras (${getMacrosPercentage(macros.value?.totalFiber)})`, 
          `Açúcares (${getMacrosPercentage(macros.value?.totalAddedSugars)})`, 
      ],
      datasets: [
          {
              backgroundColor: ['#553280', '#7a48b9', '#9b78da', '#cec2f0 ', '#f0edfa'],
              data: [
                  macros.value?.totalCarbohydrates || 0, 
                  macros.value?.totalProteins || 0,
                  macros.value?.totalFats || 0,
                  macros.value?.totalFiber || 0,
                  macros.value?.totalAddedSugars || 0
              ],
              borderColor: ['transparent', 'transparent', 'transparent', 'transparent', '#b49fe6'],
              clip: {
                  left: 5, 
                  top: 50, 
                  right: 5,
                  bottom: 50, 
              },
              borderRadius: 8,
              borderWidth: 1,
              hoverOffset: 30,
          }
      ],
  }
});

const hasAnyItems = computed(() => {
  const allMeals = Object.values(newItems); 
  return allMeals.some(itemList => itemList.length > 0);
});

function selectMeal(meal) {
  selectedMeal.value = meal; 
}

function addItem() {
  errors.id_food = null;
  errors.quantity = null;
  errors.id_unit_of_measurement = null;
  errors.meal = null;

  if (!selectedMeal.value) { 
      errors.meal = 'Selecione uma refeição';
      return;
  }

  newMealItems[selectedMeal.value].push({ ...object });
  clearInputs(); 
}

function deleteItem(mealName, itemIndex) {
  newMealItems[mealName].splice(itemIndex, 1); 
}

function clearInputs() {
  object.id_food = '';
  object.quantity = '';
  object.id_unit_of_measurement = '';
  errors.id_food = null;
  errors.quantity = null;
  errors.id_unit_of_measurement = null;
  errors.meal = null;
}

async function save() {
    const response = await create('food-consumed', newItems)
    if (response && !response.error) {
        Object.keys(newMealItems).forEach(meal => {
            newMealItems[meal] = [];
        });
        clearInputs();
        await getStatistics();
    } else {
        errors.value = response.errors || {};
    }
}

async function getStatistics() {
    let startDate, endDate;
    
    if (dateRange.value.startDate && dateRange.value.endDate) {
        startDate = dateRange.value.startDate;
        endDate = dateRange.value.endDate;
    } else {
        // Valores padrão (último dia)
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date();
    }

    const dates = JSON.stringify([startDate.toISOString(), endDate.toISOString()]);
    
    const response = await get('food-consumed/stats', { dates });
    meals.value = response.data.meals;
    console.log(meals.value)
    macros.value = response.data.totalMacros;
}
</script>