<template>
  <div
    class="font-sora flex items-center justify-center min-h-screen bg-gradient-to-br from-p-500 via-p-600 to-p-700"
  >
    <div
      class="w-full max-w-xl p-[70px] bg-gradient-to-br from-white to-p-200 rounded-tl-[70px] rounded-br-[70px] rounded-bl-xl rounded-tr-xl shadow-custom"
    >
      <Logo class="mb-5 text-7xl" />
      <p class="text-[#351F56] font-sora font-bold text-3xl mb-5 select-none">
        Login
      </p>
      <p class="mb-5">
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
        required
      />
      <InputPassword
        class="mb-5"
        label="Senha"
        placeholder="Insira a Senha"
        v-model="object.password"
        :error="errors.password || errors.invalidCredentials"
        required
      />
      <div class="flex justify-center">
        <Button mediumPurple label="Login" class="w-[50%]" @click="login" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { insert } from "../crud";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCookie } from "nuxt/app"; // Importe o useCookie

const router = useRouter();

definePageMeta({
  hideTopBar: true,
  hideSideBar: true,
});

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

const login = async () => {
  const response = await insert(route.value, object.value);
  errors.value = response.error ? response.data.data : {};
  
  if (!response.error) {
    const userCookie = useCookie('user-data'); 
    userCookie.value = response.user;

    const tokenCookie = useCookie('auth-token');
    tokenCookie.value = response.token;

    // console.log("Resposta recebida do backend:", response);
    
    navigate(response.nextPage); // <-- ANTES: navigate("/register-personal-data")
  }
};
</script>
