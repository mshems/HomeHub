import { getCategory } from './categories'
import { useArrayFilter } from '@vueuse/core'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { type Ref, type MaybeRef, ref, unref } from 'vue'

import type { ITransaction } from '@/lib/models'
import type { StringToFn, StringToObj } from '@/lib/types'

interface ByMonthProps {
  month: MaybeRef<number>
  year: MaybeRef<number>
}

interface ByYearProps {
  year: MaybeRef<number>
}

interface ByUserProps {
  user_id: MaybeRef<string>
}

interface ByCategoryProps {
  categories: MaybeRef<string[]>
}

interface ByTypeProps {
  type: MaybeRef<'need' | 'want' | 'save'>
}

interface ByCreditProps {
  credit: MaybeRef<boolean>
}

export const filterFns: StringToFn = {
  byMonth: (tx: ITransaction, { month, year }: ByMonthProps) => {
    const date = DateTime.fromSeconds(tx.timestamp)
    return date.month === unref(month) && date.year === unref(year)
  },
  byYear: (tx: ITransaction, { year }: ByYearProps) => {
    const date = DateTime.fromSeconds(tx.timestamp)
    return date.year === unref(year)
  },
  byUser: (tx: ITransaction, { user_id }: ByUserProps) => {
    return tx.paid_by === unref(user_id)
  },
  byCategory: (tx: ITransaction, { categories }: ByCategoryProps) => {
    return unref(categories).includes(tx.category)
  },
  byNotCategory: (tx: ITransaction, { categories }: ByCategoryProps) => {
    return !unref(categories).includes(tx.category)
  },
  byType: (tx: ITransaction, { type }: ByTypeProps) => {
    const category = getCategory(tx.category)
    return category.value?.type === unref(type)
  },
  byCredit: (tx: ITransaction, { credit }: ByCreditProps) => {
    return tx.amount > 0 === unref(credit)
  }
}

export interface Filters extends StringToObj {
  byMonth?: ByMonthProps
  byYear?: ByYearProps
  byUser?: ByUserProps
  byCategory?: ByCategoryProps
  byNotCategory?: ByCategoryProps
  byType?: ByTypeProps
  byCredit?: ByCreditProps
}

export function filterTransactions(transactions: Ref<ITransaction[]>, filters: Filters) {
  return useArrayFilter(transactions, (tx) => {
    for (const key in filters) {
      if (filters[key]) {
        const fn = filterFns[key]
        if (!fn) {
          console.error(`Filter function for ${key} does not exist`)
          return false
        }
        if (!fn(tx, filters[key])) {
          return false
        }
      }
    }
    return true
  })
}

export const useFilters = (initial: Filters = {}) => {
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
