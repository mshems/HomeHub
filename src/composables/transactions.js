import { computed, unref } from 'vue'
import { filter } from '../filters'
import { useCollection } from './collection'
import { formatBalance } from 'src/balance'
import { useRtdb } from 'src/composables/rtdb'
import { useCategories } from 'src/composables/categories'

const useTransactions = () => {
  const { get, update, remove, create, collection: transactions } = useCollection('data/finance/transactions')

  const total = (transactions) => {
    return unref(transactions).reduce((acc, t) => acc + t.amount, 0)
  }

  return {
    transactions,
    get,
    update,
    remove,
    create,
    total,
    filter
  }
}

const useTransaction = (data) => {
  const { users } = useRtdb()
  const { categories } = useCategories()

  const paidBy = computed(() => {
    return users.value[unref(data).paid_by] || {}
  })

  const category = computed(() => {
    return categories.value[unref(data).category] || {}
  })

  const type = computed(() => unref(data).amount > 0 ? 'credit' : 'debit')

  return {
    data,
    type,
    category,
    paidBy
  }
}

export { useTransactions, useTransaction }
