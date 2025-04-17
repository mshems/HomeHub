<script setup lang="ts">
import { useSorted } from '@vueuse/core'
import { ChartLine, CircleAlert, FilterX, LoaderCircle, PiggyBank, Plus } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { computed, ref, unref } from 'vue'
import { useRouter } from 'vue-router'

import BalanceMiniCard from '@/components/finance/BalanceMiniCard.vue'
import CategoryFilterButton from '@/components/finance/CategoryFilterButton.vue'
import MonthHeader from '@/components/finance/MonthHeader.vue'
import TransactionListItem from '@/components/finance/TransactionListItem.vue'
import UserBalanceMiniCard from '@/components/finance/UserBalanceMiniCard.vue'
import UserFilterButton from '@/components/finance/UserFilterButton.vue'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import { getCategoriesList } from '@/composables/categories'
import { useDateProps } from '@/composables/dateProps'
import { useFilters } from '@/composables/filters'
import { getTransactionsList, useFilteredTransactions } from '@/composables/transactions'
import { getUsersList } from '@/composables/users'
import { useUserTransactions } from '@/composables/users'

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

const { filters, hasFilter, setFilter, deleteFilter, swoggleFilter, clearFilters } = useFilters({})
const { transactions: displayedTx } = useFilteredTransactions(monthTx, filters)

const toggleCategory = (id: string) => {
  if (hasFilter('byCategory')) {
    if (filters.value.byCategory?.categories.includes(id)) {
      setFilter('byCategory', {
        categories: filters.value.byCategory.categories.filter((c) => c !== id)
      })
      if (filters.value.byCategory.categories.length === 0) {
        deleteFilter('byCategory')
      }
    } else if (filters.value.byCategory?.categories) {
      setFilter('byCategory', {
        categories: [...filters.value.byCategory.categories, id]
      })
    }
  } else {
    setFilter('byCategory', { categories: [id] })
  }
}
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
        <Accordion type="single" collapsible>
          <AccordionItem value="categories">
            <AccordionTrigger>
              <div class="flex w-full items-center justify-between pr-3 pl-1">
                <div class="py-2">Filters</div>
                <Button
                  v-if="hasFilter('byCategory') || hasFilter('byUser')"
                  variant="accent"
                  class="h-8 px-2"
                  @click.stop="clearFilters"
                >
                  <FilterX class="size-6" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent class="space-y-2 pb-0">
              <div class="flex flex-wrap gap-2">
                <template v-for="u in users" :key="u.id">
                  <UserFilterButton
                    :active="
                      !hasFilter('byUser') || unref(filters.byUser?.user_id) === u.id || false
                    "
                    :user="u"
                    :transactions="computed(() => monthTx)"
                    @toggle="(v) => swoggleFilter('byUser', { user_id: v })"
                  />
                </template>
              </div>
              <div class="flex flex-wrap gap-2">
                <template v-for="c in categories" :key="c.id">
                  <CategoryFilterButton
                    :active="
                      !hasFilter('byCategory') ||
                      unref(filters.byCategory?.categories)?.includes(c.id) ||
                      false
                    "
                    :category="c"
                    :transactions="computed(() => monthTx)"
                    @toggle="toggleCategory(c.id)"
                  />
                </template>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <template
          v-for="t of useSorted(displayedTx, (a, b) => b.timestamp - a.timestamp).value"
          :key="t.id"
        >
          <TransactionListItem
            :transaction="t"
            @click="router.push(`/finance/transactions/${t.id}`)"
          />
        </template>
        <template v-if="pending">
          <div
            class="text-muted-foreground mx-auto flex w-fit items-center justify-center rounded-md px-3 py-5"
          >
            <LoaderCircle :size="24" class="text-muted-foreground mr-2 animate-spin" />
            Loading transactions...
          </div>
        </template>
        <template v-else-if="displayedTx.length === 0">
          <div
            class="text-muted-foreground mx-auto flex w-fit items-center justify-center rounded-md px-3 py-5"
          >
            <CircleAlert :size="18" class="text-warning-typography mr-2" />
            No transactions found
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
