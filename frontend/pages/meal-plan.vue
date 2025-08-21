<template>
    <TopBar />
    <div class="flex flex-1">
        <ProfileCard />
        <MealPlanCard title="Meu plano" :mealPlan="object" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { search } from '../crud'

const object = ref({})
const actualPlan = ref({})
const otherPlans = ref({})

const loadItems = async () => {
    const query = {
        params: {
            filters: []
        }
    }
    await search('meal-plan', query)
}

onMounted(async () => {
    const result = await loadItems()
    object.value = result.data
})

</script>
