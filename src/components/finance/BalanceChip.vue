<script setup>
import { color, formatBalance } from 'src/balance'
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
    square
    class="q-ma-none text-on-color text-right text-bold"
    text-color="text-on-color"
    :color="color(props.balance)"
    :icon="icon"
    :label="formatBalance(Math.abs(props.balance))"
  />
</template>
src/balance
