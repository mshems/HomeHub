<script setup>
import { color, formatBalance } from 'src/balance'
defineProps({
  balance: Number
})
</script>

<template>
  <q-card :class="`bg-${color(balance)}-bg`">
    <slot>
      <q-item>
        <q-item-section>
          <q-item-label>
            {{ formatBalance(Math.abs(balance)) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </slot>
  </q-card>
</template>
