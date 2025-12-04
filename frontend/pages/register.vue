<template>
  <div class="font-sora flex items-center justify-center min-h-screen w-full overflow-y-auto bg-gradient-to-br from-p-500 via-p-600 to-p-700 px-4 py-10">
    <div class="w-full max-w-lg bg-gradient-to-br from-white to-p-200 rounded-tl-[60px] rounded-br-[60px] rounded-bl-xl rounded-tr-xl shadow-custom p-6 sm:p-8 md:p-10 my-auto">
      <Logo class="mb-6 text-4xl sm:text-5xl md:text-6xl mx-auto" />
      <div v-if="isLoading" class="flex items-center justify-center text-p-950 text-lg sm:text-xl font-semibold">
        <svg class="animate-spin -ml-1 mr-3 h-6 w-6 sm:h-8 sm:w-8 text-p-600"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <span class="select-none">Carregando...</span>
      </div>
      <div v-else>
        <p class="text-p-950 font-bold text-2xl sm:text-3xl mb-4">
          Cadastre-se
        </p>
        <p class="mb-6 text-sm sm:text-base leading-relaxed">
          Já tem conta?
          <span
            class="hover:font-semibold cursor-pointer text-[#8A5ACD]"
            @click="$router.push('/')">
            Faça login aqui.
          </span>
        </p>
        <InputText
          class="mb-5"
          label="Nome"
          placeholder="Insira o Nome"
          v-model="object.name"
          :error="errors.name"
          required />
        <InputEmail
          class="mb-5"
          label="Email"
          placeholder="Insira o Email"
          v-model="object.email"
          :error="errors.email || errors.emailInUse"
          required />
        <InputPassword
          class="mb-8"
          label="Senha"
          placeholder="Insira a Senha"
          v-model="object.password"
          :error="errors.password" />
        <OptionsButton
          outlined
          :error="errors.role"
          v-model="selectedButton"
          :buttons="buttons"
          v-model:changeSelected="changeSelected"
          class="mb-8" />
        <Flex justifyCenter>
          <Button mediumPurple label="Criar conta" class="w-4/5 sm:w-2/3 md:w-1/2" @click="save" :loading="isRegistering" />
        </Flex>
      </div>
    </div>
  </div>
  <ModalCRN :content="modalContent" v-if="openModal" @closeModal="openModal = false" @cancelModal="openModal = false; changeSelected = true" @updateCrn="object.crn = $event" />
</template>

<script setup>
import { insert } from '../crud'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  hideTopBar: true,
  hideSideBar: true
})

const router = useRouter()

const isLoading = ref(true);

const route = ref('user')
const object = ref({
  name: null,
  email: null,
  password: null,
  role: null,
  crn: null
})
const errors = ref({
  name: null,
  email: null,
  password: null,
  role: null,
  emailInUse: null
})
const buttons = ref([
  { label: 'Padrão'},
  { label: 'Profissional' }
])
const openModal = ref(false)
const selectedButton = ref(null)
const changeSelected = ref(false)
const modalContent = ref('O perfil profissional é destinado apenas a nutricionistas e profissionais da saúde.')

const isRegistering = ref(false)

const navigate = async (route) => {
  await router.push(route)
}

const save = async () => {
  isRegistering.value = true
  const response = await insert(route.value, object.value)
  isRegistering.value = false
  
  if (response.error) {
    if (response.data && response.data.field) {
       errors.value = { [response.data.field]: response.data.message }
    } else if (response.data && response.data.data) {
       errors.value = response.data.data
    } else {
       // Fallback for generic errors
       errors.value = { email: response.data?.message || 'Erro ao criar conta' }
    }
  } else {
    errors.value = {}
    navigate('/')
  }
}

watch(
  selectedButton,
  (newValue) => {
    if (newValue) {
      object.value.role = newValue.label
      errors.value.role = null // Clear error on selection
      if (newValue.label === 'Profissional') {
        openModal.value = true
      }
    }
  }
)

onMounted(() => {
  isLoading.value = false
});

</script>


