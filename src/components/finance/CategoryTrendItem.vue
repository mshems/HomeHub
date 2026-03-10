<script setup lang="ts">
import CategoryIcon from '../ui/icon/CategoryIcon.vue'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item'
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { computed, unref, type Ref } from 'vue'

import SparklineChart from '@/components/charts/SparklineChart.vue'
import { formatBalance } from '@/lib/balance'
import { categoryColors } from '@/lib/icons'
import type { ICategory, ITransaction } from '@/lib/models'
import { balanceTextVariants } from '@/lib/variants'

const props = defineProps<{
  category: ICategory
  activeMonth: Ref<DateTime>
  activeMonthTotal: Ref<number>
  transactions: Ref<ITransaction[]>
  months: number
}>()

const monthlyTotals = computed(() => {
  const end = props.activeMonth.value.startOf('month')
  const totals: number[] = []

  for (let i = props.months - 1; i >= 0; i--) {
    const monthStart = end.minus({ months: i })
    const m = monthStart.month
    const y = monthStart.year
    const total = props.transactions.value
      .filter((t) => {
        const d = DateTime.fromSeconds(t.timestamp)
        return d.month === m && d.year === y
      })
      .reduce((sum, t) => sum + t.amount, 0)
    totals.push(total)
  }

  return totals
})

const averageMonthlyTotal = computed(() => {
  if (monthlyTotals.value.length === 0) return 0
  const sum = monthlyTotals.value.reduce((a, b) => a + b, 0)
  return sum / monthlyTotals.value.length
})

const balanceVariant = () => {
  if (unref(props.activeMonthTotal) > unref(averageMonthlyTotal))
    return balanceTextVariants({ variant: 'credit' })
  return balanceTextVariants({ variant: 'debit' })
}
</script>

<template>
  <Item variant="muted">
    <ItemMedia variant="icon" class="border-none">
      <CategoryIcon :category="category.id" class="mr-2 size-5" />
    </ItemMedia>
    <ItemContent class="flex flex-row">
      <div>
        <ItemTitle class="font-title capitalize">{{ category.name }}</ItemTitle>
        <ItemDescription :class="balanceVariant()">
          <ChevronUp
            v-if="unref(props.activeMonthTotal) > unref(averageMonthlyTotal)"
            class="mb-1 inline size-4"
          />
          <ChevronDown v-else class="mb-1 inline size-4" />
          {{ formatBalance(unref(props.activeMonthTotal), true) }}
        </ItemDescription>
        <ItemDescription>
          <TrendingUp class="mb-1 inline size-4" />
          {{ formatBalance(unref(averageMonthlyTotal), true, 0) }}
        </ItemDescription>
      </div>
      <div class="my-auto ml-auto">
        <SparklineChart
          v-if="monthlyTotals.length > 1"
          :height="48"
          :show-average="true"
          :data="monthlyTotals.map((total) => Math.abs(total))"
          :class="categoryColors[category.id]"
        />
      </div>
    </ItemContent>
  </Item>
</template>
