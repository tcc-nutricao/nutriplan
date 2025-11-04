<template>
    <div class="flex flex-col gap-3 px-10">
        <h1 class="h1">Diário Alimentar</h1>
        <div class="flex flex-row gap-5">
            <div class="flex flex-col w-[40%] h-max mb-8 rounded-3xl shadow-lg gap-3 bg-white p-6 pb-8">
                <div class="flex flex-row justify-between items-center mb-3">
                    <h2 class="h2">Registrar consumo diário</h2>
                    <div class="flex justify-center align-items border-2 px-2 py-1 bg-p-100 transition 
                        border-p-400 rounded-xl h2main hover:bg-p-200 cursor-pointer active:scale-95 select-none">
                        {{ currentDate }}
                    </div>
                </div>
                <p class="text-danger font-bold w-full text-center mt-0" v-if="errors.meal && selectedMeal === null">Selecione uma refeição</p>
                <div class="flex gap-2 w-full justify-center">
                    <Button 
                        mediumPurple
                        :red="errors.meal && selectedMeal === null"
                        v-for="meal in mealNames"
                        :key="meal"
                        :label="meal"
                        @click="selectMeal(meal)"
                        :outlined="selectedMeal !== meal"
                        :class="[
                            'w-max px-0 h-[42px] shadow-lg shadow-p-600/10 transition',
                            { 'bg-p-500 text-white': selectedMeal === meal }
                        ]"
                    />
                </div>
                <div class="flex flex-col px-4 pb-3 pt-4 border-2 border-p-400 rounded-2xl">
                    <Label label="Alimento" class="text-xl font-semibold mb-1"/>
                    <Input
                        v-model="newItem.food"
                        class="mb-5"
                        placeholder="Buscar"
                        :error="errors.food"
                    />
                    <InputText
                        v-model="newItem.quantity"
                        class="mb-5"
                        label="Quantidade"
                        placeholder="Digite"
                        type="number"
                        :error="errors.quantity"
                        />
                        <InputText
                        v-model="newItem.unit"
                        class="mb-5"
                        label="Unidade"
                        placeholder="Buscar"
                        :error="errors.unit"
                    />
                    <div class="flex flex-row justify-end gap-2">
                        <Button 
                            mediumPurple outlined
                            class="w-max px-0 h-[42px] shadow-lg shadow-p-600/20 transition"
                            label="Limpar"
                            icon="fa-solid fa-delete-left text-p-600 flex justify-center"
                            @click="clearInputs"
                        />
                        <Button 
                            mediumPurple
                            class="w-max px-0 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                            label="Adicionar alimento"
                            icon="fa-solid fa-plus short flex justify-center"
                            @click="addItem"
                        />
                    </div>
                </div>
                <div v-if="hasAnyItems" class="flex flex-col gap-4 mt-4 max-w-full">
                    <template v-for="mealName in mealNames" :key="mealName" class="max-w-full">
                        <div v-if="newMealItems[mealName].length > 0" class="max-w-full">
                            <h3 class="text-p-800 font-bold text-lg mb-2">{{ mealName }}</h3>
                            <div class="flex flex-col gap-2">
                                <ItemButton
                                    v-for="(item, index) in newMealItems[mealName]"
                                    :key="index"
                                    :label="item.food"
                                    :quantity="item.quantity"
                                    :unity="item.unit"
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
                    />
                </div>
            </div>
            <div class="flex flex-col w-[60%] mb-8 rounded-3xl shadow-lg gap-3 bg-white p-6 pb-8">
                <div class="flex gap-3 items-center">
                    <h2 class="h2">Consumo</h2>
                    <div class="flex justify-center align-items border-2 px-2 py-1 bg-p-100 transition 
                        border-p-400 rounded-xl h3main hover:bg-p-200 cursor-pointer active:scale-95 select-none">
                        {{ selectedDay }}
                    </div>
                    <div class="flex justify-center align-items border-2 px-2 py-1 bg-p-100 transition 
                        border-p-400 rounded-xl h3main hover:bg-p-200 cursor-pointer active:scale-95 select-none">
                        {{ selectedPeriod }}
                    </div>
                </div>
                <div class="flex-row flex justify-between px-4 pt-3">
                    <div class="flex flex-col w-max mr-[8%]">
                        <div v-for="meal in meals" class="mt-3">
                            <h3 class="text-p-900 font-bold">{{ meal.name.toUpperCase() }}</h3>
                            <p v-for="item in meal.items" class="text-nowrap">{{ item.food }} ({{ item.quantity + ' ' + item.unit }})</p>
                        </div>
                    </div>
                    <div class="border-l border-gray-300 h-full"></div>
                    <div class="flex flex-col items-center w-full ml-[4%] mb-2">
                        <h3 class="h3">
                            Total consumido:
                            <span class="font-bold text-3xl text-p-600 mx-1">{{ totalConsumed }}</span>
                            / {{ dailyCalorieGoal }} kcal ({{ Math.round(totalConsumed / dailyCalorieGoal * 100) }}%)
                        </h3>
                        <div class="flex flex-col items-start w-[90%] mt-4 cursor-default">
                            <p v-for="i in 5" :class="classes[i-1]">{{ nutriente(i-1) }}
                            <span class="font-bold text-lg mx-1">{{ totalNutriente(i-1).toFixed(1) }} g</span></p>
                        </div>
                        <div class="flex items-center justify-center w-full h-full">
                            <NutrientsChart
                            class="overflow-visible"
                                :chart-data="chartData"
                                :chart-options="chartOptions"
                            />
                        </div>
                        <div class="w-full flex justify-center mt-5">
                            <Button
                                mediumPurple
                                class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                                label="Gerar PDF"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

