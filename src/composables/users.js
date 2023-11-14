import { useRtdb } from './rtdb'
import { useUserStore } from 'src/stores/user'
import { computed } from 'vue'
import { useTransactions } from './transactions'

const { total, byUser } = useTransactions()
const { users: dbUsers } = useRtdb()
const userStore = useUserStore()

const useUsers = (txRef) => {
  const currentUser = () => {
    for (const uid in dbUsers.value) {
      if (dbUsers.value[uid].email === userStore.email) return dbUsers.value[uid]
    }
    return {}
  }
  const users = computed(() => {
    return Object.fromEntries(
      Object.keys(dbUsers.value || {}).map(u => [
        u,
        {
          ...dbUsers.value[u],
          id: u,
          ...(txRef && txRef.value) ? { total: total(byUser(txRef, u)) } : {}
        }
      ])
    )
  })

  return {
    users,
    currentUser
  }
}

export { useUsers }
