<template>
  <aside ref="menuRef" :class="['sticky z-[550] relative', isMobile ? 'ml-0 mr-0 w-full' : 'ml-4 mr-6']" :style="{ top: `${stickyTop}px` }">
    <transition name="slide-fade" mode="out-in">
      <!-- PROFILECARD EXPANDIDO -->
      <div v-if="isOpen" key="expanded">
        <div class="w-fit flex flex-col items-center p-5 bg-gradient-to-br from-p-500 via-p-600 to-p-700 rounded-xl h-fit drop-shadow-xl">
          <div
            @click="handleProfileClick"
            class="bg-white flex flex-col items-center mb-3 p-5 rounded-xl transition drop-shadow-xl group cursor-pointer active:bg-p-100"
          >
            <div class="flex items-center justify-center rounded-full transition ease-in-out group-hover:-translate-y-1 group-active:scale-95">
              <img
                v-if="profilePicture"
                :src="profilePicture"
                alt="Foto de perfil"
                class="rounded-full object-cover mb-3 mt-1
                       size-[100px] lg:size-[120px] xl:size-[140px]"
              />
              <svg
                v-else
                class="mb-3 mt-1 text-p-600 block drop-shadow-np w-[clamp(100px,120px,140px)] h-[clamp(100px,120px,140px)]"
                viewBox="36.5 20 165 165"
                fill="currentColor"
                aria-hidden="true"
              >
                <g id="Profile_blank" data-name="Profile blank">
                  <path
                    d="M65.3246 140.859C66.8926 143.004 69.9071 143.297 72.106 141.805C78.1062 137.736 84.6625 134.431 91.775 131.891C100.437 128.797 109.512 127.25 119 127.25C128.487 127.25 137.562 128.797 146.225 131.891C153.337 134.431 159.894 137.736 165.894 141.805C168.093 143.297 171.107 143.004 172.675 140.859C176.102 136.172 178.87 131.016 180.978 125.394C183.659 118.244 185 110.612 185 102.5C185 84.2125 178.572 68.6406 165.716 55.7844C152.859 42.9281 137.287 36.5 119 36.5C100.712 36.5 85.1406 42.9281 72.2844 55.7844C59.4281 68.6406 53 84.2125 53 102.5C53 110.612 54.3406 118.244 57.0219 125.394C59.1304 131.016 61.898 136.172 65.3246 140.859ZM119 110.75C110.887 110.75 104.047 107.966 98.4781 102.397C92.9094 96.8281 90.125 89.9875 90.125 81.875C90.125 73.7625 92.9094 66.9219 98.4781 61.3531C104.047 55.7844 110.887 53 119 53C127.112 53 133.953 55.7844 139.522 61.3531C145.091 66.9219 147.875 73.7625 147.875 81.875C147.875 89.9875 145.091 96.8281 139.522 102.397C133.953 107.966 127.112 110.75 119 110.75ZM119 185C107.587 185 96.8625 182.834 86.825 178.503C76.7875 174.172 68.0562 168.294 60.6312 160.869C53.2062 153.444 47.3281 144.712 42.9969 134.675C38.6656 124.637 36.5 113.912 36.5 102.5C36.5 91.0875 38.6656 80.3625 42.9969 70.325C47.3281 60.2875 53.2062 51.5562 60.6312 44.1312C68.0562 36.7062 76.7875 30.8281 86.825 26.4969C96.8625 22.1656 107.587 20 119 20C130.412 20 141.137 22.1656 151.175 26.4969C161.212 30.8281 169.944 36.7062 177.369 44.1312C184.794 51.5562 190.672 60.2875 195.003 70.325C199.334 80.3625 201.5 91.0875 201.5 102.5C201.5 113.912 199.334 124.637 195.003 134.675C190.672 144.712 184.794 153.444 177.369 160.869C169.944 168.294 161.212 174.172 151.175 178.503C141.137 182.834 130.412 185 119 185Z"
                  />
                </g>
              </svg>
            </div>
            <p
              class="text-p-950 text-wrap max-w-[9em] font-sora font-semibold text-[clamp(1rem,2.4vw,1.25rem)] text-center transition ease-in-out group-hover:scale-[112%] group-active:scale-105"
            >
              {{ user.name }}
            </p>
            <p v-if="user?.role === 'PROFESSIONAL'" class="text-p-600 group-hover:translate-y-1 tracking-[1.2px] text-[clamp(0.55rem,1.2vw,0.7rem)] font-semibold mb-1 transition">
              PROFISSIONAL
            </p>
            <p class="text-p-950 font-sora font-light text-[clamp(0.8rem,1.8vw,1rem)] transition ease-in-out group-hover:translate-y-1 group-active:scale-95">
              {{ user.email }}
            </p>
          </div>
          <ListItem
            :items="items"
            :active-item="selectedItem"
            @item-selected="handleItemSelection"
            class="mb-6"
          />
          <div
            class="flex justify-start items-center gap-2 w-full hover:bg-white/10 font-sora cursor-pointer text-white select-none transition px-[clamp(0.6rem,2.2vw,1rem)] py-2 rounded-lg active:scale-95 group hover:text-danger-light"
            @click="logout"
          >
            <i
              class="fa-solid fa-right-from-bracket text-[clamp(0.9rem,2.8vw,1.2rem)] font-semibold hover:scale-110 active:scale-95 transition cursor-pointer"
              title="Sair"
            />
            <p
              class="group-hover:translate-x-2 transition ease-in-out duration-200 text-[clamp(0.85rem,2vw,1rem)]"
            >
              Sair
            </p>
          </div>
        </div>
      </div>

      <!-- PROFILECARD MINIMIZADO -->
      <div v-else key="minimized">
        <div
          class="w-full max-w-[94vw] mx-auto 
                flex flex-row items-center justify-between whitespace-nowrap
                px-[clamp(2vw,3vw,4vw)] py-[clamp(1.6vw,2.4vw,3vw)]
                bg-gradient-to-br from-p-500 via-p-600 to-p-700 
                rounded-2xl drop-shadow-xl 
                gap-[clamp(0.4rem, 2vw, 1rem)]
                overflow-x-auto overflow-y-hidden no-scrollbar"
        >
          <div
            @click="handleProfileClick"
            class="cursor-pointer bg-white flex items-center justify-center 
                  p-[clamp(0.6rem,1.6vw,1.2rem)] rounded-xl 
                  transition drop-shadow-xl hover:scale-110 active:scale-95"
          >
            <img
              v-if="profilePicture"
              :src="profilePicture"
              alt="Foto de perfil"
              class="rounded-full object-cover
                    w-[clamp(2vw,4vw,6vw)] h-[clamp(2vw,4vw,6vw)]"
            />
            <svg
              v-else
              class="text-p-600 block drop-shadow-np
                    w-[clamp(2vw,4vw,6vw)] h-[clamp(2vw,4vw,6vw)]"
              viewBox="36.5 20 165 165"
              fill="currentColor"
              aria-hidden="true"
            >
              <g id="Profile_blank" data-name="Profile blank">
                <path
                  d="M65.3246 140.859C66.8926 143.004 69.9071 143.297 72.106 141.805C78.1062 137.736 84.6625 134.431 91.775 131.891C100.437 128.797 109.512 127.25 119 127.25C128.487 127.25 137.562 128.797 146.225 131.891C153.337 134.431 159.894 137.736 165.894 141.805C168.093 143.297 171.107 143.004 172.675 140.859C176.102 136.172 178.87 131.016 180.978 125.394C183.659 118.244 185 110.612 185 102.5C185 84.2125 178.572 68.6406 165.716 55.7844C152.859 42.9281 137.287 36.5 119 36.5C100.712 36.5 85.1406 42.9281 72.2844 55.7844C59.4281 68.6406 53 84.2125 53 102.5C53 110.612 54.3406 118.244 57.0219 125.394C59.1304 131.016 61.898 136.172 65.3246 140.859ZM119 110.75C110.887 110.75 104.047 107.966 98.4781 102.397C92.9094 96.8281 90.125 89.9875 90.125 81.875C90.125 73.7625 92.9094 66.9219 98.4781 61.3531C104.047 55.7844 110.887 53 119 53C127.112 53 133.953 55.7844 139.522 61.3531C145.091 66.9219 147.875 73.7625 147.875 81.875C147.875 89.9875 145.091 96.8281 139.522 102.397C133.953 107.966 127.112 110.75 119 110.75ZM119 185C107.587 185 96.8625 182.834 86.825 178.503C76.7875 174.172 68.0562 168.294 60.6312 160.869C53.2062 153.444 47.3281 144.712 42.9969 134.675C38.6656 124.637 36.5 113.912 36.5 102.5C36.5 91.0875 38.6656 80.3625 42.9969 70.325C47.3281 60.2875 53.2062 51.5562 60.6312 44.1312C68.0562 36.7062 76.7875 30.8281 86.825 26.4969C96.8625 22.1656 107.587 20 119 20C130.412 20 141.137 22.1656 151.175 26.4969C161.212 30.8281 169.944 36.7062 177.369 44.1312C184.794 51.5562 190.672 60.2875 195.003 70.325C199.334 80.3625 201.5 91.0875 201.5 102.5C201.5 113.912 199.334 124.637 195.003 134.675C190.672 144.712 184.794 153.444 177.369 160.869C169.944 168.294 161.212 174.172 151.175 178.503C141.137 182.834 130.412 185 119 185Z"
                />
              </g>
            </svg>
          </div>
          <ListItem
            :items="items"
            :active-item="selectedItem"
            :is-minimized="true"
            @item-selected="handleItemSelection"
            class="minimized-icons"
          />
          <i
            class="fa-solid fa-right-from-bracket text-white hover:text-danger-light 
                  text-[clamp(1rem,3.2vw,1.4rem)] font-semibold 
                  hover:scale-[115%] active:scale-95 transition cursor-pointer"
            @click="logout"
            title="Sair"
          />
        </div>
      </div>
    </transition>
  </aside>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import ListItem from "./ListItem.vue";