const class0 = 'border-l-[25px] border-2 rounded-md pl-1 mb-1 border-p-900';
const class1 = 'border-l-[25px] border-2 rounded-md pl-1 mb-1 border-p-700';
const class2 = 'border-l-[25px] border-2 rounded-md pl-1 mb-1 border-p-500';
const class3 = 'border-l-[25px] border-2 rounded-md pl-1 mb-1 border-p-300';
const class4 = 'border-l-[25px] border-2 rounded-md pl-1 mb-1 border-p-100 ring-1 ring-p-400';

const dailyCalorieGoal = ref(2000);
const currentDate = ref(new Date().toLocaleDateString('pt-BR'));
const selectedPeriod = ref('diário');
const selectedDay = ref('04/09');
const selectedMeal = ref(null);

const meals = ref([
  { name: 'Café da manhã', items: [
      { food: 'Café', quantity: 1, unit: 'xícara', calories: 2, nutrients: [0.1, 0.3, 0, 0, 0] },
      { food: 'Pão integral', quantity: 2, unit: 'fatias', calories: 130, nutrients: [21, 5.5, 1.6, 2.7, 2.2] },
      { food: 'Margarina', quantity: 20, unit: 'g', calories: 72, nutrients: [0.1, 0.1, 8.1, 0, 0.1] },
      { food: 'Queijo branco', quantity: 30, unit: 'g', calories: 80, nutrients: [0.8, 5.4, 6.2, 0, 0.8] },
  ] },
  { name: 'Almoço', items: [
      { food: 'Arroz integral', quantity: 150, unit: 'g', calories: 180, nutrients: [36, 3.8, 1.4, 2.7, 0.1] },
      { food: 'Feijão preto', quantity: 100, unit: 'g', calories: 130, nutrients: [23.7, 8.5, 0.5, 8.8, 0.3] },
      { food: 'Peito de frango grelhado', quantity: 120, unit: 'g', calories: 200, nutrients: [0, 37, 4.3, 0, 0] },
      { food: 'Salada de alface e tomate', quantity: 80, unit: 'g', calories: 20, nutrients: [3.9, 1.2, 0.3, 1.8, 2.5] },
  ] },
  { name: 'Lanche', items: [
      { food: 'Maçã', quantity: 1, unit: 'unidade', calories: 80, nutrients: [21, 0.4, 0.3, 3.6, 15] },
      { food: 'Castanhas', quantity: 30, unit: 'g', calories: 185, nutrients: [4, 4.3, 18, 2.2, 1.3] },
      { food: 'Iogurte natural', quantity: 200, unit: 'g', calories: 120, nutrients: [9, 7, 6, 0, 9] },
      { food: 'Granola', quantity: 50, unit: 'g', calories: 220, nutrients: [32, 5, 8, 5, 12] },
      { food: 'Mel', quantity: 20, unit: 'g', calories: 64, nutrients: [17, 0.1, 0, 0, 17] },
  ] },
  { name: 'Jantar', items: [
      { food: 'Sopa de legumes', quantity: 300, unit: 'g', calories: 150, nutrients: [20, 5, 5, 6, 8] },
      { food: 'Pão integral', quantity: 50, unit: 'g', calories: 130, nutrients: [21, 5.5, 1.6, 2.7, 2.2] },
  ] },
]);

