import { computed, unref } from 'vue'
import { DateTime } from 'luxon'
import { useArrayFilter, useArrayReduce } from '@vueuse/core'

import { useCategories } from './composables/categories'

const credits = (transactions) => {
  return useArrayFilter(transactions, t => t.amount >= 0)
}

const debits = (transactions) => {
  return useArrayFilter(transactions, t => t.amount <= 0)
}

const byType = (transactions, type) => {
  if (!unref(type)) return transactions
  if (unref(type) === 'credit') return credits(transactions)
  return debits(transactions)
}

const byCategoryType = (transactions, categoryType) => {
  if (!unref(categoryType)) return transactions
  const { categories } = useCategories(transactions)
  return useArrayFilter(transactions, t => unref(categories)[t.category].type === unref(categoryType))
}

const byCategory = (transactions, category) => {
  if (!unref(category)) return transactions
  return useArrayFilter(transactions, t => t.category === unref(category))
}

const byMonth = (transactions, month, year) => {
  if (!unref(month) || !unref(year)) return transactions
  return useArrayFilter(transactions, t => {
    const dt = DateTime.fromSeconds(t.timestamp)
    return (dt.month === unref(month)) && (dt.year === unref(year))
  })
}

const byYear = (transactions, year) => {
  if (!unref(year)) return transactions
  return useArrayFilter(transactions, t => {
    const dt = DateTime.fromSeconds(t.timestamp)
    return (dt.year === unref(year))
  })
}

const afterDate = (transactions, dateTime) => {
  if (!unref(dateTime)) return transactions
  return useArrayFilter(transactions, t => {
    const dt = DateTime.fromSeconds(t.timestamp)
    return dt >= unref(dateTime)
  })
}

const beforeDate = (transactions, dateTime) => {
  if (!unref(dateTime)) return transactions
  return useArrayFilter(transactions, t => {
    const dt = DateTime.fromSeconds(t.timestamp)
    return dt <= unref(dateTime)
  })
}

const byUser = (transactions, userId) => {
  if (!unref(userId)) return transactions
  return useArrayFilter(transactions, (t) => t.paid_by === unref(userId))
}

const byName = (transactions, name) => {
  if (!unref(name)) return transactions
  return useArrayFilter(transactions, t => t.name.toLowerCase().startsWith(unref(name.toLowerCase())))
}

const total = (transactions) => {
  return useArrayReduce(unref(transactions), (acc, t) => acc + t.amount, 0).value
}

const filter = (transactions, { userId, category, categoryType, month, year, type, before, after, name }) => {
  return computed(
    () => byName(
      byYear(
        byMonth(
          byUser(
            byCategory(
              byCategoryType(
                byType(
                  beforeDate(
                    afterDate(
                      unref(transactions),
                      after),
                    before),
                  type),
                categoryType),
              category),
            userId),
          month, year),
        year),
      name
    )
  )
}

const useFilters = (transactions, filters = {}) => {
  const filteredTransactions = computed(() => {
    return filter(transactions, filters).value
  })
  const txTotal = computed(() => total(filteredTransactions.value))
  return { tx: filteredTransactions, total: txTotal }
}

export {
  filter,
  total,
  useFilters
}
