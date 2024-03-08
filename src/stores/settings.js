import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from 'src/stores/user'
import { LocalStorage, Dark } from 'quasar'

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
