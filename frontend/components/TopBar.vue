<template>
  <div class="sticky top-0 z-50 bg-white shadow-md flex justify-between items-center py-4 pl-6 pr-10">
    <Logo class="text-4xl" />
    <p 
      class="text-p-800 text-lg hover:font-semibold transition cursor-pointer active:scale-95"
      @click="logout"
    >
      Sair
    </p>
  </div>
</template>

<script setup>
import { insert } from '../crud'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = 'auth/logout'

const navigate = async (route) => {
  await router.push(route)
}

const logout = async () => {
  const response = await insert(route)
  if (!response.error) {
    navigate('/')
  }
}
</script>
