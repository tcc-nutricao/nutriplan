<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-white px-7 py-6 rounded-2xl shadow-xl max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">{{ title ? title : '' }}</h2>
      <p class="mb-8 text-p-700 text-center text-xl">{{ content }}</p>

      <!-- <h3>Informe seu CRN:</h3> -->
      <InputText
        label="Informe seu CRN"
        class="mb-12" 
        v-model="object.crn"
        :error="errors.crn"
        prefix="CRN-"
        required
      />

      <Flex gap-5>
        <Button outlined gray label="Voltar" @click="cancel" class="w-full" />
        <Button mediumPurple label="OK" @click="save" class="w-full" />
      </Flex>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    title: String,
    content: String
})

const object = ref({
  crn: null,
})
const errors = ref({
  crn: null,
})

const emits = defineEmits(['closeModal','cancelModal'])

const crnRegex = /^(1[0-2]|[1-9])\/\d{4,7}(\/P)?$/

const validate = () => {
    errors.value.crn = null 
    
    const crnValue = object.value.crn

    if (!crnValue) {
        errors.value.crn = "Este campo é obrigatório."
        return false
    }

    if (!crnRegex.test(crnValue)) {
        errors.value.crn = "Formato de CRN inválido. Ex: CRN-3/12345"
        return false
    }

    return true

}

const save = () => {
    if (validate()) {
            emits('closeModal')
            emits('update:crn', object.value.crn)
    } else {
        console.log("Formulário inválido.")
    }
}

const cancel = () => {
    emits('cancelModal')
}
</script>

