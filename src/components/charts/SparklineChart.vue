<script setup lang="ts">
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement } from 'chart.js'
import { computed, ref, onMounted, useTemplateRef } from 'vue'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)

const props = withDefaults(
  defineProps<{
    data: number[]
    width?: number
    height?: number
    strokeWidth?: number
    showLabels?: boolean
    showAverage?: boolean
    formatLabel?: (value: number) => string
  }>(),
  {
    width: 100,
    height: 24,
    strokeWidth: 1.5,
    showLabels: false,
    showAverage: false,
    formatLabel: (v: number) => String(v)
  }
)

const wrapper = useTemplateRef<HTMLDivElement>('wrapper')
const resolvedColor = ref('currentColor')

function readColor() {
  if (wrapper.value) {
    resolvedColor.value = getComputedStyle(wrapper.value).color
  }
}

onMounted(readColor)

// Re-read when data changes (parent may also re-render with new color)

const minValue = computed(() => (props.data.length ? Math.min(...props.data) : 0))
const maxValue = computed(() => (props.data.length ? Math.max(...props.data) : 0))
const avgValue = computed(() => {
  if (props.data.length === 0) return 0
  return props.data.reduce((a, b) => a + b, 0) / props.data.length
})

const chartData = computed(() => {
  const datasets: any[] = [
    {
      data: props.data,
      borderColor: resolvedColor.value,
      borderWidth: props.strokeWidth,
      pointRadius: 0,
      pointHitRadius: 0,
      tension: 0.3,
      fill: false
    }
  ]

  if (props.showAverage && props.data.length > 0) {
    datasets.push({
      data: props.data.map(() => avgValue.value),
      borderColor: resolvedColor.value,
      borderWidth: 1,
      borderDash: [4, 3],
      pointRadius: 0,
      pointHitRadius: 0,
      tension: 0,
      fill: false
    })
  }

  return {
    labels: props.data.map((_, i) => String(i)),
    datasets
  }
})

const chartOptions = computed(() => ({
  responsive: false,
  maintainAspectRatio: false,
  animation: false as const,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    x: { display: false },
    y: { display: false }
  },
  layout: {
    padding: 0
  }
}))
</script>

<template>
  <div ref="wrapper" class="flex items-center gap-1.5">
    <div :style="{ width: `${width}px`, height: `${height}px` }">
      <Line :data="chartData" :options="chartOptions" :width="width" :height="height" />
    </div>
    <div
      v-if="showLabels && data.length > 0"
      class="text-muted-foreground flex flex-col justify-between text-xs leading-tight"
      :style="{ height: `${height}px` }"
    >
      <span>{{ formatLabel(maxValue) }}</span>
      <span>{{ formatLabel(minValue) }}</span>
    </div>
  </div>
</template>
