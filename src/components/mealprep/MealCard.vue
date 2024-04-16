<script setup>
const emit = defineEmits(['delete'])
defineProps({
  meal: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <q-card class="hoverable ">
    <q-btn
      dense
      round
      flat
      size="xs"
      icon="mdi-close"
      class="q-ml-sm"
      @click="emit('delete', meal.id)"
      color="muted"
      style="position: absolute; right: 8px; top: 8px; z-index: 999;"
    />
    <q-card-section class="column q-gutter-sm">
      <div class=" row items-baseline justify-between">
        <div
          class="title q-mr-lg"
          style="font-size: 1rem;"
        >
          {{ meal.label }}
        </div>
      </div>
      <div class="row justify-between">
        <q-chip
          :label="meal.meal"
          square
          size="sm"
          class="q-ma-none text-bold text-on-color"
          color="secondary"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
