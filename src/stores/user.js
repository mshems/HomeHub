import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    auth: getAuth(),
    authorized: false,
    email: '',
    user: {}
  }),
  getters: {
    color: (state) => state.user.color || 'primary'
  },
  actions: {
    initialize () {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          this.email = user.email
          this.user = user
          this.authorized = true
        } else {
          // User is signed out
          this.authorized = false
          this.user = {}
        }
      })
    },
    async login (email, password) {
      return signInWithEmailAndPassword(this.auth, email, password)
    },
    logout () {
      signOut(this.auth).then(() => {
        this.email = ''
        this.user = {}
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        console.log(error)
      })
    }
  }
})
