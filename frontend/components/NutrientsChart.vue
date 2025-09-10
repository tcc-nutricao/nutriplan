<template>
  <Doughnut
    :data="chartData"
    :options="chartOptions"
    class="overflow-visible mt-3"
  />
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

export default {
  name: 'NutrientsChart',
  components: { Doughnut },
  props: {
    chartData: {
        type: Object,
        required: true
    },
    chartOptions: {
        type: Object,
        default: () => {},
    }
  }
}
</script>