<script setup>
defineProps({
  meal: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <q-card class="hoverable bg-recipes-bg">
    <q-card-section class="column q-gutter-sm">
      <div class="text-on-recipes">{{ meal.label }}</div>
      <div class="row q-gutter-xs">
        <q-chip :label="meal.meal" square size="sm" class="q-ma-none text-on-color text-bold" color="secondary"/>
      </div>
    </q-card-section>
  </q-card>
</template>
