<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { useSorted } from '@vueuse/core'

import BalanceCard from 'src/components/finance/BalanceCard.vue'
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import TransactionsFilters from 'src/components/finance/tx/TransactionsFilters.vue'
import TransactionsHeader from 'src/components/finance/tx/TransactionsHeader.vue'
import TransactionsList from 'src/components/finance/tx/TransactionsList.vue'
import UserBalanceCard from 'src/components/finance/UserBalanceCard.vue'
import NavChip from 'src/components/NavChip.vue'
import { useCategories } from 'src/composables/categories'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'
import { useTxStore } from 'src/stores/tx'
import { useUserStore } from 'src/stores/user'

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

const month = ref(props.m)
const year = ref(props.y)
const date = computed(() => DateTime.fromObject({ month: month.value, year: year.value }))
watch(() => ({ ...props }), (p) => {
  month.value = p.m
  year.value = p.y
})

const router = useRouter()
const user = useUserStore()
const store = useTxStore()
const { transactions: { data: transactions, pending }, useFilters } = useTransactions()
const { tx: monthlyTx, total: monthlyTotal } = useFilters(transactions, { month, year })
const { tx: monthlyTxByUser } = useFilters(monthlyTx, { userId: store.filters.userId })

const { users } = useUsers(monthlyTx)
const { categories } = useCategories(monthlyTxByUser)

const displayedTransactions = computed(() => {
  const { tx } = useFilters(
    monthlyTx,
    store.filters
  )
  if (store.descending) return useSorted(tx.value, (a, b) => a.timestamp - b.timestamp)
  else return useSorted(tx.value, (a, b) => b.timestamp - a.timestamp)
})

const expanded = ref(false)
</script>

<template>
  <finance-header>
    <nav-chip
      path="/finance/transactions"
      icon="mdi-credit-card-multiple"
      label="Transactions"
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
        @prev="() => router.replace(`/finance/transactions?m=${date.minus({ months: 1 }).month}&y=${date.minus({ months: 1 }).year}`)"
        @next="() => router.replace(`/finance/transactions?m=${date.plus({ months: 1 }).month}&y=${date.plus({ months: 1 }).year}`)"
        @current="() => router.replace('/finance/transactions')"
      />

      <div class="row q-mt-none q-gutter-sm">
        <balance-card
          class="col-grow col-sm-auto clickable hoverable cursor-pointer"
          :balance="monthlyTotal"
          @click="$router.push(`/finance/month?m=${date.month}&y=${date.year}`)"
        />
        <template
          v-for="u in users"
          :key="u.id"
        >
          <user-balance-card
            :class="`cursor-pointer hoverable`"
            :user="u"
            @click="router.push(`/finance/users/${user.id}`)"
          />
        </template>
      </div>
      <q-input
        v-model="store.filters.name"
        class="q-mt-sm on-background"
        clearable
        dense
        filled
      >
        <template #prepend>
          <q-icon
            name="mdi-magnify"
            class="cursor-pointer"
          />
        </template>
      </q-input>

      <div
        flat
        class="tx-container rounded q-mt-sm q-pa-xs"
      >
        <div class="row items-center">
          <q-expansion-item
            class="col-grow q-mb-xs"
            v-model="expanded"
            dense
            header-class="q-px-none rounded"
            expand-icon-class="text-muted"
          >
            <template #header>
              <div class="q-pl-sm col-grow items-center row no-wrap">
                <q-item-label class="text-bold">
                  Transactions
                </q-item-label>
                <q-space />
                <template v-if="store.hasFilters()">
                  <q-chip
                    class="q-ma-none"
                    icon="mdi-filter"
                    removable
                    style="font-size: 0.8rem;"
                    @remove="store.clearFilters()"
                  />
                </template>
                <q-icon
                  class="q-mx-sm"
                  dense
                  color="muted"
                  size="sm"
                  :name="store.descending ? 'mdi-sort-calendar-descending' : 'mdi-sort-calendar-ascending'"
                  @click="e=> {e.stopPropagation(); store.descending = !store.descending}"
                />
              </div>
            </template>

            <template #default>
              <transactions-filters
                :transactions="monthlyTxByUser"
                v-model:filters="store.filters"
              />
            </template>
          </q-expansion-item>
        </div>
        <transactions-list
          :loading="pending"
          :transactions="displayedTransactions"
          :categories="categories"
          :users="users"
        />
      </div>
    </template>

    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        icon="mdi-cash-plus"
        color="secondary"
        to="/finance/transactions/new"
      />
    </q-page-sticky>
  </q-page>
</template>

<style lang="scss">
.tx-container {
  background: white;
}

.body--dark {
  .tx-container {
    background: $dark;
  }
}
</style>
