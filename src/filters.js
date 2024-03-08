import { unref } from 'vue'
import { DateTime } from 'luxon'
import { useCategories } from './composables/categories'

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

const byCategoryType = (transactions, categoryType) => {
  if (!unref(categoryType)) return transactions
  const { categories } = useCategories(transactions)
  return unref(transactions).filter(t => unref(categories)[t.category].type === unref(categoryType))
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

const byName = (transactions, name) => {
  if (!unref(name)) return transactions
  return unref(transactions).filter(t => t.name.toLowerCase().startsWith(unref(name.toLowerCase())))
}

const filter = (transactions, { userId, category, categoryType, month, year, type, before, after, name }) => {
  return byName(
    byYear(
      byMonth(
        byUser(
          byCategory(
            byCategoryType(
              byType(
                beforeDate(
                  afterDate(
                    unref(transactions),
                    after),
                  before),
                type),
              categoryType),
            category),
          userId),
        month, year),
      year),
    name
  )
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
