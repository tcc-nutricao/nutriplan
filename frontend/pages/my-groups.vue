<template>
    <div class="flex flex-col w-full gap-3 px-10">
        <div class="flex w-full">
            <h1 class="h1">Meus Grupos</h1>
        </div>
        <div class="flex w-full gap-5">
            <div class="flex flex-col gap-5 w-[30%]">
                <div class="flex flex-col justify-center px-6 pt-5 h-max rounded-3xl shadow-lg gap-3 bg-white pb-6">
                    <Button 
                        mediumPurple
                        class="w-min px-3 h-[42px] text-nowrap shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                        icon="fa-solid fa-plus short flex justify-center"
                        label="Criar novo grupo"
                    />
                    <div class="flex items-end gap-3 border-t-2 pt-2 mt-2 border-p-200">
                        <InputText
                            class="mb-0 w-full"
                            label="Entrar em um grupo"
                            placeholder="Digite o código do grupo"
                            v-model="object.groupCode"
                        />
                        <Button 
                            mediumPurple
                            class="w-max px-3 h-[42px] shadow-lg border-2 border-p-500 shadow-p-600/20 transition"
                            label="Entrar"
                        />
                    </div>
                </div>
                <GroupButton />
            </div>
            <div class="flex flex-col gap-5 w-[30%]">
                <div class="flex flex-col items-center justify-center p-6 h-max mb-8 rounded-3xl shadow-lg gap-3 bg-white pb-6">
                    <!-- <h3 class="h3">Selecione um grupo</h3> -->
                    <img src="../assets/images/groupPhoto.jpg" alt="Fit com as amigas" class="w-full aspect-square object-cover rounded-2xl mb-3" />
                    <h2 class="h2main">Fit com as amigas</h2>
                </div>  
            </div>
        </div>
    </div>
</template>

<script setup>
const object = ref({
  groupCode: null,
})


</script>