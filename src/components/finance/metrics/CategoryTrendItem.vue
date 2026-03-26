<script setup lang="ts">
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { toRef, unref, type Ref } from 'vue'

import SparklineChart from '@/components/charts/SparklineChart.vue'
import CategoryIcon from '@/components/ui/icon/CategoryIcon.vue'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { useMonthlyTotals } from '@/composables/metrics'
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
  inverted?: boolean
}>()

const { totals: monthlyTotals, average: averageMonthlyTotal } = useMonthlyTotals(
  props.transactions,
  props.activeMonth,
  toRef(props, 'months')
)

const balanceVariant = () => {
  if (unref(props.activeMonthTotal) > unref(averageMonthlyTotal))
    return balanceTextVariants({ variant: 'credit' })
  return balanceTextVariants({ variant: 'debit' })
}
</script>

<template>
  <Item variant="muted">
    <ItemMedia variant="icon" class="my-auto border-none">
      <CategoryIcon :category="category.id" class="my-auto mr-2 size-6" />
    </ItemMedia>
    <ItemContent class="flex flex-row">
      <div>
        <ItemTitle class="font-title capitalize">{{ category.name }}</ItemTitle>
        <ItemDescription :class="balanceVariant()">
          <template v-if="!props.inverted">
            <ChevronDown
              v-if="unref(props.activeMonthTotal) > unref(averageMonthlyTotal)"
              class="mb-1 inline size-4"
            />
            <ChevronUp v-else class="mb-1 inline size-4" />
          </template>
          <template v-else>
            <ChevronUp
              v-if="unref(props.activeMonthTotal) > unref(averageMonthlyTotal)"
              class="mb-1 inline size-4"
            />
            <ChevronDown v-else class="mb-1 inline size-4" />
          </template>
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
          :invert-colors="props.inverted"
          :use-gradient="false"
          :height="60"
          :show-average="true"
          :data="monthlyTotals.map((total) => Math.abs(total))"
          :class="categoryColors[category.id]"
        />
      </div>
    </ItemContent>
  </Item>
</template>
