<template>
  <div class="flex flex-col md:flex-row gap-5 w-full p-5">
    <ProfileCard />
    <div class="grid grid-cols-1 md:grid-cols-5 gap-5 w-full items-stretch">
      <MealPlanCard title="Meu plano" :items="actualPlan" />
      <MealPlanCard class="md:col-span-4" title="Outros planos" :items="otherPlans" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { search } from '../crud'

const actualPlan = ref([])
const otherPlans = ref([])
const limit = ref(null)
const page = ref(1)
const order = ref('asc')

const loadItems = async () => {
  const query = {
    params: {
      filters: [],
      limit: limit.value,
      page: page.value,
      order: order.value
    }
  }
  const result = await search('meal-plan', query)
  actualPlan.value = result.data.filter(item => item.status === 'ACTIVE')
  otherPlans.value = result.data.filter(item => item.status !== 'ACTIVE')
}

onMounted(async () => {
  await loadItems()
})
</script>
