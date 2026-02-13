<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import RecipeCard from '@/components/recipes/RecipeCard.vue'
import { Button } from '@/components/ui/button'
import { InputWithIcon } from '@/components/ui/input'
import { SortButton } from '@/components/ui/sort-button'
import { getRecipesList } from '@/composables/recipes'
import type { RecipeSortType } from '@/lib/models'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const recipes = getRecipesList()
const settingsStore = useSettingsStore()

const sortType = computed(() => settingsStore.recipeSort.sortType)
const sortDirection = computed(() => settingsStore.recipeSort.sortDirection)

const sortOptions = [
  {
    value: 'alphabetical' as const,
    label: 'Alphabetical',
    defaultDirection: 'asc' as const,
    directionLabels: {
      asc: 'A-Z',
      desc: 'Z-A'
    }
  },
  {
    value: 'lastUpdated' as const,
    label: 'Last Updated',
    defaultDirection: 'asc' as const,
    directionLabels: {
      asc: 'Recent',
      desc: 'Oldest'
    }
  }
]

const setSortOption = (sortType: RecipeSortType, direction: 'asc' | 'desc') => {
  settingsStore.setRecipeSort(sortType, direction)
}

const searchTerm = ref('')

const filteredRecipes = computed(() => {
  if (!searchTerm.value) {
    return recipes.value
  }
  const term = searchTerm.value.toLowerCase()
  return recipes.value.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(term) ||
      (recipe.tags && recipe.tags.some((tag) => tag.toLowerCase().includes(term)))
    )
  })
})

const sortedRecipes = computed(() => {
  const sorted = [...filteredRecipes.value].sort((a, b) => {
    let result = 0

    if (sortType.value === 'alphabetical') {
      result = a.title.localeCompare(b.title)
    } else if (sortType.value === 'lastUpdated') {
      result = b.lastUpdated - a.lastUpdated // Natural desc (newest first)
    }

    // Apply direction - for lastUpdated, asc means "Recent" (newest first) so we keep natural order
    if (sortType.value === 'lastUpdated') {
      return sortDirection.value === 'asc' ? result : -result
    } else {
      return sortDirection.value === 'asc' ? result : -result
    }
  })

  return sorted
})
</script>
<template>
  <div class="container flex max-w-[1200px] flex-col gap-3 py-8">
    <h1 class="font-title flex flex-row items-center pb-3 text-4xl font-semibold">
      Recipes
      <Button variant="accent" @click="router.push('/recipes/edit')" class="ml-auto font-sans">
        <Plus :size="20" class="mr-2" />
        Add Recipe
      </Button>
    </h1>
    <div class="mb-2 flex gap-2">
      <div class="flex-1">
        <InputWithIcon
          v-model="searchTerm"
          placeholder="Search by name or tag..."
          class="bg-card rounded-md border-none shadow-none"
        >
          <Search class="text-muted-foreground" :size="16" />
        </InputWithIcon>
      </div>

      <SortButton
        :options="sortOptions"
        :current-sort-type="sortType"
        :current-direction="sortDirection"
        @sort="setSortOption"
      />
    </div>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <template v-for="recipe in sortedRecipes" :key="recipe.id">
        <RecipeCard
          :recipe="recipe"
          @click="router.push(`/recipes/` + recipe.id)"
          :hoverable="true"
        />
      </template>
    </div>
  </div>
</template>
