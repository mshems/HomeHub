import { useFilters } from './filters'
import { useFilteredTransactions } from './transactions'
import { computed, unref, type Ref } from 'vue'

import type { ITransaction } from '@/lib/models'

export const useWNS = (transactions: Ref<ITransaction[]>) => {
  const { transactions: income, total: incomeTotal } = useFilteredTransactions(
    transactions,
    useFilters({
      byCategory: { categories: ['income'] }
    }).filters
  )

  const { transactions: wants, total: wantsTotal } = useFilteredTransactions(
    transactions,
    useFilters({
      byType: { type: 'want' }
    }).filters
  )

  const { transactions: needs, total: needsTotal } = useFilteredTransactions(
    transactions,
    useFilters({
      byType: { type: 'need' }
    }).filters
  )

  const wantsPercentage = computed(() =>
    unref(incomeTotal) ? (-unref(wantsTotal) / unref(incomeTotal)) * 100 : 0
  )
  const needsPercentage = computed(() =>
    unref(incomeTotal) ? (-unref(needsTotal) / unref(incomeTotal)) * 100 : 0
  )
  const savedTotal = computed(() =>
    Math.max(0, unref(incomeTotal) + unref(wantsTotal) + unref(needsTotal))
  )
  const savedPercentage = computed(() =>
    unref(incomeTotal) ? (unref(savedTotal) / unref(incomeTotal)) * 100 : 0
  )

  return {
    needs,
    needsTotal,
    needsPercentage,
    wants,
    wantsTotal,
    wantsPercentage,
    income,
    incomeTotal,
    savedTotal,
    savedPercentage
  }
}
