import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from 'src/stores/user'

export const useSettingsStore = defineStore('settings', () => {
  const user = useUserStore()
  const showMenu = ref(false)

  return {
    user,
    showMenu
  }
})
