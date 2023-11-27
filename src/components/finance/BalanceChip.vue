<script setup>
import { color, formatBalance } from 'src/composables/balance'
const props = defineProps({
  balance: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: 'mdi-finance'
  }
})
</script>

<template>
  <q-chip
    class="q-ma-none text-on-color"
    text-color="text-on-color"
    :color="color(props.balance)"
    :icon="icon"
    :label="formatBalance(Math.abs(props.balance))"
  />
</template>
