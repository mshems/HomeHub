import { computed, unref } from 'vue'
import { useRtdb } from './rtdb'
import { useTransactions } from './transactions'

const { categories: dbCategories } = useRtdb()
const { total, filter } = useTransactions()

const useCategories = (txRef) => {
  const tx = computed(() => unref(txRef))
  const categories = computed(() => {
    return Object.fromEntries(
      Object.keys(dbCategories.value || {}).map(c => [
        c,
        {
          ...dbCategories.value[c],
          name: c,
          ...(tx.value) ? { total: total(filter(tx, { category: c })) } : {}
        }
      ])
    )
  })
  return { categories }
}

export { useCategories }
