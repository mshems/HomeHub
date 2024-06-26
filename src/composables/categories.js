import { computed } from 'vue'

import { filter, total } from 'src/filters'

import { useRtdb } from './rtdb'

const { getObject } = useRtdb()

const useCategories = (txRef) => {
  const dbCategories = getObject('/data/finance/categories')
  const categories = computed(() => {
    return Object.fromEntries(
      Object.keys(dbCategories.value || {}).map(c => [
        c,
        {
          ...dbCategories.value[c],
          ...(txRef && txRef.value) ? { total: total(filter(txRef, { category: c })) } : {}
        }
      ])
    )
  })
  return { categories }
}

export { useCategories }
