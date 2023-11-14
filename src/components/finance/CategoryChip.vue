<script setup>
import { color } from 'src/composables/balance'
defineProps({
  category: Object,
  selected: Boolean
})
</script>

<template>
  <q-chip
    :class="`q-ma-none ${!selected ? '' : 'text-on-color'}`"
    clickable
    :flat="selected"
    :outline="!selected"
    :color="color(category.total)"
  >
    <q-icon :name="category.icon" class="q-pr-xs"/>
    <span>${{ Math.abs(category.total.toFixed(2)) }}</span>
  </q-chip>
</template>
