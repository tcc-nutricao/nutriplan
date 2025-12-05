<template>
  <div
    class="font-sora flex items-center justify-center min-h-screen bg-gradient-to-br from-p-500 via-p-600 to-p-700 px-4"
  >
    <div
      class="w-full max-w-[420px] sm:max-w-xl mx-auto p-5 sm:p-8 md:p-[70px] md:py-[40px] bg-gradient-to-br from-white to-p-200 rounded-tl-[70px] rounded-br-[70px] rounded-bl-xl rounded-tr-xl shadow-custom"
    >
      <Logo class="mb-5 text-5xl sm:text-6xl md:text-7xl mx-auto" />
      
      <div>
        <p class="text-[#351F56] font-bold text-2xl sm:text-3xl mb-5 select-none text-center">
          Redefinir Senha
        </p>
        <p class="mb-5 text-sm sm:text-base text-center">
          Crie uma nova senha para sua conta.
        </p>

        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-semibold text-center">
          {{ successMessage }}
        </div>
        <div v-if="generalError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold text-center">
          {{ generalError }}
        </div>

        <InputPassword
          class="mb-5"
          label="Nova Senha"
          placeholder="Insira a nova senha"
          v-model="object.password"
          :error="errors.password"
        />
        
        <InputPassword
          class="mb-5"
          label="Confirmar Senha"
          placeholder="Confirme a nova senha"
          v-model="object.confirmPassword"
          :error="errors.confirmPassword"
        />

        <div class="flex flex-col items-center justify-center mt-6">
          <Button mediumPurple label="Redefinir" class="w-[60%] sm:w-3/4 md:w-1/2" @click.prevent="resetPassword" :loading="isLoading" />
          
          <p 
            class="hover:font-semibold cursor-pointer text-[#8A5ACD] mt-4"
             @click="router.push('/')"
          >
            Voltar para Login
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { insert } from '../crud';

definePageMeta({
  hideTopBar: true,
  hideSideBar: true,
});

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const successMessage = ref(null);
const generalError = ref(null);

const object = ref({
  password: '',
  confirmPassword: ''
});

const errors = ref({
  password: null,
  confirmPassword: null
});

const validate = () => {
    errors.value = { password: null, confirmPassword: null };
    generalError.value = null;
    successMessage.value = null;
    let isValid = true;

    if (!object.value.password || object.value.password.length < 6) {
        errors.value.password = 'A senha deve ter pelo menos 6 caracteres';
        isValid = false;
    }

    if (object.value.password !== object.value.confirmPassword) {
        errors.value.confirmPassword = 'As senhas não coincidem';
        isValid = false;
    }

    return isValid;
};

const resetPassword = async () => {
    const token = route.query.token;

    if (!token) {
        generalError.value = 'Token inválido ou ausente.';
        return;
    }

    if (!validate()) return;

    try {
        isLoading.value = true;
        const response = await insert('auth/reset-password', {
            token,
            newPassword: object.value.password
        });

        if (response.error) {
            generalError.value = response.data?.message || 'Erro ao redefinir senha.';
        } else {
            successMessage.value = 'Senha redefinida com sucesso! Redirecionando...';
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    } catch (error) {
        generalError.value = 'Ocorreu um erro inesperado.';
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
</script>
