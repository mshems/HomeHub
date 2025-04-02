<script setup lang="ts">
import CategoryIcon from '../ui/icon/CategoryIcon.vue'
import FilterButton from './FilterButton.vue'
import { computed, type Ref } from 'vue'

import { useFilters } from '@/composables/filters'
import { useFilteredTransactions } from '@/composables/transactions'
import type { ICategory, ITransaction } from '@/lib/models'

const props = defineProps<{
  category: ICategory
  transactions: Ref<ITransaction[]>
  active: boolean
}>()

const { transactions: categoryTx } = useFilteredTransactions(
  props.transactions,
  useFilters({
    byCategory: { categories: [props.category.id] }
  }).filters
)
</script>

<template>
  <FilterButton :value="category.id" :transactions="computed(() => categoryTx)" :active="active">
    <CategoryIcon :category="category.id" noColor class="mr-2 size-5" />
  </FilterButton>
</template>
