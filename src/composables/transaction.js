import { computed, unref } from 'vue'

import { formatBalance } from 'src/balance'

import { useCategories } from './categories'
import { useUsers } from './users'

const useTransaction = (data) => {
  const { users } = useUsers()
  const { categories } = useCategories()

  const paidBy = computed(() => {
    return users.value[unref(data).paid_by] || {}
  })

  const category = computed(() => {
    return categories.value[unref(data).category] || {}
  })

  const type = computed(() => unref(data)?.amount > 0 ? 'credit' : 'debit')
  const balanceString = computed(() => formatBalance(unref(data).amount))

  return {
    data,
    type,
    category,
    user: paidBy,
    balanceString
  }
}

export { useTransaction }
