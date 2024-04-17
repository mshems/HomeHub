<script setup>
import RecipeIngredient from './RecipeIngredient.vue'
import RecipeStep from './RecipeStep.vue'

defineProps({
  recipe: {
    type: Object,
    default: () => ({})
  },
  pending: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <q-card class="q-pb-md">
    <template v-if="pending">
      <q-card-section class="column q-gutter-md">
        <q-skeleton />
        <q-skeleton />
        <q-skeleton />
      </q-card-section>
    </template>
    <template v-else-if="!!recipe">
      <q-card-section class="card-title">
        {{ recipe.title }}
      </q-card-section>
      <q-card-section class="card-subtitle" />
      <q-card-section>
        <div class="text-bold q-mb-sm">
          Ingredients
        </div>
        <template
          v-for="ingredient, i in recipe.ingredients"
          :key="i"
        >
          <recipe-ingredient
            :ingredient="ingredient"
          />
        </template>
      </q-card-section>
      <q-card-section>
        <div class="text-bold q-mb-sm">
          Recipe
        </div>
        <template
          v-for="step, i in recipe.steps"
          :key="i"
        >
          <recipe-step
            :step="step"
          />
        </template>
      </q-card-section>
      <q-card-section>
        <div class="text-bold q-mb-sm">
          Notes
        </div>
        <div class="text-muted text-mono">
          {{ recipe.notes }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-chip
          v-for="tag in recipe.tags"
          :key="tag"
          square
          size="sm"
          :label="tag"
          class="text-bold text-on-color"
          color="primary"
        />
      </q-card-section>
    </template>
  </q-card>
</template>
