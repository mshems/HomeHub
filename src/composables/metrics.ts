import { DateTime } from 'luxon'
import { computed, type Ref } from 'vue'

import type { ITransaction } from '@/lib/models'

export const useMonthlyTotals = (
  transactions: Ref<ITransaction[]>,
  activeMonth: Ref<DateTime>,
  months: number
) => {
  const monthlyTotals = computed(() => {
    const end = activeMonth.value.startOf('month')
    const totals: number[] = []

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = end.minus({ months: i })
      const m = monthStart.month
      const y = monthStart.year
      const total = transactions.value
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
    const total = monthlyTotals.value.reduce((a, b) => a + b, 0)
    return total / months
  })
  return { totals: monthlyTotals, average: averageMonthlyTotal }
}
