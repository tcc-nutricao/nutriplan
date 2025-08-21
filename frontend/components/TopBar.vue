<template>
    <div class="p-5 flex justify-between items-center">
        <Logo class="text-4xl" />
        <p class="text-5xl hover:font-semibold cursor-pointer text-p-800 text-lg mb-3" @click="logout">Sair</p>
    </div>
</template>
<script setup>
import { insert } from '../crud'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = ref('auth/logout')

const navigate = async (route) => {
    await router.push(route)
}

const logout = async () => {
    const response = await insert(route.value)
    if(!response.error) {
        navigate('/')
    }
}
</script>
