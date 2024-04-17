<script setup>
import NavChip from 'src/components/NavChip.vue'
import RecipeContent from 'src/components/recipes/RecipeContent.vue'
import RecipesHeader from 'src/components/recipes/RecipesHeader.vue'
import { useCollection } from 'src/composables/collection'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { get, pending } = useCollection('data/recipes')
const recipe = get(props.id)
</script>

<template>
  <recipes-header>
    <nav-chip
      :path="'/recipes/' + id"
      icon="mdi-pot-mix"
      label="Details"
    />
  </recipes-header>
  <q-page
    padding
    class="container"
  >
    <recipe-content
      :recipe="recipe"
      :pending="pending"
    />
  </q-page>
</template>
