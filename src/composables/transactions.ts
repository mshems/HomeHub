import { getCategory } from './categories'
import { useCollection } from './collections'
import { filterTransactions } from './filters'
import type { Filters } from './filters'
import { getUser } from './users'
import { useArrayReduce } from '@vueuse/core'
import { ref as dbRef } from 'firebase/database'
import { DateTime } from 'luxon'
import { computed, type Ref } from 'vue'
import { useDatabase, useDatabaseList, useDatabaseObject } from 'vuefire'

import { balanceType } from '@/lib/balance'
import type { ITransaction } from '@/lib/models'

export const getTransaction = (id: string) => {
  const db = useDatabase()
  const tx = useDatabaseObject<ITransaction>(dbRef(db, `data/finance/transactions/${id}`))
  return tx
}

export const useTransactionDetails = (id: string) => {
  const db = useDatabase()
  const tx = useDatabaseObject<ITransaction>(dbRef(db, `data/finance/transactions/${id}`))
  const user = computed(() => (tx.value ? getUser(tx.value.paid_by).value : undefined))
  const category = computed(() => (tx.value ? getCategory(tx.value.category).value : undefined))
  const dateTime = computed(() => (tx.value ? DateTime.fromSeconds(tx.value.timestamp) : undefined))
  const date = computed(() =>
    tx.value ? DateTime.fromSeconds(tx.value.timestamp).toFormat('MMM. d, yyyy') : undefined
  )
  const type = computed(() => (tx.value ? balanceType(tx.value.amount) : 'neutral'))
  return { data: tx, user, category, date, dateTime, type }
}

export const getTransactionsList = () => {
  const db = useDatabase()
  const tx = useDatabaseList<ITransaction>(dbRef(db, 'data/finance/transactions'))
  return tx
}

export const useTransactions = () => useCollection('data/finance/transactions')

export const useFilteredTransactions = (
  transactions: Ref<ITransaction[]>,
  filters: Ref<Filters>
) => {
  const filtered = filterTransactions(transactions, filters.value)
  const total = useArrayReduce(filtered, (acc, tx) => acc + tx.amount, 0)
  return { transactions: filtered, total }
}
