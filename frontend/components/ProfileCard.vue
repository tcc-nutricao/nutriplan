<template>
  <aside class="sticky top-0 z-50 ml-4 mr-6">
    <transition name="slide-fade" mode="out-in">
      <!-- CARD EXPANDIDO -->
      <div v-if="isOpen" key="expanded">
        <div class="flex justify-end">
          <button
            @click="isOpen = false"
            class="absolute z-50 top-3 -right-3 cursor-pointer p-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow transition hover:scale-[115%] active:scale-95"
          >
            <i class="fa-solid fa-chevron-left text-p-600"></i>
          </button>
        </div>
        <div
          class="w-fit flex flex-col items-center p-5 bg-gradient-to-br from-p-500 via-p-600 to-p-700 rounded-xl h-fit drop-shadow-xl"
        >
          <div
            @click="handleProfileClick"
            class="bg-white flex flex-col items-center mb-3 p-5 rounded-xl transition drop-shadow-xl group cursor-pointer active:bg-p-100"
          >
            <div
              class="flex items-center justify-center rounded-full transition ease-in-out group-hover:-translate-y-1 group-active:scale-95"
            >
              <svg
                class="size-[100px] mb-3 mt-1 text-p-600 block drop-shadow-np"
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
              class="text-p-950 font-sora text-xl text-center font-semibold transition ease-in-out group-hover:scale-[112%] group-active:scale-105"
            >
              Luna
            </p>
            <p
              class="text-p-950 font-sora font-light text-sm transition ease-in-out group-hover:translate-y-1 group-active:scale-95"
            >
              luna@gmail.com
            </p>
          </div>
          <ListItem
            :items="items"
            :active-item="selectedItem"
            @item-selected="handleItemSelection"
            class="mb-6"
          />
          <div
            class="flex justify-start items-center gap-2 w-full hover:bg-white/10 font-sora cursor-pointer text-white select-none transition px-3 py-2 rounded-lg hover:scale-105 active:scale-95 group hover:text-danger-light"
            @click="logout"
          >
            <i
              class="fa-solid fa-right-from-bracket ml-1 text-lg font-semibold hover:scale-110 active:scale-95 transition cursor-pointer"
              title="Sair"
            />
            <p
              class="group-hover:translate-x-2 transition ease-in-out duration-200"
            >
              Sair
            </p>
          </div>
        </div>
      </div>

      <!-- CARD MINIMIZADO -->
      <div v-else key="minimized">
        <div class="flex justify-end">
          <button
            @click="isOpen = true"
            class="absolute z-50 top-3 -right-3 cursor-pointer p-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow transition hover:scale-[115%] active:scale-95"
          >
            <i class="fa-solid fa-chevron-right text-p-600"></i>
          </button>
        </div>
        <div
          class="w-20 flex flex-col items-center p-5 bg-gradient-to-br from-p-500 via-p-600 to-p-700 rounded-xl h-fit drop-shadow-xl"
        >
          <div
            @click="handleProfileClick"
            class="cursor-pointer bg-white flex flex-col items-center mb-3 p-2 rounded-xl transition drop-shadow-xl hover:scale-110 active:scale-95"
          >
            <svg
              class="size-[25px] text-p-600 block drop-shadow-np"
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
            class="mb-8 mt-3 text-lg text-center"
          />
          <i
            class="fa-solid fa-right-from-bracket ml-1 text-white hover:text-danger-light text-lg font-semibold hover:scale-[115%] active:scale-95 transition cursor-pointer"
            @click="logout"
            title="Sair"
          />
        </div>
      </div>
    </transition>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ListItem from "./ListItem.vue";

const router = useRouter();

const isOpen = ref(true);
const selectedItem = ref(null);

const items = [
  { icon: "fa-list", label: "Plano Alimentar", route: "/meal-plan" },
  { icon: "fa-calendar-days", label: "Diário Alimentar", route: "/food-diary" },
  { icon: "fa-bars-progress", label: "Meu Progresso", route: "/my-progress" },
  { icon: "fa-utensils", label: "Receitas", route: "/recipes" },
  { icon: "fa-users", label: "Meus Grupos", route: "/my-groups" },
];

const handleItemSelection = (item) => {
  selectedItem.value = item.label;
  navigate(item.route);
};

const handleProfileClick = () => {
  navigate("/profile");
  selectedItem.value = null;
};

const logout = async () => {
  console.log("Logout...");
  navigate("/");
};

const navigate = async (route) => {
  await router.push(route);
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
</style>
