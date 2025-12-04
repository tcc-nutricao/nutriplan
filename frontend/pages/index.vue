<template>
  <div
    class="font-sora flex items-center justify-center min-h-screen bg-gradient-to-br from-p-500 via-p-600 to-p-700 px-4"
  >
    <div
      class="w-full max-w-[420px] sm:max-w-xl mx-auto p-5 sm:p-8 md:p-[70px] bg-gradient-to-br from-white to-p-200 rounded-tl-[70px] rounded-br-[70px] rounded-bl-xl rounded-tr-xl shadow-custom"
    >
      <Logo class="mb-5 text-5xl sm:text-6xl md:text-7xl mx-auto" />
      <div v-if="isLoading" class="flex items-center justify-center text-p-950 text-lg sm:text-xl md:text-2xl font-semibold">
        <svg class="animate-spin -ml-1 mr-3 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-p-600"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <span class="select-none">Carregando...</span>
      </div>
      <div v-else>
        <p class="text-[#351F56] font-bold text-2xl sm:text-3xl mb-5 select-none">
          Login
        </p>
        <p class="mb-5 text-sm sm:text-base">
          Novo usuário?
          <span
            class="hover:font-semibold cursor-pointer text-[#8A5ACD]"
            @click="navigate('/register')"
          >
            Crie uma conta
          </span>
        </p>
        <InputEmail
          class="mb-5"
          label="Email"
          placeholder="Insira o Email"
          v-model="object.email"
          :error="errors.email"
          @keyup.enter="login"
          required
        />
        <InputPassword
          class="mb-5"
          label="Senha"
          placeholder="Insira a Senha"
          v-model="object.password"
          :error="errors.password"
          @keyup.enter="login"
          required
        />
        <div class="flex flex-col items-center justify-center">
          <Button mediumPurple label="Login" class="w-[60%] sm:w-3/4 md:w-1/2" @click.prevent="login" type="button"/>
          <p v-if="errors.invalidCredentials" class="text-red-500 text-sm font-bold mt-2">
            {{ errors.invalidCredentials }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { insert } from "../crud";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCookie } from "nuxt/app"; // Importe o useCookie

const router = useRouter();

definePageMeta({
  hideTopBar: true,
  hideSideBar: true,
});

const isLoading = ref(true);

const route = ref("auth/login");
const object = ref({
  email: "",
  password: "",
});
const errors = ref({
  email: null,
  password: null,
  invalidCredentials: null,
});

const navigate = async (route) => {
  await router.push(route);
};

const validate = () => {
  errors.value = {
    email: null,
    password: null,
    invalidCredentials: null,
  };
  let isValid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!object.value.email) {
    errors.value.email = "Email é obrigatório";
    isValid = false;
  } else if (!emailRegex.test(object.value.email)) {
    errors.value.email = "Email inválido";
    isValid = false;
  }

  if (!object.value.password) {
    errors.value.password = "Senha é obrigatória";
    isValid = false;
  }

  return isValid;
};

const login = async () => {
  if (!validate()) return;

  try {
    const response = await insert(route.value, object.value);
    
    if (response.error) {
      errors.value.email = " ";
      errors.value.password = " ";
      errors.value.invalidCredentials = "Email ou senha incorretos";
    } else {
      const userCookie = useCookie('user-data'); 
      userCookie.value = response.user;

      const tokenCookie = useCookie('auth-token');
      tokenCookie.value = response.token;

      console.log("Resposta recebida do backend:", response);
      
      navigate(response.nextPage); 
    }
  } catch (e) {
    console.error("Login error:", e);
    errors.value.invalidCredentials = "Erro ao tentar fazer login";
  }
};

onMounted(() => {
  isLoading.value = false;
});
</script>
