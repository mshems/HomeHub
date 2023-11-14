<script setup>
import BalanceChip from 'src/components/finance/BalanceChip.vue'

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactions } from 'src/composables/transactions'
import { DateTime } from 'luxon'

const router = useRouter()
const {
  transactions: { data: transactions },
  total,
  filter
} = useTransactions()

const now = DateTime.local()
const txYearToDate = computed(() => filter(transactions.value, { after: now.startOf('year') }))
const txThisMonth = computed(() => filter(transactions.value, { month: now.month, year: now.year }))
</script>

<template>
  <q-page padding>
    <q-card :class="`q-mb-sm ${total(txYearToDate) >= 0 ? 'credit' : 'debit'}-hover`">
      <q-card-section class="text-white">
        <div class="text-bold text-primary subtitle" style="font-size: 2rem;">
          {{ now.year }}
          <span style="font-size: 0.8rem;"></span>
        </div>
        <balance-chip
          icon="mdi-finance"
          :balance="total(txYearToDate)"
        />
      </q-card-section>
    </q-card>

    <q-card
      :class="`q-mb-sm cursor-pointer ${total(txThisMonth) >= 0 ? 'credit' : 'debit'}-hover`"
      @click="router.push('/finance/transactions')">
      <q-card-section class="text-white">
        <div class="text-bold text-primary subtitle" style="font-size: 2rem;">
          {{ now.monthLong }}
          <span style="font-size: 0.8rem;"></span>
        </div>
        <balance-chip
          icon="mdi-finance"
          :balance="total(txThisMonth)"
        >
          ${{ Math.abs(total(txThisMonth)).toFixed(2) }}
        </balance-chip>
      </q-card-section>
    </q-card>
  </q-page>
</template>
