<template>
   <div class="flex flex-col gap-10 items-center text-center justify-center p-5">
      <h1 class="text-p-600 text-4xl font-bold">Vamos cadastrar seus dados pessoais!</h1>
      <div card class="w-[60%] rounded-3xl shadow-lg py-8 px-10 bg-white flex flex-col justify-center">
         <div class="flex flex-row gap-5 mb-5">
            <div col class="flex flex-col gap-5 w-full">
               <div>
                  <Label class="mb-2" label="Que dia você nasceu?" />
                  <Input placeholder="Data de nascimento" />
               </div>
               <div>
                  <Label class="mb-2" label="Qual é a sua altura? (ex: 170cm)" />
                  <Input placeholder="Sua altura em cm" />
               </div>
               <div>
                  <Label class="mb-2" label="Você tem alguma restrição alimentar?" />
                  <Input placeholder="Selecione" />
               </div>
               <div>
                  <Label class="mb-2" label="Você tem alguma preferência alimentar?" />
                  <Input placeholder="Selecione" />
               </div>
            </div>
            <div col class="flex flex-col gap-5 w-full">
               <div>
                  <Label class="mb-2" label="Qual é o seu sexo?" />
                  <Input placeholder="Selecione" />
               </div>
               <div>
                  <Label class="mb-2" label="Qual é o seu peso?" />
                  <Input placeholder="Seu peso em kg" />
               </div>
               <div>
                  <Label class="mb-2" label="Qual é o seu objetivo?" />
                  <Input placeholder="Selecione" />
               </div>
            </div>
         </div>
         <div class="flex justify-center w-full mt-3">
            <Button mediumPurple label="Confirmar" class="w-[20%]" @click="confirm" />
         </div>
      </div>
   </div>
</template>

<script>
import Input from '~/components/Input.vue';
import Label from '~/components/Label.vue';

definePageMeta({
  hideSideBar: true,
})

</script>