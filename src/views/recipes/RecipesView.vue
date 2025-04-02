<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import RecipeCard from '@/components/recipes/RecipeCard.vue'
import AutoBreadcrumbs from '@/components/ui/breadcrumb/AutoBreadcrumbs.vue'
import { Button } from '@/components/ui/button'
import { getRecipesList } from '@/composables/recipes'

const router = useRouter()
const recipes = getRecipesList()
</script>
<template>
  <div class="container flex max-w-[1200px] flex-col gap-3 py-8">
    <h1 class="flex flex-row items-center pb-3 font-title text-4xl font-semibold">
      Recipes
      <Button variant="accent" @click="router.push('/recipes/edit')" class="ml-auto font-sans">
        <Plus :size="20" class="mr-2" />
        Add Recipe
      </Button>
    </h1>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <template v-for="recipe in recipes" :key="recipe.id">
        <RecipeCard
          :recipe="recipe"
          @click="router.push(`/recipes/` + recipe.id)"
          :hoverable="true"
        />
      </template>
    </div>
  </div>
</template>
