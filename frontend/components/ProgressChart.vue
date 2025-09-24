<template>
  <Line 
    :data="chartData" 
    :options="chartOptions" 
/>
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, annotationPlugin);

export default {
  name: 'ProgressChart',
  components: { Line },
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