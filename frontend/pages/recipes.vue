<template>
    <div class="px-10 flex flex-col gap-3">
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
                <div listaReceitas class="flex flex-col gap-3 w-full mt-5">
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
                </div>
            </div>

            <div v-if="selectedItem" class="stickyProfile bg-white rounded-3xl shadow-lg border-2 p-6 w-[50%] mb-8">
                <div class="flex w-full justify-between items-center mb-4">
                    <h2 class="h2">{{ selectedItem.title }}</h2>
                    <Button
                        v-if="selectedItem.isFav"
                        red outlined
                        class="w-max px-3 h-[42px] transition"
                        icon="fa-solid fa-heart short flex justify-center text-red-500"
                        label="Favoritado"
                        @click="selectedItem.isFav = !selectedItem.isFav"
                    />
                    <Button
                        v-else
                        mediumPurple
                        class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        icon="fa-regular fa-heart short flex justify-center"
                        label="Favoritar"
                        @click="selectedItem.isFav = !selectedItem.isFav"
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
import { ref, computed } from 'vue';
import { useCookie } from 'nuxt/app';

const userCookie = useCookie('user-data');

const isNutri = computed(() => userCookie.value?.role === 'PROFESSIONAL');

const showModal = ref('');

const openCreate = () => {
  showModal.value = 'create';
};

const openEdit = () => {
  showModal.value = 'edit';
};

const closeModal = () => {
  showModal.value = '';
};

const selectedItemId = ref(null);
const itemList = ref([
    { id: 1, title: 'Muffin de Banana Integral', 
        categories: [
            {icon: 'fa-solid fa-fire text-ic-emagrecer', label: 'Perda de Peso'}, 
            {icon: 'fa-solid fa-moon text-ic-sono', label: 'Sono'},
            {icon: 'fa-solid fa-atom text-ic-antiox', label:'Antioxidante'}
        ], 
        time: '15', portions: '2', isFav: false,
        description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
        ingredients: ['Banana', 'Farinha Integral', 'Mel'],
        steps: ['Amasse a banana com um garfo até formar um purê.',
                'Adicione a farinha integral e o mel ao purê de banana e misture bem até obter uma massa homogênea.',
                'Divida a massa em duas porções e coloque em forminhas de muffin ou ramequins.',
                'Asse em forno pré-aquecido a 180°C por cerca de 15 minutos ou até que um palito inserido no centro saia limpo.',
                'Deixe esfriar um pouco antes de desenformar e servir.'
            ]
    },
    { id: 2, title: 'Salada Detox com Grão de Bico', 
    categories: [
            {icon: 'fa-solid fa-fire text-ic-emagrecer', label: 'Perda de Peso'}, 
            {icon: 'fa-solid fa-bolt text-ic-energia', label: 'Energia'},
            {icon: 'fa-solid fa-seedling text-ic-vegano', label:'Vegano'}
        ], 
    time: '90', portions: '8', isFav: true,
    description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
    ingredients: [  '1 xicara de grão-de- bico cozido', 
                    '1/2 pepino fatiado',
                    '1/2 cenoura ralada',
                    '1/4 de cebola roxa em fatias finas',
                    '1/2 xícara de folhas de rúcula',
                    '1/2 limão (suco)',
                    '1 colher de sopa de azeite de oliva extra virgem',
                    '1 pitada de cúrcuma',
                    'Sal e pimenta-do-reino a gosto',
                    'Sementes de chia ou linhaça (opcional)'], 
    steps: ['Lave bem todos os vegetais (pepino, cenoura, rúcula e cebola).',
            'Em uma tigela grande, misture o grão-de-bico já cozido com a cenoura ralada, O pepino em rodelas e a cebola fatiada.',
            'Acrescente as folhas de rúcula e misture levemente.',
            'Em um potinho à parte, prepare o molho com o suco de limão, o azeite, a cúrcuma, o sal e a pimenta.',
            'Despeje o molho sobre a salada e misture para incorporar os sabores.',
            'Finalize com uma pitada de sementes de chia ou linhaça, se desejar.',
            'Sirva fresca.'
        ]
    },
    { id: 3, title: 'Suco de Uva', 
        categories: [
            {icon: 'fa-solid fa-hands text-ic-vegetariano', label: 'Fácil'}, 
            {icon: 'fa-solid fa-candy-cane text-ic-sugar', label: 'Sem açúcar'},
            {icon: 'fa-solid fa-bolt text-ic-energia', label:'Energia'}
        ],  
        time: '2', portions: '1', isFav: false,
        description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
        ingredients: ['1 cacho de uvas', '1L de água'],
        steps: ['Lave bem a uva e corte em pedacos pequenos.',
                'Bata no liquidificador com um pouco de água.',
                'Sirva gelado.'
            ]
    },
    { id: 4, title: 'Suco de Uva',
    categories: [
            {icon: 'fa-solid fa-hands text-ic-vegetariano', label: 'Fácil'}, 
            {icon: 'fa-solid fa-candy-cane text-ic-sugar', label: 'Sem açúcar'},
            {icon: 'fa-solid fa-bolt text-ic-energia', label:'Energia'}
        ], 
    time: '2', portions: '1', isFav: false,
        description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
        ingredients: ['1 cacho de uvas', '1L de água'],
        steps: ['Lave bem a uva e corte em pedacos pequenos.',
                'Bata no liquidificador com um pouco de água.',
                'Sirva gelado.'
            ]
    },
    { id: 5, title: 'Suco de Uva', 
    categories: [
            {icon: 'fa-solid fa-hands text-ic-vegetariano', label: 'Fácil'}, 
            {icon: 'fa-solid fa-candy-cane text-ic-sugar', label: 'Sem açúcar'},
            {icon: 'fa-solid fa-bolt text-ic-energia', label:'Energia'}
        ],  
    time: '2', portions: '1', isFav: false,
        description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
        ingredients: ['1 cacho de uvas', '1L de água'],
        steps: ['Lave bem a uva e corte em pedacos pequenos.',
                'Bata no liquidificador com um pouco de água.',
                'Sirva gelado.'
            ]
    },
    { id: 6, title: 'Suco de Uva', 
    categories: [
            {icon: 'fa-solid fa-hands text-ic-vegetariano', label: 'Fácil'}, 
            {icon: 'fa-solid fa-candy-cane text-ic-sugar', label: 'Sem açúcar'},
            {icon: 'fa-solid fa-bolt text-ic-energia', label:'Energia'}
        ],  
    time: '2', portions: '1', isFav: false,
        description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
        ingredients: ['1 cacho de uvas', '1L de água'],
        steps: ['Lave bem a uva e corte em pedacos pequenos.',
                'Bata no liquidificador com um pouco de água.',
                'Sirva gelado.'
            ]
    },
]);

function selectItem(id) {
    selectedItemId.value = id;
}

const filterOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'favorites', label: 'Favoritos', icon: 'fa-heart text-ic-colesterol' },
//   { value: 'easy', label: 'Fácil', icon: 'fa-hands text-ic-vegan' },
//   { value: 'sweet', label: 'Doce', icon: 'fa-ice-cream text-ic-sono' },
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