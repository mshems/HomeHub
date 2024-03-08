import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { LocalStorage } from 'quasar'

export const useTxStore = defineStore('tx', () => {
  const descending = ref(LocalStorage.getItem('txDesc'))
  watch(descending, (val, _) => {
    LocalStorage.set('txDesc', val)
  })

  const date = ref(DateTime.local())
  const currentMonth = () => {
    date.value = DateTime.local()
  }
  const prevMonth = () => {
    date.value = date.value.minus({ month: 1 })
  }
  const nextMonth = () => {
    date.value = date.value.plus({ month: 1 })
  }

  const filters = ref({
    name: null,
    category: null,
    categoryType: null,
    userId: null,
    month: null,
    year: null
  })

  const hasFilters = () => {
    return (
      filters.value.category ||
      filters.value.userId ||
      filters.value.month ||
      filters.value.year
    )
  }

  const clearFilters = () => {
    filters.value = {
      category: null,
      userId: null,
      month: null,
      year: null
    }
  }

  return {
    descending,
    date,
    filters,
    hasFilters,
    clearFilters,
    currentMonth,
    prevMonth,
    nextMonth
  }
})
