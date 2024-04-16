<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'

import BalanceCard from 'src/components/finance/BalanceCard.vue'
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import TransactionsHeader from 'src/components/finance/tx/TransactionsHeader.vue'
import UserBalanceCard from 'src/components/finance/UserBalanceCard.vue'
import NavChip from 'src/components/NavChip.vue'
import { useCategories } from 'src/composables/categories'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'
import { useUserStore } from 'src/stores/user'
// import HorizontalStackedBar from 'src/components/charts/HorizontalStackedBar.vue'

const props = defineProps({
  m: {
    type: [String, Number],
    default: DateTime.local().month
  },
  y: {
    type: [String, Number],
    default: DateTime.local().year
  }
})

const month = ref(Number.parseInt(props.m))
const year = ref(Number.parseInt(props.y))
const date = computed(() => DateTime.fromObject({ month: month.value, year: year.value }))
watch(() => ({ ...props }), (p) => {
  month.value = p.m
  year.value = p.y
})

const router = useRouter()

const user = useUserStore()
const { transactions: { data: transactions }, useFilters } = useTransactions()

const { tx: monthlyTx, total: monthlyTotal } = useFilters(transactions, { month, year })
const { total: wantsTotal } = useFilters(monthlyTx, { categoryType: 'want' })
const { total: needsTotal } = useFilters(monthlyTx, { categoryType: 'need' })
const { total: incomeTotal } = useFilters(monthlyTx, { category: 'income' })

const { users } = useUsers(monthlyTx)
const { categories } = useCategories(monthlyTx)

</script>

<template>
  <finance-header>
    <nav-chip
      path="/finance/transactions"
      icon="mdi-credit-card-multiple"
      label="Transactions"
    />
    <nav-chip
      path="/finance/month"
      icon="mdi-calendar"
      label="Details"
    />
  </finance-header>

  <q-page
    class="container"
    padding
    style="padding-bottom: 80px;"
  >
    <template v-if="user.authorized">
      <transactions-header
        :date="DateTime.fromObject({ month: props.m, year: props.y })"
        :transactions="monthlyTx"
        @prev="() => router.replace(`/finance/month?m=${date.minus({ months: 1 }).month}&y=${date.minus({ months: 1 }).year}`)"
        @next="() => router.replace(`/finance/month?m=${date.plus({ months: 1 }).month}&y=${date.plus({ months: 1 }).year}`)"
        @current="() => router.replace('/finance/month')"
      />
      <div class="text-muted q-mt-md q-px-xs">
        Overview
      </div>
      <div class="row q-mt-none q-gutter-sm">
        <balance-card :balance="monthlyTotal" />
        <template
          v-for="u in users"
          :key="u.id"
        >
          <user-balance-card
            :class="`cursor-pointer hoverable`"
            :user="u"
            @click="router.push(`/finance/users/${u.id}`)"
          />
        </template>
      </div>

      <div class="row q-mt-none q-gutter-sm">
        <balance-card
          caption="Wants"
          icon="mdi-shopping"
          :balance="wantsTotal"
        />
        <balance-card
          caption="Needs"
          icon="mdi-toolbox"
          :balance="needsTotal"
        />
        <balance-card
          caption="Saved"
          icon="mdi-piggy-bank"
          :absolute="false"
          :balance="(needsTotal + wantsTotal) + incomeTotal"
        />
      </div>

      <!-- <HorizontalStackedBar
        class="q-mt-md"
        title="Wants/Needs"
        displayPercentage
        :datasets="[
          { label: 'Wants', value: Math.abs(wantsTotal), color: 'debit' },
          { label: 'Needs', value: Math.abs(needsTotal), color: 'warning' },
          ...(monthlyTotal > 0 ? [{ label: 'Saved', value: Math.abs(monthlyTotal), color: 'credit' }] : [])
        ]"
      /> -->

      <div class="text-muted q-mt-md q-px-xs">
        Categories
      </div>
      <div class="row q-mt-none q-col-gutter-xs">
        <template
          v-for="category in categories"
          :key="category.id"
        >
          <div class="col-4 col-sm-3 col-md-3 col-lg-2">
            <balance-card
              class="text-capitalize"
              :balance="category.total"
              :caption="category.name"
            >
              <template #side>
                <q-icon :name="category.icon" />
              </template>
            </balance-card>
          </div>
        </template>
      </div>

      <div
        flat
        class="rounded q-mt-sm q-pa-xs"
      />
    </template>
  </q-page>
</template>
