<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import { DateTime } from 'luxon'
import { computed, useTemplateRef } from 'vue'
import { Bar } from 'vue-chartjs'

import { useThemeColors } from '@/composables/themeColors'
import { useWNS } from '@/composables/wns'
import { formatBalance } from '@/lib/balance'
import type { ITransaction } from '@/lib/models'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip)

const props = defineProps<{
  transactions: any[]
  months: number
}>()

const wrapper = useTemplateRef<HTMLDivElement>('wrapper')
const { positiveColor, negativeColor, warningColor, mutedColor } = useThemeColors(wrapper)

const now = DateTime.now()
const monthlyWNS = computed(() =>
  Array.from({ length: props.months }, (_, i) => {
    const monthStart = now.startOf('month').minus({ months: props.months - 1 - i })
    const m = monthStart.month
    const y = monthStart.year
    const label = monthStart.toFormat('MMM yy')

    const monthTx = computed(() =>
      (props.transactions as ITransaction[]).filter((tx) => {
        const d = DateTime.fromSeconds(tx.timestamp)
        return d.month === m && d.year === y
      })
    )

    return { label, ...useWNS(monthTx) }
  })
)

// Average income across all complete (non-current) months that had income
const avgIncome = computed(() => {
  const completedMonths = monthlyWNS.value.slice(0, -1).filter((m) => m.incomeTotal.value > 0)
  if (!completedMonths.length) return 0
  return completedMonths.reduce((sum, m) => sum + m.incomeTotal.value, 0) / completedMonths.length
})

const monthlyData = computed(() => {
  const result = {
    labels: monthlyWNS.value.map((m) => m.label),
    needsPct: [] as number[],
    wantsPct: [] as number[],
    savedPct: [] as number[],
    needsAmt: [] as number[],
    wantsAmt: [] as number[],
    savedAmt: [] as number[]
  }

  monthlyWNS.value.forEach((m, i) => {
    const isCurrentMonth = i === monthlyWNS.value.length - 1
    const divisor =
      isCurrentMonth && m.incomeTotal.value === 0
        ? avgIncome.value
        : isCurrentMonth && avgIncome.value > 0
          ? avgIncome.value
          : m.incomeTotal.value

    if (divisor === 0) {
      result.needsPct.push(0)
      result.wantsPct.push(0)
      result.savedPct.push(0)
    } else if (isCurrentMonth) {
      result.needsPct.push((-m.needsTotal.value / divisor) * 100)
      result.wantsPct.push((-m.wantsTotal.value / divisor) * 100)
      result.savedPct.push(Math.max(0, m.savedTotal.value / divisor) * 100)
    } else {
      result.needsPct.push(m.needsPercentage.value)
      result.wantsPct.push(m.wantsPercentage.value)
      result.savedPct.push(m.savedPercentage.value)
    }

    result.needsAmt.push(-m.needsTotal.value)
    result.wantsAmt.push(-m.wantsTotal.value)
    result.savedAmt.push(m.savedTotal.value)
  })

  return result
})

const chartData = computed<any>(() => ({
  labels: monthlyData.value.labels,
  datasets: [
    {
      label: 'Needs',
      data: monthlyData.value.needsPct,
      amountData: monthlyData.value.needsAmt,
      backgroundColor: warningColor.value,
      hoverBackgroundColor: warningColor.value,
      stack: 'wns',
      type: 'bar' as const,
      borderRadius: 2
    },
    {
      label: 'Wants',
      data: monthlyData.value.wantsPct,
      amountData: monthlyData.value.wantsAmt,
      backgroundColor: negativeColor.value,
      hoverBackgroundColor: negativeColor.value,
      stack: 'wns',
      type: 'bar' as const,
      borderRadius: 2
    },
    {
      label: 'Saved',
      data: monthlyData.value.savedPct,
      amountData: monthlyData.value.savedAmt,
      backgroundColor: positiveColor.value,
      hoverBackgroundColor: positiveColor.value,
      stack: 'wns',
      type: 'bar' as const,
      borderRadius: 2
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        title: (items: any[]) => (items.length ? items[0].label : ''),
        label: (ctx: any) => {
          const amt: number = ctx.dataset.amountData?.[ctx.dataIndex] ?? 0
          return `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%  (${formatBalance(amt, true, 0)})`
        }
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { color: mutedColor.value, font: { size: 10 } }
    },
    y: {
      stacked: true,
      grid: { color: mutedColor.value + '40' },
      ticks: { display: false }
    }
  }
}))
</script>

<template>
  <div ref="wrapper" class="w-full space-y-1">
    <p class="text-muted-foreground text-xs font-medium tracking-wide">
      <span class="text-warning-foreground">Needs</span>
      <span class="text-muted-foreground"> | </span>
      <span class="text-negative-foreground">Wants</span>
      <span class="text-muted-foreground"> | </span>
      <span class="text-positive-foreground">Saved</span>
    </p>
    <div style="height: 200px">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
