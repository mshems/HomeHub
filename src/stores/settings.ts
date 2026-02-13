import { defineStore } from 'pinia'

import type { RecipeSortDirection, RecipeSortType } from '@/lib/models'

interface RecipeSortSettings {
  sortType: RecipeSortType
  sortDirection: RecipeSortDirection
}

interface SettingsState {
  recipeSort: RecipeSortSettings
}

const STORAGE_KEY = 'homehub-settings'

const defaultSettings: SettingsState = {
  recipeSort: {
    sortType: 'lastUpdated',
    sortDirection: 'desc'
  }
}

const loadFromStorage = (): SettingsState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...defaultSettings,
        ...parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error)
  }
  return defaultSettings
}

const saveToStorage = (state: SettingsState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error)
  }
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => loadFromStorage(),

  actions: {
    setRecipeSortType(sortType: RecipeSortType) {
      this.recipeSort.sortType = sortType
      saveToStorage(this.$state)
    },

    setRecipeSortDirection(sortDirection: RecipeSortDirection) {
      this.recipeSort.sortDirection = sortDirection
      saveToStorage(this.$state)
    },

    setRecipeSort(sortType: RecipeSortType, sortDirection: RecipeSortDirection) {
      this.recipeSort.sortType = sortType
      this.recipeSort.sortDirection = sortDirection
      saveToStorage(this.$state)
    }
  }
})
