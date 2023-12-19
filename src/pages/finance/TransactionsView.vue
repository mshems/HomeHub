<script setup>
import NavChip from 'src/components/NavChip.vue'
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import TransactionsHeader from 'src/components/finance/TransactionsHeader.vue'
import TransactionsFilters from 'src/components/finance/TransactionsFilters.vue'
import TransactionsList from 'src/components/finance/TransactionsList.vue'
import UserBalanceCard from 'src/components/finance/UserBalanceCard.vue'
import BalanceCard from 'src/components/finance/BalanceCard.vue'

import { computed, ref, unref } from 'vue'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'
import { useCategories } from 'src/composables/categories'
import { useUserStore } from 'src/stores/user'
import { useTxStore } from 'src/stores/tx'

const user = useUserStore()
const store = useTxStore()
const { transactions: { data: transactions, pending }, total, filter } = useTransactions()

const monthlyTx = computed(() => filter(transactions.value, { month: store.date.month, year: store.date.year }))
const monthlyTotal = computed(() => (total(monthlyTx)))
const monthlyTxByUser = computed(() => filter(monthlyTx.value, { userId: store.filters.userId }))

const { users } = useUsers(monthlyTx)

const onSelectUser = (user) => {
  if (store.filters.userId === user.id) store.filters.userId = null
  else store.filters.userId = user.id
}

const { categories } = useCategories(monthlyTxByUser)

const displayedTransactions = computed(() => {
  const txs = filter(
    monthlyTx.value,
    {
      userId: store.filters.userId,
      category: store.filters.category
    }
  )
  if (store.descending) return unref(txs).sort((a, b) => a.timestamp - b.timestamp)
  else return unref(txs).sort((a, b) => b.timestamp - a.timestamp)
})

const expanded = ref(false)
</script>

<template>
  <finance-header>
    <nav-chip path="/finance/transactions" icon="mdi-credit-card-multiple" label="Transactions"/>
  </finance-header>

  <q-page class="container" padding style="padding-bottom: 80px;">
    <template v-if="user.authorized">
      <transactions-header
        :date="store.date"
        :transactions="monthlyTx"
        @prev="store.prevMonth"
        @next="store.nextMonth"
        @current="store.currentMonth"
      />

      <div class="row q-mt-none q-gutter-sm">
        <balance-card class="col-grow col-sm-auto" :balance="monthlyTotal"/>
        <template v-for="user in users" :key="user.id">
          <user-balance-card
            :bordered="store.filters.userId === user.id"
            :class="`cursor-pointer hoverable`"
            :user="user"
            @click="onSelectUser(user)"
          />
        </template>
      </div>

      <div flat class="tx-container rounded q-mt-sm q-pa-xs">
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
                <q-item-label class="text-bold">Transactions</q-item-label>
                <q-space/>
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

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="mdi-cash-plus" color="secondary" to="/finance/transactions/new"/>
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
