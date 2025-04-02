import { useFilters } from './filters'
import { useFilteredTransactions } from './transactions'
import { ref as dbRef } from 'firebase/database'
import { type Ref, type MaybeRef } from 'vue'
import { useDatabase, useDatabaseList, useDatabaseObject } from 'vuefire'

import type { ITransaction, IUser } from '@/lib/models'

export const getUsersList = () => {
  const db = useDatabase()
  const users = useDatabaseList<IUser>(dbRef(db, 'data/users'))
  return users
}

export const getUser = (id: string) => {
  const db = useDatabase()
  const user = useDatabaseObject<IUser>(dbRef(db, 'data/users/' + id))
  return user
}

export const getUserByEmail = (email: string | null | undefined) => {
  if (email) {
    const db = useDatabase()
    const users = useDatabaseList<IUser>(dbRef(db, 'data/users'))
    const user = users.value.find((u) => u.email === email)
    return user
  }
  return undefined
}

export const useUserTransactions = (
  userId: MaybeRef<string>,
  transactions: Ref<ITransaction[]>
) => {
  const { filters } = useFilters({ byUser: { user_id: userId } })
  const { transactions: tx, total } = useFilteredTransactions(transactions, filters)
  return { transactions: tx, total }
}
