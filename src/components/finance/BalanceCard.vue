<script setup>
import { color, formatBalance } from 'src/balance'
defineProps({
  balance: Number,
  bordered: Boolean,
  loading: Boolean
})
</script>

<template>
  <q-card flat :class="`bg-${color(balance)}-bg ${bordered ? ('bordered border-' + color(balance)) : 'bordered border-transparent'}`">
    <slot>
      <q-item dense class="q-pa-sm">
        <q-item-section side class="q-pr-sm">
          <slot name="side">
            <q-icon name="mdi-finance" :class="`text-on-${color(balance)}`" />
          </slot>
        </q-item-section>
        <q-item-section>
          <q-item-label :class="`text-on-${color(balance)} text-right text-bold`" style="font-size: 0.8rem;">
            {{ formatBalance(Math.abs(balance)) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </slot>
  </q-card>
</template>
