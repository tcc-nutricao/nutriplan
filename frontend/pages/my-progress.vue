<template>
    <div class="flex flex-col gap-3 px-10">
        <h1 class="h1">Meu progresso</h1>
        <div class="flex flex-row gap-5">
            <div class="flex flex-col w-[25%] h-max mb-8 rounded-3xl shadow-lg gap-3 bg-white p-6 pb-8">
                <div v-if="isLoading">
                    <h2 class="text-lg text-gray-500">Carregando...</h2>
                </div>
                <div v-else>
                    <div class="flex flex-row justify-start items-center gap-3 mb-3">
                        <h3 class="h3">Objetivo atual:</h3>
                        <h2 class="h2main">Perda de Peso</h2>
                    </div>
                    <div class="flex flex-row justify-start items-center gap-3 mb-3">
                        <p>Meta de peso: </p>
                        <h3 class="h3">{{this.metaPeso}} kg</h3>
                    </div>
                    <div class="flex flex-row justify-start items-center gap-3 mb-3">
                        <p>Peso inicial: </p>
                        <h3 class="h3">{{pesoInicial }} kg</h3>
                    </div>
                    <div class="flex flex-row justify-start items-center gap-3 mb-3">
                        <p>IMC atual: </p>
                        <h3 class="h3">{{ imcAtual.valor }}  ({{imcAtual.texto }})</h3>
                    </div>
                    <div class="flex flex-row justify-start items-center gap-3 mb-3">
                        <p>Última atualização: </p>
                        <h3 class="h3">{{ ultimaAtualizacaoFormatada }}</h3>
                    </div>
                    <div class="flex flex-row justify-start items-center gap-3 mb-3">
                        <h3  class="h3">Peso atual: </h3>
                        <h2 class="h2main">{{pesoAtual}} kg</h2>
                    </div>
                    <div class="w-full flex gap-1 justify-center mt-5">
                        <Input
                        class="bg-white w-full shadow-lg shadow-gray-600/10 focus-within:shadow-p-600/20 hover:shadow-p-600/20 transition"
                        label="pesquisaReceita"
                        placeholder="Atualize seu peso"
                        />
                        <Button
                            mediumPurple
                            class="w-max px-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                            label="Atualizar"
                        />
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-[50%] h-max mb-8 rounded-3xl shadow-lg gap-3 bg-white p-6 pb-8">
                <div class="flex flex-col justify-start items-center gap-5 mb-3">
                    <h2 class="h2">Progresso</h2>
                    <div class="flex items-center justify-center w-full h-[300px]">
                        <ProgressChart
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
            <div class="flex flex-col max-w-[20%] h-max mb-8 text-center">
                <div class="flex flex-col justify-center items-center mb-3 rounded-3xl shadow-lg gap-1 bg-white p-6 pb-8">
                    <h1 class="h1 mb-0">{{progressoMeta.texto}}</h1>
                    <h3 class="h3">da meta atingida</h3>
                    <ProgressBar :progress="progressoMeta.valor" />
                </div>
                <div class="flex flex-col justify-center items-center mb-3 rounded-3xl shadow-lg gap-1 bg-white p-6 pb-8">
                    <h1 class="h1">{{diasDeProgresso}} dias</h1>
                    <h3 class="h3">de progresso</h3>
                </div>
                <div class="flex flex-col justify-center items-center mb-3 rounded-3xl shadow-lg gap-1 bg-white p-6 pb-8">
                    <h1 v-if="evolucaoPeso.valor" class="h1">{{ evolucaoPeso.valor.replace('.',',') }} kg</h1>
                    <h3 class="h3">{{ evolucaoPeso.texto }}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            historicoDePesos: [],
            isLoading: true,
            metaPeso: 70,
            alturaEmMetros: 1.75
        };
    },
    computed: {
        pesoInicial() {
            return this.historicoDePesos.length > 0 ? this.historicoDePesos[0].peso : null;
        },
        pesoAtual() {
            return this.historicoDePesos.length > 0 ? this.historicoDePesos[this.historicoDePesos.length - 1].peso : null;
        },
        ultimaAtualizacaoFormatada() {
            if (this.historicoDePesos.length === 0) return null;
            const ultimaData = this.historicoDePesos[this.historicoDePesos.length - 1].data;
            return new Date(ultimaData).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
        imcAtual() {
            if (!this.pesoAtual || !this.alturaEmMetros) return { valor: 0, texto: 'dados pendentes' };
            
            const imc = this.pesoAtual / (this.alturaEmMetros * this.alturaEmMetros);
            let classificacao = 'normal';
            if (imc < 18.5) classificacao = 'abaixo do peso';
            else if (imc >= 25 && imc < 30) classificacao = 'sobrepeso';
            else if (imc >= 30) classificacao = 'obesidade';

            return {
                valor: imc.toFixed(1),
                texto: classificacao
            };
        },
        evolucaoPeso() {
            if (!this.historicoDePesos || this.historicoDePesos.length < 2) {
                return {
                    valor: null,
                    texto: 'Registre mais um peso'
                };
            }
            const primeiroPeso = this.historicoDePesos[0].peso;
            const ultimoPeso = this.historicoDePesos[this.historicoDePesos.length - 1].peso;
            const diferenca = primeiroPeso - ultimoPeso;

            if (diferenca > 0) {
                return {
                    valor: diferenca.toFixed(1),
                    texto: 'a menos'
                };
            } else if (diferenca < 0) {
                return {
                    valor: Math.abs(diferenca).toFixed(1),
                    texto: 'a mais'
                };
            } else {
                return {
                    valor: null,
                    texto: 'Peso igual'
                };
            }
        },
        diasDeProgresso() {
            if (!this.historicoDePesos || this.historicoDePesos.length === 0) {
                return 'Nenhum registro';
            }
            const dataInicio = new Date(this.historicoDePesos[0].data);
            const hoje = new Date();
            const diffTempo = Math.abs(hoje - dataInicio);
            const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

            return diffDias;
        },
        progressoMeta() {
            if (!this.historicoDePesos || this.historicoDePesos.length < 2) {
                return { valor: 0, texto: '%' };
            }

            const pesoInicial = this.historicoDePesos[0].peso;
            const pesoAtual = this.historicoDePesos[this.historicoDePesos.length - 1].peso;
            const meta = this.metaPeso;

            if (pesoInicial <= meta) {
                return { valor: 100, texto: '%' };
            }

            const totalAPerder = pesoInicial - meta;
            const jaPerdido = pesoInicial - pesoAtual;

            const porcentagem = (jaPerdido / totalAPerder) * 100;

            const porcentagemFinal = Math.max(0, Math.min(porcentagem, 100));

            return {
                valor: Math.round(porcentagemFinal),
                texto: `${Math.round(porcentagemFinal)}%`
            };
        },
        chartOptions() {
            if (!this.historicoDePesos || this.historicoDePesos.length === 0) {
                return {
                    responsive: true,
                    maintainAspectRatio: false,
                };
            }
            const pesos = this.historicoDePesos.map(registro => registro.peso);
            const minPeso = Math.min(...pesos);
            const maxPeso = Math.max(...pesos);
            const padding = 2;

            return {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        suggestedMin: (minPeso > this.metaPeso ? this.metaPeso - padding : minPeso - padding),
                        suggestedMax: maxPeso + padding,
                    },
                    x: {
                        offset: true,
                        grid: {
                            display: false
                        },
                    }
                },
                plugins: {
                    legend: {     
                        display: false
                    }, 
                    annotation: {
                        annotations: {
                            metaLine: {
                                type: 'line',
                                yMin: this.metaPeso,
                                yMax: this.metaPeso,
                                borderColor: '#9b78da',
                                borderWidth: 2,
                                borderDash: [6, 6],
                            }
                        }
                    }
                },
            };
        },
        chartData() {
            if (!this.historicoDePesos || this.historicoDePesos.length === 0) {
                return {
                    labels: [],
                    datasets: []
                };
            }

            const labels = this.historicoDePesos.map(registro => {
                const data = new Date(registro.data);
                return data.toLocaleDateString('pt-BR', { month: 'long' });
            });
            
            const data = this.historicoDePesos.map(registro => registro.peso);

            return {
                labels: labels,
                datasets: [{
                    label: 'Peso (kg)',
                    borderColor: '#cec2f0',
                    fill: false,
                    data: data,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointBackgroundColor: '#9b78da',
                    pointBorderWidth: 2,
                    pointBorderColor: '#fff',
                    pointHoverRadius: 8,
                    tension: 0.4,
                }],
            }
        },
    },
    methods: {
        buscarHistorico() {
            this.isLoading = true;
            setTimeout(() => {
                this.historicoDePesos = [
                    { data: '2025-07-15', peso: 78 },
                    { data: '2025-08-20', peso: 76 },
                    { data: '2025-09-23', peso: 71.7 },
                ];
                this.isLoading = false; 
            }, 50);
        }
    },
    mounted() {
        this.buscarHistorico();
    }
}
</script>