import { useCookie, useNuxtApp } from "nuxt/app";

const router = useRouter();
const { $axios } = useNuxtApp();

const userCookie = useCookie('user-data');
const user = ref(userCookie.value);

const isOpen = ref(true);
const selectedItem = ref(null);
const profilePicture = ref(null);

const items = computed(() => {
  if (user.value?.role === 'STANDARD') {
    return [
      { icon: "fa-list", label: "Plano Alimentar", route: "/meal-plan" },
      // { icon: "fa-calendar-days", label: "Diário Alimentar", route: "/food-diary" },
      { icon: "fa-bars-progress", label: "Meu Progresso", route: "/my-progress" },
      { icon: "fa-utensils", label: "Receitas", route: "/recipes" },
      { icon: "fa-users", label: "Meus Grupos", route: "/my-groups" },
    ];
  }
  if (user.value?.role === 'PROFESSIONAL') {
    return [
      { icon: "fa-users", label: "Meus pacientes", route: "/professional/patients" },
      { icon: "fa-list", label: "Planos Alimentares", route: "/professional/meal-plans" },
      { icon: "fa-utensils", label: "Receitas", route: "/recipes" },
    ];
  }
});

const isMobile = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth <= 768;

  if (isMobile.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
  }
}

const stickyTop = computed(() => {
  return isMobile.value ? 12 : 12;
});

