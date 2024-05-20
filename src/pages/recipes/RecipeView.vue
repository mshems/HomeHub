<script setup>
import NavChip from 'src/components/NavChip.vue'
import RecipeContent from 'src/components/recipes/RecipeContent.vue'
import RecipesHeader from 'src/components/recipes/RecipesHeader.vue'

defineProps({
  id: {
    type: String,
    required: true
  }
})

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
      :id="id"
    />
  </q-page>
</template>
