import { defineStore } from 'pinia'

import { useCategories } from 'src/composables/categories'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'

export const useFinanceStore = defineStore('finance', () => {
  const { transactions } = useTransactions()
  const { categories } = useCategories()
  const { users } = useUsers()

  return {
    transactions,
    categories,
    users
  }
})
