<script setup>
import BalanceCard from './BalanceCard.vue'
import { color, formatBalance } from 'src/balance'

defineProps({
  user: Object
})
</script>

<template>
  <balance-card :balance="user.total">
    <q-item class="q-px-sm">
      <q-item-section avatar class="col-shrink q-pr-md">
        <q-avatar size="md" :color="user.color" class="text-on-color">{{ user.name[0] }}</q-avatar>
      </q-item-section>
      <q-item-section>
        <!-- <q-item-label caption>
          Monthly Balance
        </q-item-label> -->
        <q-item-label :class="`text-on-${color(user.total)}`">
          {{ formatBalance(Math.abs(user.total)) }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </balance-card>
</template>
