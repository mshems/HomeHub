<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import RecipeEditor from '@/components/recipes/editor/RecipeEditor.vue'
import AutoBreadcrumbs from '@/components/ui/breadcrumb/AutoBreadcrumbs.vue'
import { getRecipe, useRecipes } from '@/composables/recipes'
import type { IRecipe } from '@/lib/models'

const route = useRoute()
const router = useRouter()
const updating = computed(() => !!route.query.id)

const { create, update } = useRecipes()
const onSave = (recipe: IRecipe) => {
  if (updating.value) {
    update(route.query.id as string, recipe)
      .then(() => router.go(-1))
      .catch(() => console.log('error'))
  } else {
    create(recipe)
      .then(() => router.replace('/recipes'))
      .catch(() => console.log('error'))
  }
}

const onBack = () => {
  if (updating.value) {
    router.go(-1)
  } else {
    router.replace('/recipes')
  }
}

type optString = string | undefined

const breadcrumbs: Record<string, string> = {
  Recipes: '/recipes'
}
if (updating.value) {
  const id = route.query.id as string
  const recipe = getRecipe(id)
  breadcrumbs[recipe.value?.title || 'Recipe'] = '/recipes/' + id
}
</script>
<template>
  <div class="container flex max-w-[800px] flex-col gap-5 py-8">
    <AutoBreadcrumbs :page="updating ? 'Edit' : 'New'" :items="breadcrumbs" no-dashboard />

    <RecipeEditor
      :recipeId="route.query.id as string as optString"
      @cancel="onBack"
      @save="(recipe) => onSave(recipe)"
    />
  </div>
</template>
