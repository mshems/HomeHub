<script setup lang="ts">
import { Plus, Soup, ChefHat } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import Badge from '@/components/ui/badge/Badge.vue'
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
        <Card
          :hoverable="true"
          class="hover:bg-card-focus bg-muted cursor-pointer rounded-lg p-3"
          @click.stop="navigateToRecipe(featuredRecipe.id)"
        >
          <div class="flex gap-3">
            <!-- Recipe Image -->
            <div class="flex-shrink-0">
              <template v-if="featuredRecipe.image">
                <img
                  :src="featuredRecipe.image"
                  :alt="featuredRecipe.title"
                  class="h-16 w-16 rounded-md object-cover"
                />
              </template>
              <template v-else>
                <div class="bg-secondary flex h-16 w-16 items-center justify-center rounded-md">
                  <Soup class="text-muted-foreground h-6 w-6" />
                </div>
              </template>
            </div>

            <!-- Recipe Info -->
            <div class="min-w-0 flex-1">
              <h5 class="truncate font-medium">{{ featuredRecipe.title }}</h5>
              <div class="mt-2 flex flex-wrap gap-1" v-if="featuredRecipe.tags.length > 0">
                <Badge
                  v-for="tag in featuredRecipe.tags.slice(0, 2)"
                  :key="tag"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ tag }}
                </Badge>
                <span v-if="featuredRecipe.tags.length > 2" class="text-muted-foreground text-xs">
                  +{{ featuredRecipe.tags.length - 2 }} more
                </span>
              </div>
            </div>
          </div>
        </Card>
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
