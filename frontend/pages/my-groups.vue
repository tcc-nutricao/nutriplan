<template>
    <div class="flex flex-col w-full gap-3 px-10">
        <div class="flex w-full">
            <h1 class="h1">Meus Grupos</h1>
        </div>
        <div class="flex w-full gap-5">
            <div class="flex flex-col gap-5 w-[30%]">
                <div class="flex flex-col justify-center px-6 pt-5 h-max rounded-3xl shadow-lg gap-3 bg-white pb-6">
                    <Button mediumPurple
                        class="w-min px-3 h-[42px] text-nowrap shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        icon="fa-solid fa-plus short flex justify-center" label="Criar novo grupo" />
                    <div class="flex items-end gap-3 border-t-2 pt-2 mt-2 border-p-200">
                        <InputText class="mb-0 w-full" label="Entrar em um grupo"
                            placeholder="Digite o código do grupo" />
                        <Button mediumPurple
                            class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                            label="Entrar" />
                    </div>
                </div>
                <div class="flex flex-col gap-3 w-full">
                    <GroupButton v-for="item in itemList" :key="item.id" :title="item.title"
                        :daysRemaining="calculateDaysRemaining(item.endDate)" :participants="item.participants.length"
                        :is-selected="item.id === selectedItemId" @selecionado="selectItem(item.id)" />
                </div>
            </div>
            <div v-if="selectedItem" class="flex flex-col gap-5 w-[65%]">
                <div class="flex items-start justify-between p-6 h-max rounded-3xl shadow-lg gap-5 bg-white">

                    <div class="flex gap-5">
                        <img src="../assets/images/groupPhoto.jpg" alt="Foto do grupo"
                            class="w-36 aspect-square object-cover rounded-2xl flex-shrink-0" />
                        <div class="flex flex-col justify-between">
                            <div class="flex flex-col">
                                <h2 class="h2main">{{ selectedItem.title }}
                                </h2>
                                <h2
                                    class="font-semibold text-md text-p-400 cursor-pointer hover:text-p-700 transition active:text-p-500">
                                    <i class="fa-regular fa-copy mr-1 text-p-700"></i>{{ selectedItem.code }}
                                </h2>
                            </div>
                            <p class="text-md font-medium text-gray-400">Criado por: {{ selectedItem.owner }}</p>
                            <div v-if="selectedItem.owner === 'Você'" class="flex gap-3">
                                <Button mediumPurple
                                    class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                                    icon="fa-solid fa-edit short flex justify-center" label="Editar" />
                                <Button red
                                    class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                                    icon="fa-regular fa-trash-can short flex justify-center" label="Apagar" />
                            </div>
                            <div v-else class="flex gap-3">
                                <Button red
                                    class="w-max pr-3 pl-2 h-[42px] shadow-lg border-2 border-danger-light shadow-danger/20 transition"
                                    icon="fa-solid fa-right-from-bracket short flex justify-center" label="Sair" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <h3 class="h3">Participantes:</h3>
                        <div class="flex flex-row gap-5 mt-2">
                            <div v-for="(column, colIndex) in participantColumns" :key="colIndex"
                                class="flex flex-col gap-1">
                                <p v-for="(participant, pIndex) in column" :key="pIndex"
                                    class="font-semibold flex items-center text-lg text-gray-700 cursor-pointer text-nowrap">
                                    <i class="fa-solid fa-circle-user mr-2 text-2xl text-p-700"></i>
                                    {{ participant.name }}
                                    <!-- <i v-if="participant.name === selectedItem.owner" class="fa-solid fa-crown ml-2 mb-1 text-xl text-yellow-400"></i> -->
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="flex flex-col items-center justify-center p-6 pb-10 h-max mb-8 rounded-3xl shadow-lg gap-3 bg-white">
                    <div class="flex">
                        <h2 class="h2">Progresso</h2>
                    </div>
                    <div class="flex flex-col w-full px-10 gap-8">
                        <div>
                            <div class="flex justify-between items-center mb-3 gap-8">
                                <h3 class="text-lg text-center" :class="endingClass(calculateDaysRemaining(selectedItem.endDate))">
                                    {{ calculateDaysRemaining(selectedItem.endDate) }}
                                </h3>
                                <div class="flex gap-8">
                                    <p class="text-md text-gray-600">
                                        Início: <span class="h3main">{{ formattedStartDate }}</span>
                                    </p>
                                    <p class="text-md text-gray-600">
                                        Final: <span class="h3main">{{ formattedEndDate }}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mb-1">
                                <h3 class="h3">Progresso geral</h3>
                                <span class="text-lg font-bold text-p-700">{{ groupProgress }}%</span>
                            </div>
                            <ProgressBar :progress="groupProgress" :height="'6'" />
                        </div>

                        <div>
                            <h3 class="h3 text-center mb-2">Progresso Individual</h3>
                            <div class="flex flex-col gap-3">
                                <div v-for="participant in selectedItem.participants" :key="participant.id">
                                    <div class="flex justify-between items-center mb-0">
                                        <p class=" text-md text-gray-700" :class="participant.name === 'Você' ? 'font-black text-p-600' : ''">{{ participant.name }}</p>
                                        <span class="text-md font-bold text-gray-600">{{ participant.progress }}%</span>
                                    </div>
                                    <p class="font-light text-sm text-gray-600 mb-1">{{ participant.objective }}</p>
                                    <ProgressBar :progress="participant.progress" :type="'2'" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else
                class="stickyProfile bg-white rounded-3xl text-nowrap shadow-lg border-2 p-6 py-20 w-[70%] flex items-center justify-center text-gray-500">
                <h3 class="h2">Crie ou entre em um grupo!</h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedItemId: 1,
            itemList: [
                {
                    id: 1,
                    title: 'Fit com as amigas',
                    code: 'KLM72Q',
                    startDate: '2025-09-01',
                    endDate: '2025-09-30',
                    owner: 'Você',
                    participants: [
                        { id: 101, name: 'Você', progress: 80, objective: 'Perda de Peso' },
                        { id: 102, name: 'Beatriz', progress: 50, objective: 'Hipertrofia' },
                        { id: 103, name: 'Carla', progress: 100, objective: 'Perda de Peso' },
                    ]
                },
                {
                    id: 2,
                    title: 'Desafio Verão 2026',
                    code: 'XPT09A',
                    startDate: '2025-09-15',
                    endDate: '2025-10-13',
                    owner: 'Eduardo',
                    participants: [
                        { id: 201, name: 'Você', progress: 75, objective: 'Perda de Peso' },
                        { id: 202, name: 'Eduardo', progress: 90, objective: 'Hipertrofia' },
                        { id: 203, name: 'Fernanda', progress: 60,  objective: 'Definição' },
                        { id: 204, name: 'Gabriel', progress: 85, objective: 'Ganho de Massa' },
                        { id: 205, name: 'Helena', progress: 100, objective: 'Perda de Peso' },
                        { id: 206, name: 'Igor', progress: 40, objective: 'Hipertrofia' },
                        { id: 207, name: 'Juliana', progress: 70, objective: 'Definição' },
                    ]
                },
                {
                    id: 3,
                    title: 'Vida Saudável',
                    code: 'VWZ21B',
                    startDate: '2025-09-20',
                    endDate: '2025-11-09',
                    owner: 'Igor',
                    participants: [
                        { id: 301, name: 'Você', progress: 25, objective: 'Perda de Peso' },
                        { id: 302, name: 'Helena', progress: 45, objective: 'Ganho de Massa' },
                        { id: 303, name: 'Igor', progress: 60, objective: 'Hipertrofia' },
                        { id: 304, name: 'Juliana', progress: 80, objective: 'Definição' },
                    ]
                },
            ],
        };
    },
    methods: {
        selectItem(id) {
            this.selectedItemId = id;
        },
        calculateDaysRemaining(endDateString) {
            const today = new Date();
            const endDate = new Date(endDateString + 'T00:00:00');

            today.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (endDate < today) {
                return 'Finalizado';
            }

            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return 'Termina hoje';
            }
            if (diffDays === 1) {
                return 'Termina amanhã';
            }
            return `Termina em ${diffDays} dias`;
        },
        endingClass(diffDays) {
            if (diffDays === 'Finalizado' || diffDays === 'Termina hoje' || diffDays === 'Termina amanhã') {
                return 'text-danger-light';
            } else {
                return 'text-p-950';
            }
        },
    },
    computed: {
        selectedItem() {
            if (!this.selectedItemId) {
                return null;
            }
            return this.itemList.find(item => item.id === this.selectedItemId);
        },
        participantColumns() {
            if (!this.selectedItem) return [];

            const participants = this.selectedItem.participants;
            const chunkSize = 3;
            const columns = [];

            for (let i = 0; i < participants.length; i += chunkSize) {
                const chunk = participants.slice(i, i + chunkSize);
                columns.push(chunk);
            }

            return columns;
        },
        formattedStartDate() {
            if (!this.selectedItem) return '';
            const dateString = this.selectedItem.startDate; 
            const parts = dateString.split('-');
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        },
        formattedEndDate() {
            if (!this.selectedItem) return '';
            const dateString = this.selectedItem.endDate; 
            const parts = dateString.split('-');
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        },
        groupProgress() {
            if (!this.selectedItem || this.selectedItem.participants.length === 0) {
                return 0;
            }

            const totalProgress = this.selectedItem.participants.reduce((sum, participant) => {
                return sum + participant.progress;
            }, 0);

            const average = totalProgress / this.selectedItem.participants.length;
            return Math.round(average);
        }

    }
}
</script>