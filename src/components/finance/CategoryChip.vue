<script setup>
import { color, formatBalance } from 'src/balance'
defineProps({
  category: Object,
  selected: Boolean
})
</script>

<template>
  <q-chip
    square
    :class="`q-ma-none ${!selected ? '' : 'text-on-color'} text-bold`"
    clickable
    :flat="selected"
    :outline="!selected"
    :color="color(category.total)"
  >
    <q-icon :name="category.icon" class="q-pr-sm"/>
    <q-space/>
    <span>{{ formatBalance(Math.abs(category.total)) }}</span>
  </q-chip>
</template>
src/balance
