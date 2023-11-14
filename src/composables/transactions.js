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
    return unref(transactions).filter(t => t.amount >= 0)
  }

  const debits = (transactions) => {
    return unref(transactions).filter(t => t.amount <= 0)
  }

  const byType = (transactions, type) => {
    if (!unref(type)) return transactions
    if (unref(type) === 'credit') return credits(transactions)
    return debits(transactions)
  }

  const byCategory = (transactions, category) => {
    if (!unref(category)) return transactions
    return unref(transactions).filter(t => t.category === unref(category))
  }

  const byMonth = (transactions, month, year) => {
    if (!unref(month) || !unref(year)) return transactions
    return unref(transactions).filter(t => {
      const dt = DateTime.fromSeconds(t.timestamp)
      return (dt.month === unref(month)) && (dt.year === unref(year))
    })
  }

  const byYear = (transactions, year) => {
    if (!unref(year)) return transactions
    return unref(transactions).filter(t => {
      const dt = DateTime.fromSeconds(t.timestamp)
      return (dt.year === unref(year))
    })
  }

  const afterDate = (transactions, dateTime) => {
    if (!unref(dateTime)) return transactions
    return unref(transactions).filter(t => {
      const dt = DateTime.fromSeconds(t.timestamp)
      return dt >= unref(dateTime)
    })
  }

  const beforeDate = (transactions, dateTime) => {
    if (!unref(dateTime)) return transactions
    return unref(transactions).filter(t => {
      const dt = DateTime.fromSeconds(t.timestamp)
      return dt <= unref(dateTime)
    })
  }

  const byUser = (transactions, userId) => {
    if (!unref(userId)) return transactions
    return unref(transactions).filter(t => t.paid_by === unref(userId))
  }

  const removeTx = (id) => {
    const transactionRef = getRef('/data/finance/transactions/' + id)
    return dbRemove(transactionRef)
  }

  const addTx = (data) => {
    return add('/data/finance/transactions', data)
  }

  const filter = (transactions, { userId, category, month, year, type, before, after }) => {
    return byYear(
      byMonth(
        byUser(
          byCategory(
            byType(
              beforeDate(
                afterDate(
                  unref(transactions),
                  after),
                before),
              type),
            category),
          userId),
        month, year),
      year)
  }

  const total = (transactions) => {
    return unref(transactions).reduce((acc, t) => acc + t.amount, 0)
  }

  return {
    transactions,
    get,
    update,
    delete: removeTx,
    removeTx,
    create: addTx,
    addTx,
    total,
    filter
  }
}

export { useTransactions }
