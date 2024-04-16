import { ref, watch } from 'vue'
import { Dark, LocalStorage } from 'quasar'
import { defineStore } from 'pinia'

import { useUserStore } from 'src/stores/user'

export const useSettingsStore = defineStore('settings', () => {
  const user = useUserStore()
  const showMenu = ref(false)

  watch(() => Dark.isActive, (value) => {
    LocalStorage.set('dark', value)
  })

  const initialize = () => {
    Dark.set(LocalStorage.getItem('dark'))
  }

  return {
    user,
    showMenu,
    initialize
  }
})
