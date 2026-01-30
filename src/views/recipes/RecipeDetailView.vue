<script setup lang="ts">
import { DateTime } from 'luxon'
import { useRouter } from 'vue-router'

import RecipeDetails from '@/components/recipes/RecipeDetails.vue'
import AutoBreadcrumbs from '@/components/ui/breadcrumb/AutoBreadcrumbs.vue'
import { useCollection } from '@/composables/collections'
import { getRecipe } from '@/composables/recipes'
import { useRecipes } from '@/composables/recipes'
import type { IMeal, IRecipe } from '@/lib/models'

const props = defineProps<{ id: string }>()
const router = useRouter()
const recipe = getRecipe(props.id)

const { remove } = useRecipes()
const onDelete = () => {
  remove(props.id).then(() => router.push('/recipes'))
}

const onCook = (meal: IMeal, timestamp: number) => {
  console.log('onCook', meal, timestamp)
  const isoDate = DateTime.fromSeconds(timestamp).toISODate()
  const { create } = useCollection(`data/mealprep/${isoDate}/meals`)
  create(meal)
}
</script>

<template>
  <div class="container flex max-w-[800px] flex-col gap-5 py-8">
    <AutoBreadcrumbs
      :page="recipe?.title || 'Recipe'"
      :items="{
        Recipes: '/recipes'
      }"
      no-dashboard
    />
    <RecipeDetails
      @edit="() => router.push(`/recipes/edit?id=${props.id}`)"
      @delete="onDelete"
      @cook="onCook"
      :recipe="recipe as IRecipe"
    />
  </div>
</template>
