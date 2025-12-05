<template>
<teleport to="body">
<Transition
  name="modal"
  appear
  enter-from-class="opacity-0"
  leave-to-class="opacity-0"
  enter-active-class="transition-opacity duration-300 ease"
  leave-active-class="transition-opacity duration-300 ease"
>
  <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      @click.self="$emit('close')"
    >
    <div class="bg-white px-8 py-7 rounded-3xl shadow-xl max-w-md w-full mx-4 modal-container transition-transform duration-300 ease">
      <h2 class="text-3xl font-bold mb-4 text-p-600">Redefinir senha</h2>
      <p class="mb-4 text-gray-700 text-center text-md">Ao informar seu email cadastrado, uma nova senha será gerada e enviada ao seu e-mail. Confira sua caixa de spam. </p>

      <!-- <h3>Informe seu email:</h3> -->
      <InputText
        label="Digite seu e-mail"
        class="mb-2" 
        v-model="object.email"
        :error="errors.email"
      />

      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
        {{ successMessage }}
      </div>
      <div v-if="generalError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {{ generalError }}
      </div>
      <div v-else class="mb-6"></div>

      <Flex gap-5 v-if="!successMessage">
        <Button outlined gray label="Voltar" @click="close" class="w-full" />
        <Button mediumPurple label="OK" @click="save" class="w-full" :loading="isLoading" />
      </Flex>
    </div>
  </div>
</Transition>
</teleport>
</template>

<script setup>
import { ref } from 'vue'
import { insert } from '../crud.js'

const isLoading = ref(false)
const successMessage = ref(null)
const generalError = ref(null)

const object = ref({
 email: null,
})

const errors = ref({
 email: null,
})

const emits = defineEmits(['close'])

const close = () => {
  emits('close')
}

const validate = () => {
    errors.value.email = null
    generalError.value = null
    successMessage.value = null
    
    if (!object.value.email) {
        errors.value.email = 'E-mail é obrigatório'
        return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(object.value.email)) {
        errors.value.email = 'E-mail inválido'
        return false
    }
    return true
}

const save = async () => {
    if (!validate()) return

    try {
        isLoading.value = true
        const response = await insert('auth/forgot-password', { email: object.value.email })
        
        // Always show success message for security reasons (handled in backend)
        successMessage.value = response.message || 'Se o e-mail estiver cadastrado, você receberá um link.'
        setTimeout(() => {
            close()
        }, 5000)
    } catch (error) {
        generalError.value = 'Ocorreu um erro ao tentar enviar o email.'
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

</script>
