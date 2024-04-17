<script setup>
defineProps({
  recipe: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <q-card>
    <q-card-section class="card-title">
      {{ recipe.title }}
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
  </q-card>
</template>
