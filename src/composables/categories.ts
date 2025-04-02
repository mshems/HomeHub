import { useFilters } from './filters'
import { useFilteredTransactions } from './transactions'
import { ref as dbRef } from 'firebase/database'
import type { Ref } from 'vue'
import { useDatabase, useDatabaseList, useDatabaseObject } from 'vuefire'

import type { ICategory, ITransaction } from '@/lib/models'

export const getCategoriesList = () => {
  const db = useDatabase()
  const categories = useDatabaseList<ICategory>(dbRef(db, 'data/finance/categories'))
  return categories
}

export const getCategory = (id: string) => {
  const db = useDatabase()
  const category = useDatabaseObject<ICategory>(dbRef(db, 'data/finance/categories/' + id))
  return category
}

export const useCategoryTotal = (transactions: Ref<ITransaction[]>, categoryId: string) => {
  return useFilteredTransactions(
    transactions,
    useFilters({ byCategory: { categories: [categoryId] } }).filters
  ).total
}
