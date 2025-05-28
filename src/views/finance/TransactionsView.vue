<script setup lang="ts">
import { useSorted } from '@vueuse/core'
import { ChartLine, PiggyBank, Plus } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import BalanceMiniCard from '@/components/finance/BalanceMiniCard.vue'
import MonthHeader from '@/components/finance/MonthHeader.vue'
import UserBalanceMiniCard from '@/components/finance/UserBalanceMiniCard.vue'
import TransactionFilters from '@/components/finance/tx/TransactionFilters.vue'
import TransactionList from '@/components/finance/tx/TransactionList.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategoriesList } from '@/composables/categories'
import { useDateProps } from '@/composables/dateProps'
import { useFilters } from '@/composables/filters'
import { getTransactionsList, useFilteredTransactions } from '@/composables/transactions'
import { getUsersList, useUserTransactions } from '@/composables/users'

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
const users = getUsersList()
const { data: transactions, pending } = getTransactionsList()
const categories = getCategoriesList()

const { transactions: monthTx, total } = useFilteredTransactions(
  transactions,
  useFilters({
    byMonth: { month, year }
  }).filters
)

const filterContext = useFilters({})
const { transactions: displayedTx } = useFilteredTransactions(monthTx, filterContext.filters)
const sortedTransactions = useSorted(displayedTx, (a, b) => b.timestamp - a.timestamp)
</script>

<template>
  <div class="container flex max-w-[800px] flex-col gap-3 py-8">
    <MonthHeader
      :date="date"
      @onChange="(date) => router.push({ query: { m: date.month, y: date.year } })"
    />

    <div class="mt-3 flex flex-row flex-wrap gap-3">
      <BalanceMiniCard :balance="total">
        <PiggyBank />
      </BalanceMiniCard>
      <template v-for="u of users" :key="u.id">
        <UserBalanceMiniCard :balance="useUserTransactions(u.id, ref(monthTx)).total" :user="u" />
      </template>
      <Card
        class="bg-secondary text-secondary-foreground hover:bg-secondary-focus"
        @click="router.push('/finance/transactions/metrics?m=' + month + '&y=' + year)"
      >
        <div class="flex flex-row items-center gap-3 px-5 py-3">
          <ChartLine />
        </div>
      </Card>
      <Card
        class="bg-accent text-accent-foreground hover:bg-accent-focus"
        @click="router.push('/finance/transactions/edit')"
      >
        <div class="flex flex-row items-center gap-3 px-5 py-3">
          <Plus />
        </div>
      </Card>
    </div>

    <Card>
      <CardHeader class="font-title pb-2 text-xl font-semibold">
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-2 px-2">
        <TransactionFilters
          :tx="monthTx"
          :users="users"
          :categories="categories"
          :filterContext="filterContext"
        />
        <TransactionList :transactions="sortedTransactions" :loading="pending" />
      </CardContent>
    </Card>
  </div>
</template>
