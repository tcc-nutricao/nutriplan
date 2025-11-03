<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-white px-7 py-6 rounded-2xl shadow-xl max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">{{ title ? title : '' }}</h2>
      <p class="mb-8 text-p-700 text-center text-xl">{{ content }}</p>

      <!-- <h3>Informe seu CRN:</h3> -->
      <InputText
        label="Informe seu CRN"
        class="mb-5" 
        v-model="object.crn"
        :error="errors.crn"
        :disabled="object.isStudent"
        prefix="CRN-"
      />

      <Checkbox 
        label="Sou estudante" 
        class="mb-12" 
        v-model="object.isStudent"
      />

      <Flex gap-5>
        <Button outlined gray label="Voltar" @click="cancel" class="w-full" />
        <Button mediumPurple label="OK" @click="save" class="w-full" />
      </Flex>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: String,
  content: String
})

const object = ref({
 crn: null,
 isStudent: false
})
const errors = ref({
 crn: null,
})

const emits = defineEmits(['closeModal','cancelModal'])

const crnRegex = /^(1[0-2]|[1-9])\/\d{4,7}(\/P)?$/

const validate = () => {
  errors.value.crn = null 
  
  const crnValue = object.value.crn

  if (!crnValue && !object.value.isStudent) {
    errors.value.crn = "Preencha se não for estudante."
    return false
  }

  if (crnValue && !crnRegex.test(crnValue) && !object.value.isStudent) { // Adicionado 'crnValue &&'
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

watch(() => object.value.crn, (newValue) => {
  if (newValue && errors.value.crn) {
    errors.value.crn = null
  }
})

watch(() => object.value.isStudent, (isStudent) => {
  if (isStudent) {
    if (errors.value.crn) {
      errors.value.crn = null
    }
  }
})

</script>

