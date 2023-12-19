import { computed, unref } from 'vue'
import { useRtdb } from './rtdb'
import { total, filter } from 'src/filters'

const { getObject } = useRtdb()

const useCategories = (txRef) => {
  const dbCategories = getObject('/data/finance/categories')
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
