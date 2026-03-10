<script setup lang="ts">
import CategoryTrendItem from './CategoryTrendItem.vue'
import { ref, unref } from 'vue'
import { computed } from 'vue'

import { ItemGroup } from '@/components/ui/item'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCategoriesList } from '@/composables/categories'
import { useDateProps } from '@/composables/dateProps'
import { useFilters } from '@/composables/filters'
import { getTransactionsList, useFilteredTransactions } from '@/composables/transactions'
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
        <TabsTrigger value="cstone" @click="() => (selectedUser = 'cstone')"> Colleen </TabsTrigger>
        <TabsTrigger value="mshems" @click="() => (selectedUser = 'mshems')"> Matt </TabsTrigger>
        <TabsTrigger value="all" @click="() => (selectedUser = 'all')"> Total </TabsTrigger>
      </TabsList>
    </Tabs>
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
        />
      </template>
    </ItemGroup>
  </div>
</template>
