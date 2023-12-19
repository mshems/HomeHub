import { useRtdb } from './rtdb'
import { useUserStore } from 'src/stores/user'
import { computed } from 'vue'
import { total, filter } from 'src/filters'

const { getObject } = useRtdb()
const userStore = useUserStore()

const useUsers = (txRef) => {
  const dbUsers = getObject('/data/users')

  const currentUser = computed(() => {
    for (const dbuser of Object.values(dbUsers.value || {})) {
      if (dbuser.email === userStore.email) return dbuser
    }
    return {}
  })

  const users = computed(() => {
    return Object.fromEntries(
      Object.keys(dbUsers.value || {}).map(u => [
        u,
        {
          ...dbUsers.value[u],
          id: u,
          ...(txRef && txRef.value) ? { total: total(filter(txRef, { userId: u })) } : {}
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
