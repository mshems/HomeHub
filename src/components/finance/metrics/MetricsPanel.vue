<script setup lang="ts">
import BalanceMiniCard from '../BalanceMiniCard.vue'
import CategoryTrendItem from './CategoryTrendItem.vue'
import { ref, unref } from 'vue'
import { computed } from 'vue'

import { ItemGroup } from '@/components/ui/item'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCategoriesList } from '@/composables/categories'
import { useDateProps } from '@/composables/dateProps'
import { useFilters } from '@/composables/filters'
import { getTransactionsList, useFilteredTransactions } from '@/composables/transactions'
import { useWNS } from '@/composables/wns'
import type { ICategory } from '@/lib/models'

const props = defineProps<{
  m: number
  y: number
  windowSize?: number
}>()

const selectedUser = ref<string | undefined>('all')

const { data: categories } = getCategoriesList()
const { month, year, date } = useDateProps(props)

const windowSize = computed(() => props.windowSize ?? 18)
const { transactions: inWindowTx } = useFilteredTransactions(
  getTransactionsList(),
  useFilters({
    byUser: { user_id: computed(() => selectedUser.value || 'all') },
    byDateRange: {
      start: computed(() => date.value.startOf('month').minus({ months: unref(windowSize) })),
      end: computed(() => date.value.endOf('month'))
    }
  }).filters
)

const { transactions: monthTransactions } = useFilteredTransactions(
  inWindowTx,
  useFilters({
    byMonth: { month, year }
  }).filters
)

const { wantsTotal, wantsPercentage, needsTotal, needsPercentage, savedTotal, savedPercentage } =
  useWNS(monthTransactions)

const inWindowTxByCategory = (category: ICategory) =>
  useFilteredTransactions(
    inWindowTx,
    useFilters({
      byCategory: { categories: [category.id] }
    }).filters
  ).transactions

const activeMonthTotal = (category: ICategory) => {
  const { total } = useFilteredTransactions(
    monthTransactions,
    useFilters({
      byCategory: { categories: [category.id] }
    }).filters
  )
  return total
}
</script>

<template>
  <div class="space-y-3">
    <Tabs :model-value="selectedUser" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="all" @click="() => (selectedUser = 'all')"> Total </TabsTrigger>
        <TabsTrigger value="cstone" @click="() => (selectedUser = 'cstone')"> Colleen </TabsTrigger>
        <TabsTrigger value="mshems" @click="() => (selectedUser = 'mshems')"> Matt </TabsTrigger>
      </TabsList>
    </Tabs>
    <div class="flex flex-row flex-wrap gap-3">
      <BalanceMiniCard :balance="needsTotal">
        Needs
        <template #append> ({{ needsPercentage.toFixed(2) }}%) </template>
      </BalanceMiniCard>

      <BalanceMiniCard :balance="wantsTotal">
        Wants
        <template #append> ({{ wantsPercentage.toFixed(2) }}%) </template>
      </BalanceMiniCard>

      <BalanceMiniCard show-negative :balance="savedTotal">
        Saved
        <template #append> ({{ savedPercentage.toFixed(2) }}%) </template>
      </BalanceMiniCard>
    </div>
    <!-- {{ formatBalance(unref(needsTotal), true) }} needs ({{ needsPercentage.toFixed(2) }}) /
    {{ formatBalance(unref(wantsTotal), true) }} wants ({{ wantsPercentage.toFixed(2) }}) /
    {{ formatBalance(unref(savesRemaining), true) }} saves ({{
      savesRemainingPercentage.toFixed(2)
    }}) -->
    <ItemGroup class="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <template
        v-for="category in categories.filter((category) => category.id != 'transfer')"
        :key="category.id"
      >
        <CategoryTrendItem
          :category="category"
          :transactions="inWindowTxByCategory(category)"
          :months="windowSize"
          :active-month="computed(() => date)"
          :active-month-total="activeMonthTotal(category)"
          :inverted="category.id === 'income'"
        />
      </template>
    </ItemGroup>
  </div>
</template>
