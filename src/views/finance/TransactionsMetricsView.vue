<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { useRouter } from 'vue-router'

import MonthHeader from '@/components/finance/MonthHeader.vue'
import UserBalanceMiniCard from '@/components/finance/UserBalanceMiniCard.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDateProps } from '@/composables/dateProps'
import { useFilters } from '@/composables/filters'
import { useFilteredTransactions } from '@/composables/transactions'
import { getTransactionsList } from '@/composables/transactions'
import { getUser } from '@/composables/users'
import { formatBalance } from '@/lib/balance'

const router = useRouter()
const props = defineProps({
  m: {
    type: [Number],
    default: DateTime.local().month
  },
  y: {
    type: [Number],
    default: DateTime.local().year
  }
})

const { month, year, date } = useDateProps(props)
const transactions = getTransactionsList()
const cstone = getUser('cstone')
const mshems = getUser('mshems')

const { transactions: monthTx, total } = useFilteredTransactions(
  transactions,
  useFilters({
    byMonth: { month, year }
  }).filters
)

const { transactions: cstone_tx, total: cstone_total } = useFilteredTransactions(
  monthTx,
  useFilters({ byUser: { user_id: 'cstone' } }).filters
)
const { transactions: cstone_spending, total: cstone_spending_total } = useFilteredTransactions(
  cstone_tx,
  useFilters({ byCredit: { credit: false } }).filters
)
const { transactions: cstone_income, total: cstone_income_total } = useFilteredTransactions(
  cstone_tx,
  useFilters({ byCredit: { credit: true } }).filters
)

const { transactions: mshems_tx, total: mshems_total } = useFilteredTransactions(
  monthTx,
  useFilters({ byUser: { user_id: 'mshems' } }).filters
)
const { transactions: mshems_spending, total: mshems_spending_total } = useFilteredTransactions(
  mshems_tx,
  useFilters({ byCredit: { credit: false } }).filters
)
const { transactions: mshems_income, total: mshems_income_total } = useFilteredTransactions(
  mshems_tx,
  useFilters({ byCredit: { credit: true } }).filters
)
</script>

<template>
  <div class="container flex max-w-[800px] flex-col gap-3 py-8">
    <MonthHeader
      :date="date"
      @onChange="(date) => router.push({ query: { m: date.month, y: date.year } })"
    />

    <div class="mt-3 flex flex-row flex-wrap gap-3">
      <Card
        class="bg-secondary text-secondary-foreground hover:bg-secondary-focus"
        @click="router.push('/finance/transactions?m=' + month + '&y=' + year)"
      >
        <div class="flex flex-row items-center gap-3 py-3 pl-3 pr-5">
          <ChevronLeft />
          Transactions
        </div>
      </Card>
    </div>

    <Card>
      <CardHeader class="pb-2 font-title text-xl font-semibold">
        <CardTitle>Metrics</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 pt-3">
        <div class="grid grid-cols-2 gap-3">
          <div></div>
          <div></div>
        </div>
        <!-- <div class="flex flex-row flex-wrap gap-3">
          <UserBalanceMiniCard :balance="cstone_income_total" :user="cstone!!" />
          <UserBalanceMiniCard :balance="mshems_income_total" :user="mshems!!" />
        </div>
        <div class="flex flex-row flex-wrap gap-3">
          <UserBalanceMiniCard :balance="cstone_spending_total" :user="cstone!!" />
          <UserBalanceMiniCard :balance="mshems_spending_total" :user="mshems!!" />
        </div> -->
        Difference (C - M):
        <div>{{ formatBalance(cstone_spending_total - mshems_spending_total) }}</div>
      </CardContent>
    </Card>
  </div>
</template>
