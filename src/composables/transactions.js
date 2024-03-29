import { filter, total, useFilters } from '../filters'
import { useCollection } from './collection'

const useTransactions = () => {
  const { get, update, remove, create, collection: transactions } = useCollection('data/finance/transactions')

  return {
    transactions,
    get,
    update,
    remove,
    create,
    total,
    filter,
    useFilters
  }
}

export { useTransactions }
