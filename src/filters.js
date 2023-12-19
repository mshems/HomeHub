import { unref } from 'vue'
import { DateTime } from 'luxon'

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

export {
  byType,
  byCategory,
  byMonth,
  byYear,
  afterDate,
  beforeDate,
  byUser,
  filter,
  total
}
