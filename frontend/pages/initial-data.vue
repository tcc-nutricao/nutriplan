<template>
  <div class="flex flex-col gap-10 items-center text-center justify-center p-5">
    <h1 class="text-p-600 text-4xl font-bold">Vamos cadastrar seus dados pessoais!</h1>
    <div card class="w-[60%] rounded-3xl shadow-lg py-8 px-10 bg-white flex flex-col justify-center">
      <div class="flex flex-row gap-5 mb-5">
        <div col class="flex flex-col gap-5 w-full">
          <div v-for="(input, index) in firstColumn" :key="index">
            <Label class="mb-2" :label="input.label" />
            <Input :placeholder="input.placeholder" />
          </div>
        </div>

        <div col class="flex flex-col gap-5 w-full">
          <div v-for="(input, index) in secondColumn" :key="index">
            <Label class="mb-2" :label="input.label" />
            <Input :placeholder="input.placeholder" />
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
definePageMeta({
  hideSideBar: true,
})

const inputValues = [
   { label: 'Que dia você nasceu?', placeholder: 'Data de nascimento' },
   { label: 'Qual é a sua altura? (ex: 170cm)', placeholder: 'Sua altura em cm' },
   { label: 'Você tem alguma restrição alimentar?', placeholder: 'Selecione' },
   { label: 'Você tem alguma preferência alimentar?', placeholder: 'Selecione' },
   { label: 'Qual é seu sexo?', placeholder: 'Seu peso em kg' },
   { label: 'Qual é seu objetivo?', placeholder: 'Selecione' }
]

const firstColumn = inputValues.slice(0, Math.ceil(inputValues.length / 2))
const secondColumn = inputValues.slice(Math.ceil(inputValues.length / 2))

</script>