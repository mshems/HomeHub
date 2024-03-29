import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { LocalStorage } from 'quasar'

export const useTxStore = defineStore('tx', () => {
  const descending = ref(LocalStorage.getItem('txDesc'))
  watch(descending, (val, _) => {
    LocalStorage.set('txDesc', val)
  })

  const filters = ref({
    name: null,
    category: null,
    categoryType: null,
    userId: null
  })

  const hasFilters = () => {
    return (
      filters.value.category ||
      filters.value.categoryType ||
      filters.value.name ||
      filters.value.userId
    )
  }

  const clearFilters = () => {
    filters.value = {
      category: null,
      name: null,
      categoryType: null,
      userId: null
    }
  }

  return {
    descending,
    filters,
    hasFilters,
    clearFilters
  }
})
