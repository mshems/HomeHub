<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import RecipeCard from '@/components/recipes/RecipeCard.vue'
import { Button } from '@/components/ui/button'
import { getRecipesList } from '@/composables/recipes'

const router = useRouter()
const recipes = getRecipesList()

const cmpRecipe = (a: { lastUpdated: number }, b: { lastUpdated: number }) => {
  if (a.lastUpdated > b.lastUpdated) return -1
  if (a.lastUpdated < b.lastUpdated) return 1
  return 0
}

const sortedRecipes = computed(() => {
  return [...recipes.value].sort(cmpRecipe)
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
