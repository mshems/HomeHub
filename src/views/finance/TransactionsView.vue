<script setup lang="ts">
import { useSorted, useSwipe } from '@vueuse/core'
import { BanknoteArrowUp, BanknoteArrowDown, ChartLine, Plus } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import BalanceMiniCard from '@/components/finance/BalanceMiniCard.vue'
import MonthHeader from '@/components/finance/MonthHeader.vue'
import UserBalanceMiniCard from '@/components/finance/UserBalanceMiniCard.vue'
import TransactionFilters from '@/components/finance/tx/TransactionFilters.vue'
import TransactionList from '@/components/finance/tx/TransactionList.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategoriesList } from '@/composables/categories'
import { useDateProps } from '@/composables/dateProps'
import { useFilters } from '@/composables/filters'
import { useSwipeNavigation } from '@/composables/swipeNavigation'
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
const { transactions: displayedTx, total: displayedTotal } = useFilteredTransactions(
  monthTx,
  filterContext.filters
)
const sortedTransactions = useSorted(displayedTx, (a, b) => b.timestamp - a.timestamp)

// Swipe gesture handling
const containerEl = ref<HTMLElement>()
const contentEl = ref<HTMLElement>()
const { animateAndNavigate } = useSwipeNavigation(contentEl)

useSwipe(containerEl, {
  onSwipeEnd(e, direction) {
    if (direction === 'right') {
      // Swipe right - go to previous month
      const previousMonth = date.value.minus({ months: 1 })
      animateAndNavigate('right', () => {
        router.push({ query: { m: previousMonth.month, y: previousMonth.year } })
      })
    } else if (direction === 'left') {
      // Swipe left - go to next month
      const nextMonth = date.value.plus({ months: 1 })
      animateAndNavigate('left', () => {
        router.push({ query: { m: nextMonth.month, y: nextMonth.year } })
      })
    }
  }
})
</script>

<template>
  <div ref="containerEl" class="container flex max-w-[800px] flex-col gap-3 py-8">
    <MonthHeader
      :date="date"
      @onChange="(date) => router.push({ query: { m: date.month, y: date.year } })"
    />

    <div ref="contentEl" class="flex flex-col gap-3 overflow-hidden">
      <div class="mt-3 flex flex-row flex-wrap gap-3">
        <BalanceMiniCard :balance="total">
          <template v-if="total >= 0">
            <BanknoteArrowUp />
          </template>
          <template v-else>
            <BanknoteArrowDown />
          </template>
        </BalanceMiniCard>
        <template v-for="u of users" :key="u.id">
          <UserBalanceMiniCard :balance="useUserTransactions(u.id, ref(monthTx)).total" :user="u" />
        </template>

        <Button
          variant="secondary"
          size="iconxl"
          @click="router.push('/finance/transactions/metrics?m=' + month + '&y=' + year)"
        >
          <ChartLine />
        </Button>

        <Button variant="accent" size="iconxl" @click="router.push('/finance/transactions/edit')">
          <Plus />
        </Button>
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
          <div v-if="filterContext.hasFilters()" class="flex flex-row items-center gap-2">
            <Card class="bg-accent text-accent-foreground grow">
              <CardContent class="flex flex-row items-center justify-between gap-2 p-3">
                <div>{{ displayedTx.length }} transactions</div>
              </CardContent>
            </Card>
            <BalanceMiniCard :balance="displayedTotal">
              <template v-if="displayedTotal >= 0">
                <BanknoteArrowUp />
              </template>
              <template v-else>
                <BanknoteArrowDown />
              </template>
            </BalanceMiniCard>
          </div>

          <TransactionList :transactions="sortedTransactions" :loading="pending" />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
