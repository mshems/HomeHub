<script setup>
import { watch, ref, computed } from 'vue'
import NavChip from 'src/components/NavChip.vue'
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import TransactionsHeader from 'src/components/finance/tx/TransactionsHeader.vue'
import BalanceCard from 'src/components/finance/BalanceCard.vue'

import { useRouter } from 'vue-router'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'
import { useUserStore } from 'src/stores/user'
import { DateTime } from 'luxon'

const props = defineProps({
  id: {
    type: String
  },
  m: {
    type: Number,
    default: DateTime.local().month
  },
  y: {
    type: Number,
    default: DateTime.local().year
  }
})

const month = ref(props.m)
const year = ref(props.y)
const date = computed(() => DateTime.fromObject({ month: month.value, year: year.value }))
watch(() => ({ ...props }), (p) => {
  month.value = p.m
  year.value = p.y
})

const router = useRouter()
const userStore = useUserStore()
const { transactions: { data: transactions }, useFilters } = useTransactions()
const { tx: monthlyTx, total: monthlyTotal } = useFilters(transactions, { month, year, userId: props.id })
const { total: creditsTotal } = useFilters(monthlyTx, { type: 'credit' })
const { total: debitsTotal } = useFilters(monthlyTx, { type: 'debit' })

const { users } = useUsers(monthlyTx)
const user = computed(() => users.value[props.id])

</script>

<template>
  <finance-header>
    <nav-chip path="/finance/transactions" icon="mdi-credit-card-multiple" label="Transactions"/>
    <nav-chip :path="`/finance/users/${id}`" icon="mdi-account" label="Details"/>
  </finance-header>

  <q-page class="container" padding style="padding-bottom: 80px;">
    <template v-if="userStore.authorized">
      <transactions-header
        :date="DateTime.fromObject({ month: props.m, year: props.y })"
        :transactions="monthlyTx"
        @prev="() => router.replace(`/finance/users/${id}?m=${date.minus({ months: 1 }).month}&y=${date.minus({ months: 1 }).year}`)"
        @next="() => router.replace(`/finance/users/${id}?m=${date.plus({ months: 1 }).month}&y=${date.plus({ months: 1 }).year}`)"
        @current="() => router.replace(`/finance/users/${id}`)"
      />
      <div class="text-muted q-mt-md q-px-xs">{{ user?.name }}</div>
      <div class="row q-mt-none q-gutter-sm">
        <balance-card
          class="col-grow col-sm-auto"
          :balance="monthlyTotal"
        />
        <balance-card
          class="col-grow col-sm-auto"
          :balance="creditsTotal"
          type="credit"
          icon="mdi-cash-plus"
          caption="Income"
        />
        <balance-card
          class="col-grow col-sm-auto"
          :balance="debitsTotal"
          type="debit"
          icon="mdi-cash-minus"
          caption="Spending"
        />

      </div>
    </template>
  </q-page>
</template>