const mealNames = ['Café da manhã', 'Almoço', 'Lanche', 'Janta'];

const newMealItems = reactive({
  'Café da manhã': [],
  'Almoço': [],
  'Lanche': [],
  'Janta': []
});

const newItem = reactive({
  food: '',
  quantity: '',
  unit: ''
});

const errors = reactive({
  food: null,
  quantity: null,
  unit: null,
  meal: null
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
      padding: 10 
  },
  plugins: {
      layout: {
          autoPadding: false,
          padding: 100
      },
      legend: {
          display: false,
          position: 'bottom',
          useBorderRadius: true,  
          borderRadius: 20
      },
      tooltip: {
          callbacks: {
              label: function(context) {
                  const value = context.raw;
                  const total = context.chart.getDatasetMeta(0).total;
                  const percentage = (value / total) * 100;
                  let label = `${percentage.toFixed(1)}%`;
                  return value.toFixed(1)+' g';
              }
          }
      }
  }
};

const classes = ref([class0, class1, class2, class3, class4]);

function totalNutriente(num) {
  let total = 0;
  for (const meal of meals.value) { 
      for (const item of meal.items) {
          total += item.nutrients[num];
      }
  }
  return total;
}

function nutriente(num) {
  switch (num) {
      case 0: return 'Carboidratos: ';
      case 1: return 'Proteínas: ';
      case 2: return 'Gorduras: ';
      case 3: return 'Fibras: ';
      case 4: return 'Açúcares: ';
  }
}

function allNutrientes() {
  let total = 0;
  for (let i = 0; i < 5; i++) {
      total += totalNutriente(i); 
  };
  return total
}

function porcentagemNutriente(num) {
  const value = totalNutriente(num); 
  const total = allNutrientes(); 
  const percentage = (value / total) * 100;
  let label = `${percentage.toFixed(1)}%`;
  return label;
}

const totalConsumed = computed(() => {
  let total = 0; 
  for (const meal of meals.value) { 
      for (const item of meal.items) {
          total += item.calories; 
      }
  }
  return total;
});

const chartData = computed(() => {
  return {
      labels: [
          `Carboidratos (${porcentagemNutriente(0)})`, 
          `Proteínas (${porcentagemNutriente(1)})`, 
          `Gorduras (${porcentagemNutriente(2)})`, 
          `Fibras (${porcentagemNutriente(3)})`, 
          `Açúcares (${porcentagemNutriente(4)})`, 
      ],
      datasets: [
          {
              backgroundColor: ['#553280', '#7a48b9', '#9b78da', '#cec2f0 ', '#f0edfa'],
              data: [
                  totalNutriente(0), 
                  totalNutriente(1),
                  totalNutriente(2),
                  totalNutriente(3),
                  totalNutriente(4)
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
  const allMeals = Object.values(newMealItems); 
  return allMeals.some(itemList => itemList.length > 0);
});

function selectMeal(meal) {
  selectedMeal.value = meal; 
}

function addItem() {
  errors.food = null;
  errors.quantity = null;
  errors.unit = null;
  errors.meal = null;

  if (!selectedMeal.value) { 
      errors.meal = 'Selecione uma refeição';
      return;
  }

  let isValid = true;
  if (!newItem.food) { 
      errors.food = 'Campo obrigatório';
      isValid = false;
  }
  if (!newItem.quantity) { 
      errors.quantity = 'Campo obrigatório';
      isValid = false;
  }
  if (!newItem.unit) { 
      errors.unit = 'Campo obrigatório';
      isValid = false;
  }

  if (!isValid) {
      return;
  }
  
  newMealItems[selectedMeal.value].push({ ...newItem });
  clearInputs(); 
}

function deleteItem(mealName, itemIndex) {
  newMealItems[mealName].splice(itemIndex, 1); 
}

function clearInputs() {
  newItem.food = '';
  newItem.quantity = '';
  newItem.unit = '';
  errors.food = null;
  errors.quantity = null;
  errors.unit = null;
  errors.meal = null;
}
</script>