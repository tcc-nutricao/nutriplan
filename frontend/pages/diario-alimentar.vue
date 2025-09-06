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
                <InputText
                    class="mb-5"
                    label="Refeição"
                    placeholder="Selecione"
                />
                <div class="flex flex-col px-4 pb-3 pt-4 border-2 border-p-400 rounded-2xl">
                    <InputText
                        class="mb-5"
                        label="Alimento"
                        placeholder="Buscar"
                    />
                    <InputText
                        class="mb-5"
                        label="Quantidade"
                        placeholder="Digite"
                    />
                    <InputText
                        class="mb-5"
                        label="Unidade"
                        placeholder="Buscar"
                    />
                    <div class="flex flex-row justify-end gap-2">
                        <Button 
                            mediumPurple outlined
                            class="w-max px-0 h-[42px] shadow-lg shadow-p-600/20 transition"
                            icon="fa-solid fa-delete-left w-2 text-p-600 flex justify-center"
                        />
                        <Button 
                            mediumPurple
                            class="w-max px-0 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                            icon="fa-solid fa-plus short w-2 flex justify-center"
                        />
                    </div>
                </div>
                <div class="flex flex-row">

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
                        <div class="flex flex-col items-end w-[35%] mt-2">
                            <p v-for="i in 5">{{ nutriente(i-1) }}
                            <span class="font-bold text-lg mx-1">{{ totalNutriente(i-1).toFixed() }}g</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dailyCalorieGoal: 2000,
                currentDate: new Date().toLocaleDateString('pt-BR'),
                selectedPeriod: 'diário',
                selectedDay: '04/09',
                meals: [
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
                    { name: 'Lanche da tarde', items: [
                        { food: 'Iogurte natural', quantity: 200, unit: 'g', calories: 120, nutrients: [9, 7, 6, 0, 9] },
                        { food: 'Granola', quantity: 50, unit: 'g', calories: 220, nutrients: [32, 5, 8, 5, 12] },
                        { food: 'Mel', quantity: 20, unit: 'g', calories: 64, nutrients: [17, 0.1, 0, 0, 17] },
                    ] },
                    { name: 'Lanche', items: [
                        { food: 'Maçã', quantity: 1, unit: 'unidade', calories: 80, nutrients: [21, 0.4, 0.3, 3.6, 15] },
                        { food: 'Castanhas', quantity: 30, unit: 'g', calories: 185, nutrients: [4, 4.3, 18, 2.2, 1.3] },
                    ] },
                    { name: 'Jantar', items: [
                        { food: 'Sopa de legumes', quantity: 300, unit: 'g', calories: 150, nutrients: [20, 5, 5, 6, 8] },
                        { food: 'Pão integral', quantity: 50, unit: 'g', calories: 130, nutrients: [21, 5.5, 1.6, 2.7, 2.2] },
                    ] },
                ]
            }
        },
        computed: {
            totalConsumed() {
                let total = 0; 
                for (const meal of this.meals) {
                    for (const item of meal.items) {
                        total += item.calories; 
                    }
                }
                return total;
            }
        },
        methods: {
            totalNutriente(num) {
                let total = 0;
                for (const meal of this.meals) {
                    for (const item of meal.items) {
                        total += item.nutrients[num];
                    }
                }
                return total;
            },
            nutriente(num) {
                switch (num) {
                    case 0: return 'Carboidratos: ';
                    case 1: return 'Proteínas: ';
                    case 2: return 'Gorduras: ';
                    case 3: return 'Fibras: ';
                    case 4: return 'Açúcares: ';
                }
            }
        }
    }
</script>