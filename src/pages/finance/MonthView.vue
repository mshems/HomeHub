<script setup>
import NavChip from 'src/components/NavChip.vue'
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import TransactionsHeader from 'src/components/finance/TransactionsHeader.vue'
import UserBalanceCard from 'src/components/finance/UserBalanceCard.vue'
import BalanceCard from 'src/components/finance/BalanceCard.vue'

import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'
import { useCategories } from 'src/composables/categories'
import { useUserStore } from 'src/stores/user'
import { DateTime } from 'luxon'

const props = defineProps({
  m: {
    type: Number,
    default: DateTime.local().month
  },
  y: {
    type: Number,
    default: DateTime.local().year
  }
})

const router = useRouter()

const user = useUserStore()
const { transactions: { data: transactions }, total, filter } = useTransactions()

const monthlyTx = computed(() => filter(transactions, { month: props.m, year: props.y }))
const monthlyTotal = computed(() => (total(monthlyTx)))
const wantsTotal = computed(() => (total(filter(monthlyTx, { categoryType: 'want' }))))
const needsTotal = computed(() => (total(filter(monthlyTx, { categoryType: 'need' }))))

const { users } = useUsers(monthlyTx)
const { categories } = useCategories(monthlyTx)

</script>

<template>
  <finance-header>
    <nav-chip path="/finance/transactions" icon="mdi-credit-card-multiple" label="Transactions"/>
    <nav-chip path="/finance/month" icon="mdi-calendar" label="Details"/>
  </finance-header>

  <q-page class="container" padding style="padding-bottom: 80px;">
    <template v-if="user.authorized">
      <transactions-header
        :date="DateTime.fromObject({ month: props.m, year: props.y })"
        :transactions="monthlyTx"
        @prev="() => router.replace(`/finance/month?m=${DateTime.fromObject({ month: props.m, year: props.y }).minus({ months: 1 }).month}&y=${DateTime.fromObject({ month: props.m, year: props.y }).minus({ months: 1 }).year}`)"
        @next="() => router.replace(`/finance/month?m=${DateTime.fromObject({ month: props.m, year: props.y }).plus({ months: 1 }).month}&y=${DateTime.fromObject({ month: props.m, year: props.y }).plus({ months: 1 }).year}`)"
        @current="() => router.replace('/finance/month')"
      />
      <div class="text-muted q-mt-md q-px-xs">Overview</div>
      <div class="row q-mt-none q-gutter-sm">
        <balance-card :balance="monthlyTotal"/>
        <template v-for="user in users" :key="user.id">
          <user-balance-card :user="user"/>
        </template>
      </div>

      <div class="row q-mt-none q-gutter-sm">
        <balance-card caption="Wants" icon="mdi-shopping" :balance="wantsTotal"/>
        <balance-card caption="Needs" icon="mdi-toolbox" :balance="needsTotal"/>
      </div>

      <div class="text-muted q-mt-md q-px-xs">Categories</div>
      <div class="row q-mt-none q-col-gutter-xs">
        <template v-for="category in categories" :key="category.id">
          <div class="col-4 col-sm-3 col-md-3 col-lg-2">
            <balance-card class="text-capitalize"
              :balance="category.total"
              :caption="category.name"
            >
              <template #side>
                <q-icon :name="category.icon" :color="category.color"/>
              </template>
            </balance-card>
          </div>
        </template>
      </div>

      <div flat class="rounded q-mt-sm q-pa-xs">
      </div>
    </template>
  </q-page>
</template>
