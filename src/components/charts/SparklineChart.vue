<script setup lang="ts">
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement } from 'chart.js'
import type { Plugin } from 'chart.js'
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
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
    invertColors?: boolean
    useGradient?: boolean
    formatLabel?: (value: number) => string
  }>(),
  {
    width: 80,
    height: 24,
    strokeWidth: 1.5,
    showLabels: false,
    showAverage: false,
    invertColors: false,
    useGradient: true,
    formatLabel: (v: number) => String(v)
  }
)

const wrapper = useTemplateRef<HTMLDivElement>('wrapper')
const resolvedColor = ref('currentColor')
const redColor = ref('rgb(239, 68, 68)')
const greenColor = ref('rgb(34, 197, 94)')
const mutedColor = ref('rgb(163, 163, 163)')
const averageColor = ref('rgb(202, 138, 4)')

function readThemeColors() {
  if (!wrapper.value) return
  const styles = getComputedStyle(wrapper.value)
  resolvedColor.value = styles.color || resolvedColor.value
  redColor.value = styles.getPropertyValue('--color-negative-typography').trim() || redColor.value
  greenColor.value =
    styles.getPropertyValue('--color-positive-typography').trim() || greenColor.value
  mutedColor.value = styles.getPropertyValue('--color-muted-foreground').trim() || mutedColor.value
  averageColor.value =
    styles.getPropertyValue('--color-warning-foreground').trim() || averageColor.value
}

let themeObserver: MutationObserver | null = null

onMounted(() => {
  readThemeColors()
  themeObserver = new MutationObserver(() => {
    readThemeColors()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onUnmounted(() => {
  themeObserver?.disconnect()
})

const minValue = computed(() => (props.data.length ? Math.min(...props.data) : 0))
const maxValue = computed(() => (props.data.length ? Math.max(...props.data) : 0))
const avgValue = computed(() => {
  if (props.data.length === 0) return 0
  return props.data.reduce((a, b) => a + b, 0) / props.data.length
})

// Plugin that applies a red-to-green gradient based on the average
const gradientPlugin: Plugin<'line'> = {
  id: 'sparklineGradient',
  afterLayout(chart) {
    if (!props.useGradient) return

    const { ctx, chartArea, data } = chart
    if (!chartArea) return

    const mainDataset = data.datasets[0]
    if (!mainDataset?.data?.length) return

    const values = mainDataset.data as number[]
    const min = Math.min(...values)
    const max = Math.max(...values)

    if (max === min) {
      mainDataset.borderColor = mutedColor.value
      return
    }

    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const range = max - min
    const avgStop = Math.max(0, Math.min(1, (max - avg) / range))

    const { top, bottom } = chartArea
    const grad = ctx.createLinearGradient(0, top, 0, bottom)

    // Smooth red → green gradient with a wide blend zone around the average
    const blend = 0.4
    const stopRed = Math.max(0, avgStop - blend)
    const stopGreen = Math.min(1, avgStop + blend)

    const topColor = props.invertColors ? greenColor.value : redColor.value
    const bottomColor = props.invertColors ? redColor.value : greenColor.value

    grad.addColorStop(0, topColor)
    grad.addColorStop(stopRed, topColor)
    grad.addColorStop(avgStop, averageColor.value)
    grad.addColorStop(stopGreen, bottomColor)
    grad.addColorStop(1, bottomColor)

    mainDataset.borderColor = grad
  }
}

const chartData = computed(() => {
  const datasets: any[] = [
    {
      data: props.data,
      borderColor: props.useGradient ? mutedColor.value : resolvedColor.value,
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
      borderColor: props.useGradient ? mutedColor.value : resolvedColor.value,
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

const chartPlugins = [gradientPlugin]
</script>

<template>
  <div ref="wrapper" class="flex items-center gap-1.5">
    <div :style="{ width: `${width}px`, height: `${height}px` }">
      <Line
        :data="chartData"
        :options="chartOptions"
        :plugins="chartPlugins"
        :width="width"
        :height="height"
      />
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
