<script setup>
import { ref } from 'vue'

import MealPrepDay from 'src/components/mealprep/MealPrepDay.vue'
import NavChip from 'src/components/NavChip.vue'
import RecipesHeader from 'src/components/recipes/RecipesHeader.vue'

const dates = ref([
  '2024-04-15',
  '2024-04-16'
])
</script>

<template>
  <recipes-header>
    <nav-chip
      path="/mealprep"
      icon="mdi-calendar"
      label="Schedule"
    />
  </recipes-header>
  <q-page
    padding
    class="container"
  >
    <q-virtual-scroll
      style="height: 100%;"
      :items="dates"
      v-slot="{ item, index }"
    >
      <div
        :key="index"
        class="q-mb-sm"
      >
        <meal-prep-day :date="item" />
      </div>
    </q-virtual-scroll>
  </q-page>
</template>
