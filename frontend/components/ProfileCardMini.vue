<template>
  <aside class="w-20 transform transition-transform duration-300 z-50 ml-2 mr-5">
    <div class="flex justify-end">
      <button 
        @click="toggleSidebar" 
        class="absolute z-50 top-3 -right-3 cursor-pointer p-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow transition hover:scale-[115%] active:scale-95"
      >
        <i class="fa-solid fa-chevron-right text-p-600"></i>
      </button>
    </div>
    <div class="w-full flex flex-col items-center p-5 bg-gradient-to-br from-p-500 via-p-600 to-p-700 rounded-xl h-fit drop-shadow-xl"
    >
        <div class="cursor-pointer bg-white flex flex-col items-center mb-3 p-2 rounded-xl transition drop-shadow-xl hover:scale-110 active:scale-95">
            <svg
                class="size-[25px] text-p-600 block drop-shadow-np" 
                viewBox="36.5 20 165 165" 
                fill="currentColor"
                aria-hidden="true"
            >
                <g id="Profile_blank" data-name="Profile blank">
                <path d="M65.3246 140.859C66.8926 143.004 69.9071 143.297 72.106 141.805C78.1062 137.736 84.6625 134.431 91.775 131.891C100.437 128.797 109.512 127.25 119 127.25C128.487 127.25 137.562 128.797 146.225 131.891C153.337 134.431 159.894 137.736 165.894 141.805C168.093 143.297 171.107 143.004 172.675 140.859C176.102 136.172 178.87 131.016 180.978 125.394C183.659 118.244 185 110.612 185 102.5C185 84.2125 178.572 68.6406 165.716 55.7844C152.859 42.9281 137.287 36.5 119 36.5C100.712 36.5 85.1406 42.9281 72.2844 55.7844C59.4281 68.6406 53 84.2125 53 102.5C53 110.612 54.3406 118.244 57.0219 125.394C59.1304 131.016 61.898 136.172 65.3246 140.859ZM119 110.75C110.887 110.75 104.047 107.966 98.4781 102.397C92.9094 96.8281 90.125 89.9875 90.125 81.875C90.125 73.7625 92.9094 66.9219 98.4781 61.3531C104.047 55.7844 110.887 53 119 53C127.112 53 133.953 55.7844 139.522 61.3531C145.091 66.9219 147.875 73.7625 147.875 81.875C147.875 89.9875 145.091 96.8281 139.522 102.397C133.953 107.966 127.112 110.75 119 110.75ZM119 185C107.587 185 96.8625 182.834 86.825 178.503C76.7875 174.172 68.0562 168.294 60.6312 160.869C53.2062 153.444 47.3281 144.712 42.9969 134.675C38.6656 124.637 36.5 113.912 36.5 102.5C36.5 91.0875 38.6656 80.3625 42.9969 70.325C47.3281 60.2875 53.2062 51.5562 60.6312 44.1312C68.0562 36.7062 76.7875 30.8281 86.825 26.4969C96.8625 22.1656 107.587 20 119 20C130.412 20 141.137 22.1656 151.175 26.4969C161.212 30.8281 169.944 36.7062 177.369 44.1312C184.794 51.5562 190.672 60.2875 195.003 70.325C199.334 80.3625 201.5 91.0875 201.5 102.5C201.5 113.912 199.334 124.637 195.003 134.675C190.672 144.712 184.794 153.444 177.369 160.869C169.944 168.294 161.212 174.172 151.175 178.503C141.137 182.834 130.412 185 119 185Z"/>
                </g>
            </svg>
        </div>
        <ListItem :items="items" class="mb-8 mt-3 text-lg text-center"/>
        <i 
            class="fa-solid fa-right-from-bracket ml-1 text-white hover:text-danger-light text-lg font-semibold hover:scale-[115%] active:scale-95 transition cursor-pointer"
            @click="logout"
            title="Sair"
        />
    </div>
  </aside>
</template>


<script setup>
import { insert } from '../crud'
import { ref } from "vue"
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['minimized'])

const isOpen = ref(true)
const route = 'auth/logout'

const items = [
  { icon: 'fa-list', iconLabel: 'Plano Alimentar', route: '/' },
  { icon: 'fa-calendar-days', iconLabel: 'Diário Alimentar', route: '/' },
  { icon: 'fa-bars-progress', iconLabel: 'Meu Progresso', route: '/' },
  { icon: 'fa-utensils', iconLabel: 'Receitas', route: '/receitas' },
  { icon: 'fa-users', iconLabel: 'Meus Grupos', route: '/' }
]

const toggleSidebar = () => {
  emit('minimized', isOpen.value) 
  isOpen.value = !isOpen.value
}

const logout = async () => {
  const response = await insert(route)
  if (!response.error) {
    navigate('/')
  }
}

const navigate = async (route) => {
  await router.push(route)
}
</script>