onMounted(async () => {
  await fetchProfilePicture();
  checkMobile();
  initMenuHeightObserver();
  window.addEventListener("resize", checkMobile);
});

async function fetchProfilePicture() {
    try {
        const response = await $axios.get('user/profile_picture');
        if (response.data && response.data.success && response.data.data) {
            const bufferData = Object.values(response.data.data);
            let binaryString = '';
            const chunkSize = 8192;
            const uint8Array = new Uint8Array(bufferData);
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
                const chunk = uint8Array.subarray(i, i + chunkSize);
                binaryString += String.fromCharCode.apply(null, chunk);
            }
            const base64String = btoa(binaryString);
            profilePicture.value = `data:image/jpeg;base64,${base64String}`;
        }
    } catch (error) {
        console.error("Erro ao buscar a foto de perfil no ProfileCard:", error);
    }
}

const handleItemSelection = (item) => {
  selectedItem.value = item.label;
  navigate(item.route);
};

const handleProfileClick = () => {
  navigate("/profile");
  selectedItem.value = null;
};

const menuRef = ref(null);

function initMenuHeightObserver() {
  const el = menuRef.value;
  if (!el) return;

  const updateHeight = () => {
    const h = el.offsetHeight;
    document.documentElement.style.setProperty('--menu-height', `${h}px`);
  };

  const observer = new ResizeObserver(updateHeight);
  observer.observe(el);
  updateHeight();
} 

const logout = async () => {
  const userCookie = useCookie('user-data');
  const tokenCookie = useCookie('auth-token');
  
  userCookie.value = null;  
  tokenCookie.value = null; 

  console.log("Logout...");
  navigate("/");
};

const navigate = async (route) => {
  await router.push({ path: route, replace: true });
};
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

.minimized-icons {
  display: flex;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center !important;
  gap: clamp(0.4rem, 2vw, 1rem);
  flex-wrap: wrap;
  row-gap: 0.5rem;
}
.minimized-icons i,
.minimized-icons svg {
  font-size: clamp(2.2vw, 4vw, 6vw) !important;
  width: auto;
  height: auto;
  opacity: 1 !important;
  filter: none !important;
}
@media (max-width: 420px) {
  .minimized-icons i,
  .minimized-icons svg {
    font-size: clamp(4vw, 5vw, 6vw) !important;
  }
}
.minimized-icons > * {
  flex: 0 0 auto;
}

.no-scrollbar::-webkit-scrollbar { 
  height: 0; 
}
.no-scrollbar { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

aside.sticky {
  transition: box-shadow 180ms ease, transform 180ms ease;
}
aside.sticky.is-stuck {
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
</style>