<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import RecipeCard from '@/components/recipes/RecipeCard.vue'
import { Button } from '@/components/ui/button'
import { InputWithIcon } from '@/components/ui/input'
import { getRecipesList } from '@/composables/recipes'

const router = useRouter()
const recipes = getRecipesList()

const cmpRecipe = (a: { lastUpdated: number }, b: { lastUpdated: number }) => {
  if (a.lastUpdated > b.lastUpdated) return -1
  if (a.lastUpdated < b.lastUpdated) return 1
  return 0
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
  return [...filteredRecipes.value].sort(cmpRecipe)
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
    <div class="mb-2">
      <InputWithIcon
        v-model="searchTerm"
        placeholder="Search by name or tag..."
        class="bg-card rounded-md border-none shadow-none"
      >
        <Search class="text-muted-foreground" :size="16" />
      </InputWithIcon>
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
