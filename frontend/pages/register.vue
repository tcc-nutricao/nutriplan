<template>
    <div class="font-sora flex items-center justify-center min-h-screen bg-gradient-to-br from-p-500 via-p-600 to-p-700">
        <div class="w-full max-w-xl p-[70px] bg-gradient-to-br from-white to-p-200 rounded-tl-[70px] rounded-br-[70px] rounded-bl-xl rounded-tr-xl shadow-custom">
            <Logo class="mb-5" />
            <p class="text-[#351F56] font-sora font-bold text-3xl mb-5 select-none">Cadastre-se</p>
            <p class="mb-5">Já tem conta? 
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
              class="mb-5"
              label="Senha"
              placeholder="Insira a Senha"
              v-model="object.password"
              :error="errors.password"
              required />
            <OptionsButton outlined :error="errors.role"  v-model="selectedButton" :buttons="buttons" class="mb-5" />
            <Flex justifyCenter>
              <Button mediumPurple label="Criar conta" class="w-[50%]" @click="save" />
            </Flex>
        </div>
        <Modal :content="modalContent" v-if="openModal" @closeModal="openModal = false" />
    </div>
</template>

<script setup>
import { insert } from '../crud'
import { ref, watch } from 'vue'

const router = useRoute()

const route = ref('user')
const object = ref({
  name: null,
  email: null,
  password: null,
  role: null
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
const modalContent = ref('O perfil profissional é destinado apenas a nutricionistas e profissionais da saúde.')

const navigate = (route) => {
  router.push(route)
}

const save = async () => {
  const response = await insert(route.value, object.value)
  errors.value = response.error ? response.data.data : {}
  
  if (!response.error) {
    router.back()
  }
}

watch(
  selectedButton,
  (newValue) => {
    if (newValue) {
      object.value.role = newValue.label
      if (newValue.label === 'Profissional') {
        openModal.value = true
      }
    }
  }
)

</script>


