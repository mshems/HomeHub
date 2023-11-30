import { unref } from 'vue'
import { filter } from '../filters'
import { useCollection } from './collection'

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

export { useTransactions }
