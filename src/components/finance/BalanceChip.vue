<script setup>
import { computed } from 'vue'

const props = defineProps({
  balance: {
    type: Number,
    default: 0
  },
  icon: String
})
const color = computed(() => {
  if (props.balance === 0) return 'grey'
  return props.balance > 0 ? 'credit' : 'debit'
})
</script>

<template>
  <q-chip
    class="q-ma-none"
    :color="color"
    :icon="icon"
  >
    <slot name="left"></slot>
    <div class="full-width text-right">
      ${{ Math.abs(balance.toFixed(2)) }}
    </div>
    <slot name="right"></slot>
  </q-chip>
</template>
