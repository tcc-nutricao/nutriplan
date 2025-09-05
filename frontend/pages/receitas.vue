<template>
    <div class="px-10 flex flex-col gap-3">
        <h1 class="h1">Receitas</h1>
        <div class="flex flex-row gap-5">
            <div class="flex flex-col w-[50%] mb-8">
                <SearchBar :filter="true" :sort="true" class="stickyProfile w-full shadowSearch" />
                <div listaReceitas class="flex flex-col gap-3 w-full mt-5">
                    <ReceitaButton
                        v-for="item in itemList"
                        :key="item.id"
                        :title="item.title"
                        :categories="item.categories"
                        :time="item.time"
                        :portions="item.portions"
                        :is-selected="item.id === selectedItemId"
                        @selecionado="selectItem(item.id)"
                    />
                </div>
            </div>

            <div v-if="selectedItem" class="stickyProfile bg-white rounded-3xl shadow-lg border-2 p-6 w-[50%] mb-8">
                <h2 class="h2 mb-4">{{ selectedItem.title }}</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                    <span v-for="(category, index) in selectedItem.categories" :key="index" class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                        {{ category }}
                    </span>
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
            </div>
            <div v-else class="stickyProfile bg-white rounded-3xl shadow-lg border-2 p-6 py-20 w-[50%] flex items-center justify-center text-gray-500">
                <p>Selecione uma receita ao lado para ver os detalhes!</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
    return {
        selectedItemId: null, 
        itemList: [
            { id: 1, title: 'Muffin de Banana Integral', categories: ['Perda de Peso', 'Sono', 'Antioxidante'], time: '15', portions: '2', 
                description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
                ingredients: ['Banana', 'Farinha Integral', 'Mel'],
                steps: ['Amasse a banana com um garfo até formar um purê.',
                        'Adicione a farinha integral e o mel ao purê de banana e misture bem até obter uma massa homogênea.',
                        'Divida a massa em duas porções e coloque em forminhas de muffin ou ramequins.',
                        'Asse em forno pré-aquecido a 180°C por cerca de 15 minutos ou até que um palito inserido no centro saia limpo.',
                        'Deixe esfriar um pouco antes de desenformar e servir.'
                    ]
            },
            { id: 2, title: 'Salada Detox com Grão de Bico', categories: ['Energia','Perda de Peso', 'Saúde Intestinal'], time: '90', portions: '8', 
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
            { id: 3, title: 'Suco de Uva', categories: ['Leve', 'Doce', 'Fácil'], time: '2', portions: '1', 
                description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
                ingredients: ['1 cacho de uvas', '1L de água'],
                steps: ['Lave bem a uva e corte em pedacos pequenos.',
                    'Bata no liquidificador com um pouco de água.',
                    'Sirva gelado.'
                ]
            },
            { id: 4, title: 'Suco de Uva', categories: ['Leve', 'Doce', 'Fácil'], time: '2', portions: '1', 
                description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
                ingredients: ['1 cacho de uvas', '1L de água'],
                steps: ['Lave bem a uva e corte em pedacos pequenos.',
                    'Bata no liquidificador com um pouco de água.',
                    'Sirva gelado.'
                ]
            },
            { id: 5, title: 'Suco de Uva', categories: ['Leve', 'Doce', 'Fácil'], time: '2', portions: '1', 
                description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
                ingredients: ['1 cacho de uvas', '1L de água'],
                steps: ['Lave bem a uva e corte em pedacos pequenos.',
                    'Bata no liquidificador com um pouco de água.',
                    'Sirva gelado.'
                ]
            },
            { id: 6, title: 'Suco de Uva', categories: ['Leve', 'Doce', 'Fácil'], time: '2', portions: '1', 
                description: 'Descrição detalhada da receita selecionada. Ingredientes, modo de preparo, dicas e outras informações relevantes para o usuário.', 
                ingredients: ['1 cacho de uvas', '1L de água'],
                steps: ['Lave bem a uva e corte em pedacos pequenos.',
                    'Bata no liquidificador com um pouco de água.',
                    'Sirva gelado.'
                ]
            },
        ]
    };
    },
    methods: {
        selectItem(id) {
            this.selectedItemId = id;
        }
    },
    computed: {
        selectedItem() {
            if (!this.selectedItemId) {
                return null;
            }
            return this.itemList.find(item => item.id === this.selectedItemId);
        }
    }
}
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