<script setup>
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import BalanceChip from 'src/components/finance/BalanceChip.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { useTransactions } from 'src/composables/transactions'
import { useFilters } from 'src/filters'
import BalanceCard from 'src/components/finance/BalanceCard.vue'

const router = useRouter()
const { transactions: { data: transactions } } = useTransactions()

const now = DateTime.local()
const { total: ytdTotal } = useFilters(transactions, { after: now.startOf('year') })
const { total: thisMonthTotal } = useFilters(transactions, { month: now.month, year: now.year })
const months = ref([])

for (let i = 1; i <= 12; i++) {
  const { total } = useFilters(transactions, { month: now.minus({ month: i }).month, year: now.minus({ month: i }).year })
  months.value.push({
    date: now.minus({ month: i }),
    total
  })
}

</script>

<template>
  <finance-header/>
  <q-page padding class="container">
    <BalanceCard class="q-mb-sm">
      <q-card-section class="row items-center justify-between">
        <div :class="`text-bold font-title`" style="font-size: 2rem;">
          YTD {{ now.year }}
          <span style="font-size: 0.8rem;"></span>
        </div>
        <balance-chip
          icon="mdi-finance"
          :balance="ytdTotal"
        />
      </q-card-section>
    </BalanceCard>
    <BalanceCard
        class="q-mb-sm hoverable clickable cursor-pointer"
        :icon="null"
        @click="router.push(`/finance/transactions?m=${now.month}&y=${now.year}`)"
      >
        <q-card-section class="row items-center justify-between">
          <div :class="`text-bold font-title`" style="font-size: 2rem;">
            {{ now.monthLong }}
            <span style="font-size: 0.8rem;"></span>
          </div>
          <balance-chip
            icon="mdi-finance"
            :balance="thisMonthTotal"
          />
        </q-card-section>
      </BalanceCard>
    <div class="text-muted q-mt-md q-mb-sm q-px-xs" style="font-size: 1rem;" >Last 12 Months</div>
    <div class="row q-col-gutter-sm">
      <div v-for="m in months" :key="m.date" class="col-12 col-md-6">
        <q-card
          class="hoverable clickable cursor-pointer"
          :icon="null"
          :balance="m.total"
          @click="router.push(`/finance/transactions?m=${m.date.month}&y=${m.date.year}`)"
        >
          <q-card-section class="row items-center justify-between">
            <div :class="`text-bold text-default font-title`" style="font-size: 1.5rem;">
              {{ m.date.monthLong }}
              <span style="font-size: 0.8rem;"></span>
            </div>
            <balance-chip
              icon="mdi-finance"
              :balance="m.total"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
