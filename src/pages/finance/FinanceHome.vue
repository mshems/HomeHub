<script setup>
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import BalanceChip from 'src/components/finance/BalanceChip.vue'
import HorizontalStackedBar from 'src/components/charts/HorizontalStackedBar.vue'
// import CategorySpendingChart from 'src/components/charts/CategorySpendingChart.vue'

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { useTransactions } from 'src/composables/transactions'
// import { useCategories } from 'src/composables/categories'

const router = useRouter()
const { transactions: { data: transactions }, total, filter } = useTransactions()

const now = DateTime.local()
const txYearToDate = computed(() => filter(transactions.value, { after: now.startOf('year') }))
const savedYTD = computed(() => total(filter(txYearToDate.value, { type: 'credit' })))
const spentYTD = computed(() => total(filter(txYearToDate.value, { type: 'debit' })))

const txThisMonth = computed(() => filter(transactions.value, { month: now.month, year: now.year }))
const spentThisMonth = computed(() => total(filter(txThisMonth.value, { type: 'debit' })))
const savedThisMonth = computed(() => total(filter(txThisMonth.value, { type: 'credit' })))

</script>

<template>
  <finance-header/>
  <q-page padding class="container">
    <q-card class="hoverable cursor-pointer q-mb-sm" :balance="total(txYearToDate)">
      <q-card-section class="row items-center justify-between">
        <div class="text-bold text-default font-title" style="font-size: 2rem;">
          YTD {{ now.year }}
          <span style="font-size: 0.8rem;"></span>
        </div>
        <balance-chip
          icon="mdi-finance"
          :balance="total(txYearToDate)"
        />
      </q-card-section>
      <q-card-section>
        <horizontal-stacked-bar
          title="Year to Date"
          :datasets="[
            { label: 'Spent', value: Math.abs(spentYTD), color: 'debit' },
            { label: 'Saved', value: savedYTD, color: 'credit' }
          ]"
        />
      </q-card-section>
    </q-card>

    <q-card
      class="q-mb-sm hoverable cursor-pointer"
      :balance="total(txThisMonth)"
      @click="router.push('/finance/transactions')">
      <q-card-section class="row items-center justify-between">
        <div class="text-bold text-default font-title" style="font-size: 2rem;">
          {{ now.monthLong }}
          <span style="font-size: 0.8rem;"></span>
        </div>
        <balance-chip
          icon="mdi-finance"
          :balance="total(txThisMonth)"
        />
      </q-card-section>
      <q-card-section>
        <horizontal-stacked-bar
          :title="now.monthLong"
          :datasets="[
            { label: 'Spent', value: Math.abs(spentThisMonth), color: 'debit' },
            { label: 'Saved', value: savedThisMonth, color: 'credit' }
          ]"
        />
        <!-- <category-spending-chart
          title="Categories"
          :datasets="monthlyCategoryDatasets || []"
        /> -->
      </q-card-section>
    </q-card>
  </q-page>
</template>
