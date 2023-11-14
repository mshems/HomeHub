import { computed } from 'vue'
import { useRtdb } from './rtdb'
import { useTransactions } from './transactions'

const { categories: dbCategories } = useRtdb()
const { total, byCategory } = useTransactions()

const useCategories = (txRef) => {
  const categories = computed(() => {
    return Object.fromEntries(
      Object.keys(dbCategories.value || {}).map(c => [
        c,
        {
          ...dbCategories.value[c],
          name: c,
          ...(txRef && txRef.value) ? { total: total(byCategory(txRef, c)) } : {}
        }
      ])
    )
  })
  return { categories }
}

export { useCategories }
