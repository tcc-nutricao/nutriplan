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

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
      padding: 10 
  },
  plugins: {
      layout: {
          autoPadding: false,
          padding: 100
      },
      legend: {
          display: false,
          position: 'bottom',
          useBorderRadius: true,  
          borderRadius: 20
      },
      tooltip: {
          callbacks: {
              label: function(context) {
                  const value = context.raw;
                  const total = context.chart.getDatasetMeta(0).total;
                  const percentage = (value / total) * 100;
                  let label = `${percentage.toFixed(1)}%`;
                  return value.toFixed(1)+' g';
              }
          }
      }
  }
};

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
        default: () => {
            return baseOptions;
        },
    }
  }
}
</script>