import { useArrayFilter } from '@vueuse/core'
import { DateTime } from 'luxon'
import { type Ref, type MaybeRef, unref } from 'vue'

import { getCategory } from '@/composables/categories'
import type { ITransaction } from '@/lib/models'
import type { StringToFn, StringToObj } from '@/lib/types'

interface ByDateRangeProps {
  start: MaybeRef<DateTime>
  end: MaybeRef<DateTime>
}

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
  byDateRange: (tx: ITransaction, { start, end }: ByDateRangeProps) => {
    const date = DateTime.fromSeconds(tx.timestamp)
    return date >= unref(start) && date <= unref(end)
  },
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
  byDateRange?: ByDateRangeProps
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
