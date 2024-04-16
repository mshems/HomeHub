<script setup>
// eslint-disable-next-line
import { Chart as ChartJS, Title, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { getCssVar, colors } from 'quasar'
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

import { formatBalance } from 'src/balance'

const props = defineProps({
  title: String,
  displayPercentage: {
    type: Boolean,
    default: false
  },
  displayBalance: {
    type: Boolean,
    default: false
  },
  datasets: {
    type: Array,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  }
})

const total = computed(() => props.datasets.reduce((acc, d) => acc + d.value, 0))

const options = ref({
  reponsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  },
  elements: {
    bar: {
      borderRadius: 3,
      borderSkipped: 'middle'
    }
  },
  indexAxis: 'y',
  scales: {
    x: {
      max: 100,
      stacked: true,
      display: false
    },
    y: {
      stacked: true,
      display: false
    }
  },
  plugins: {
    legend: {
      display: false
    },
    datalabels: {
      anchor: 'center',
      align: 'center',
      font: {
        weight: 'bold',
        anchor: 'center'
      },
      display: (context) => {
        const data = context.chart.data
        const { datasetIndex } = context
        return data.datasets[datasetIndex].data[0] > 10
      },
      formatter: (value, context) => {
        const data = context.chart.data
        const { datasetIndex } = context
        const item = data.datasets[datasetIndex]
        if (props.displayPercentage) {
          return `${value.toFixed(1)}%`
        } else if (props.displayBalance) {
          return formatBalance(Math.abs(item.count))
        } else {
          return item.count
        }
      }
    }
  },
  ...props.chartOptions
})

const datasets = computed(() => props.datasets.map(d => (
  {
    label: d.label,
    data: [d.value / total.value * 100.0],
    count: d.value,
    backgroundColor: colors.getPaletteColor(d.color),
    hoverBackgroundColor: colors.lighten(colors.getPaletteColor(d.color), 25),
    datalabels: {
      font: {
        size: 12,
        weight: 'bold',
        family: 'Noto Sans'
      },
      color: getCssVar('text-on-color')
    }
  }
)))
const data = computed(() => {
  return {
    stack: 'bar',
    labels: [props.title],
    barThickness: 32,
    datasets: datasets.value || []
  }
})

ChartJS.register(Title, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)
</script>

<template>
  <Bar
    :height="48"
    :options="options"
    :data="data"
    style="max-height: 48px !important;"
  />
</template>
