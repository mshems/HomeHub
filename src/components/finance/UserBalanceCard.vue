<script setup>
import BalanceCard from './BalanceCard.vue'
import { color, formatBalance } from 'src/balance'

defineProps({
  user: Object
})
</script>

<template>
  <balance-card :balance="user.total">
    <q-item dense class="q-pa-sm">
      <q-item-section avatar class="col-shrink q-pr-md">
        <q-avatar size="sm" :color="user.color" class="text-on-color text-bold">
          {{ user.name[0] }}
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <!-- <q-item-label caption>
          Monthly Balance
        </q-item-label> -->
        <q-item-label :class="`text-on-${color(user.total)} text-right text-bold`" style="font-size: 0.8rem;">
          {{ formatBalance(Math.abs(user.total)) }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </balance-card>
</template>
