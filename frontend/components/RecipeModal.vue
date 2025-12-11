<template>
  <teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      appear
    >
      <div
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        :class="`z-[${zindex}]`"
        @click.self="$emit('close')"
      >
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="scale-90"
          enter-to-class="scale-100"
          leave-active-class="transition-transform duration-300 ease-in"
          leave-from-class="scale-100"
          leave-to-class="scale-90"
          appear
        >
          <Card class="w-full md:w-[40%] relative max-h-[90vh] p-5 pb-[10px] pt-8 z-50 overflow-y-auto">
            <button
              class="absolute top-5 right-7 text-3xl text-gray-500 hover:text-danger hover:scale-110 transition z-50"
              @click="$emit('close')"
              >&times;
            </button>
      
            <RecipeCard :item="recipeForCard" @toggleFavorite="handleToggleFavorite" class="w-full" wdth="100" :bg="false" />
          </Card>
        </Transition>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { get } from '../crud'

const props = defineProps({
  recipe: { type: Object, required: true },
  zindex: { type: String, required: false, default: '1000' },
})

const emit = defineEmits(['close'])

const isFavorite = ref(false)
const favoriteRecipeIds = ref(new Set())

function preparationMethodMapper(preparationMethod) {
  if (!preparationMethod) return []
  const steps = preparationMethod
    .split(';')
    .map(step => step.trim())
    .filter(step => step !== '')
  
  return steps.map((step) => {
    return step.charAt(0).toUpperCase() + step.slice(1)
  })
}

async function loadFavorites() {
  const response = await get('recipe/favorites')
  if (response && response.data) {
    favoriteRecipeIds.value = new Set(response.data.map(fav => fav.id))
    isFavorite.value = favoriteRecipeIds.value.has(props.recipe.id)
  }
}

const recipeForCard = computed(() => ({
  ...props.recipe,
  recipe: props.recipe,
  steps: preparationMethodMapper(props.recipe.preparation_method),
  isFavorite: isFavorite.value
}))

function handleToggleFavorite(recipeId, favorited) {
  isFavorite.value = favorited
  if (favorited) {
    favoriteRecipeIds.value.add(recipeId)
  } else {
    favoriteRecipeIds.value.delete(recipeId)
  }
}

onMounted(() => {
  loadFavorites()
})
</script>