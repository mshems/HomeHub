import _ from 'lodash'
import { ref, type Ref } from 'vue'

import type { Filters } from '@/lib/filters'

export type FilterContext = {
  filters: Ref<Filters>
  setFilter: (key: string, value: any) => void
  deleteFilter: (key: string) => void
  hasFilter: (key: string) => boolean
  clearFilters: () => void
  swoggleFilter: (key: string, value: any) => void
}

export const useFilters = (initial: Filters = {}): FilterContext => {
  const filters = ref<Filters>({ ...initial } as Filters)
  const setFilter = (key: string, value: any) => {
    filters.value[key] = value
  }
  const deleteFilter = (key: string) => {
    delete filters.value[key]
  }
  const hasFilter = (key: string) => {
    return key in filters.value
  }
  const clearFilters = () => {
    for (const key in filters.value) {
      deleteFilter(key)
    }
  }
  // swap/toggle filter value
  const swoggleFilter = (key: string, value: any) => {
    if (hasFilter(key)) {
      if (_.isEqual(filters.value[key], value)) {
        deleteFilter(key)
        return
      }
    }
    setFilter(key, value)
  }
  return {
    filters,
    setFilter,
    deleteFilter,
    hasFilter,
    clearFilters,
    swoggleFilter
  }
}
