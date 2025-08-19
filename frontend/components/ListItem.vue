<template>
  <ul class="flex flex-col gap-3">
    <li
      v-for="(item, index) in items"
      :key="index"
      @click="selectItem(item)"
      class="font-sora cursor-pointer text-white transition-all duration-200 ease-in-out px-2 py-1 rounded"
      :class="{
        'bg-white/20': item.label === selectedItem,
        'hover:bg-white/10': item.label !== selectedItem
      }"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  items: Array
})

const selectedItem = ref(null)

const selectItem = (item) => {
  selectedItem.value = item.label
  navigate(item.route)
}

const navigate = async (route) => {
  await router.push(route)
}
</script>
