<script setup>
import { useRouter } from 'vue-router'

import RecipeCard from 'src/components/recipes/RecipeCard.vue'
import RecipesHeader from 'src/components/recipes/RecipesHeader.vue'
import { useCollection } from 'src/composables/collection'

const router = useRouter()
const { collection: recipes } = useCollection('data/recipes')
</script>

<template>
  <recipes-header />
  <q-page
    padding
    class="container"
  >
    <template
      v-for="recipe in recipes"
      :key="recipe.id"
    >
      <recipe-card
        class="clickable hoverable cursor-pointer"
        :recipe="recipe"
        @click="router.push(`/recipes/${recipe.id}`)"
      />
    </template>
  </q-page>
</template>../../components/recipes/RecipeCard.vue
