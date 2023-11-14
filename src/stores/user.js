import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    auth: getAuth(),
    authorized: false,
    email: ''
  }),
  getters: {
  },
  actions: {
    initialize () {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          this.email = user.email
          this.authorized = true
        } else {
          // User is signed out
          this.authorized = false
        }
      })
    },
    async login (email, password) {
      return signInWithEmailAndPassword(this.auth, email, password)
    },
    logout () {
      signOut(this.auth).then(() => {
        this.email = ''
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        console.log(error)
      })
    }
  }
})
