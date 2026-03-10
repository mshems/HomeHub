<script setup lang="ts">
import RecipeMiniCard from '../recipes/RecipeMiniCard.vue'
import { Plus, Soup, ChefHat } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRecipesList } from '@/composables/recipes'

const router = useRouter()
const recipes = getRecipesList()

const featuredRecipe = computed(() => {
  if (!recipes.value || recipes.value.length === 0) return null

  // Use current date as seed for consistent daily selection
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

  // Simple hash function to convert date string to number
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get index
  const randomIndex = Math.abs(hash) % recipes.value.length
  return recipes.value[randomIndex]
})

const navigateToRecipe = (recipeId: string) => {
  router.push(`/recipes/${recipeId}`)
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center gap-2"> Recipes </CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Featured Recipe -->

      <div v-if="featuredRecipe" class="space-y-3">
        <h4 class="font-title font-medium">Recipe of the Day</h4>
        <RecipeMiniCard
          :recipe="featuredRecipe"
          :hoverable="true"
          @click.stop="navigateToRecipe(featuredRecipe.id)"
        />
      </div>

      <!-- No Recipes State -->
      <div v-else class="py-4 text-center">
        <Soup class="text-muted-foreground mx-auto mb-2 h-12 w-12" />
        <p class="text-muted-foreground text-sm">No recipes yet</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3">
        <Button variant="secondary" @click.stop="router.push('/recipes')">
          <ChefHat class="mr-2" />
          View Recipes
        </Button>
        <Button variant="accent" @click.stop="router.push('/recipes/edit')">
          <Plus class="mr-2" />
          Add Recipe
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
