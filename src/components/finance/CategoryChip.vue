<script setup>
import BalanceChip from './BalanceChip.vue'
defineProps({
  category: Object,
  selected: Boolean
})
</script>

<template>
  <balance-chip
    :balance="category.total"
    :class="`${!selected ? '' : 'text-on-color'}`"
    clickable
    :flat="selected"
    :outline="!selected"
  >
    <template #left>
      <q-icon :name="category.icon" class="q-pr-xs"/>
    </template>
  </balance-chip>
</template>
