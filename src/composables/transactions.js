import { unref } from 'vue'
import { remove as dbRemove } from 'firebase/database'
import { DateTime } from 'luxon'
import { useRtdb } from './rtdb'
import { useDatabaseObject } from 'vuefire'

const { transactions, getRef, add, write } = useRtdb()

const useTransactions = () => {
  const get = (id) => {
    return useDatabaseObject(getRef(`data/finance/transactions/${id}`))
  }

  const update = (id, data) => {
    return write(`/data/finance/transactions/${id}`, unref(data))
  }

  const credits = (transactions) => {
    return unref(transactions).fiter(t => t.amount >= 0)
  }

  const debits = (transactions) => {
    return unref(transactions).fiter(t => t.amount <= 0)
  }

  const byCategory = (transactions, category) => {
    if (!category) return transactions
    return unref(transactions).filter(t => t.category === category)
  }

  const byMonth = (transactions, month, year) => {
    if (!month || !year) return transactions
    return unref(transactions).filter(t => {
      const dt = DateTime.fromSeconds(t.timestamp)
      return (dt.month === month) && (dt.year === year)
    })
  }

  const byYear = (transactions, year) => {
    if (!year) return transactions
    return unref(transactions).filter(t => {
      const dt = DateTime.fromSeconds(t.timestamp)
      return (dt.year === year)
    })
  }

  const after = (transactions, dateTime) => {
    if (!dateTime) return transactions
    return unref(transactions).filter(t => {
      const dt = DateTime.fromSeconds(t.timestamp)
      return dt >= dateTime
    })
  }

  const before = (transactions, dateTime) => {
    if (!dateTime) return transactions
    return unref(transactions).filter(t => {
      const dt = DateTime.fromSeconds(t.timestamp)
      return dt <= dateTime
    })
  }

  const byUser = (transactions, userId) => {
    if (!userId) return transactions
    return unref(transactions).filter(t => t.paid_by === userId)
  }

  const removeTx = (id) => {
    const transactionRef = getRef('/data/finance/transactions/' + id)
    return dbRemove(transactionRef)
  }

  const addTx = (data) => {
    return add('/data/finance/transactions', data)
  }

  const filter = (transactions, userId, category, month, year) => {
    return byMonth(
      byUser(
        byCategory(unref(transactions), category),
        userId
      ),
      month, year
    )
  }

  const total = (transactions) => {
    return unref(transactions).reduce((acc, t) => acc + t.amount, 0)
  }

  return {
    transactions,
    get,
    update,
    credits,
    debits,
    byCategory,
    byMonth,
    byYear,
    byUser,
    before,
    after,
    removeTx,
    addTx,
    total,
    filter
  }
}

export { useTransactions }
