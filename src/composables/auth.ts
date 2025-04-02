import { getUserByEmail } from './users'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { computed, ref, watchEffect } from 'vue'
import { useCurrentUser } from 'vuefire'

import { type IUser } from '@/lib/models'

export const useAuth = () => {
  const auth = getAuth()
  const currentFirebaseUser = useCurrentUser()
  const user = ref<IUser | undefined>(getUserByEmail(currentFirebaseUser.value?.email))

  watchEffect(() => {
    user.value = getUserByEmail(currentFirebaseUser.value?.email)
  })

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    signOut(auth)
      .then(() => {
        // console.log(currentFirebaseUser.value)
        user.value = undefined
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.log(error)
      })
  }

  const authorized = computed(() => !!currentFirebaseUser.value)

  return { login, logout, auth, user, authorized }
}
