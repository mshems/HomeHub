<script setup>
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import TransactionItem from 'src/components/finance/TransactionItem.vue'
import BalanceChip from 'src/components/finance/BalanceChip.vue'
import CategoryChip from 'src/components/finance/CategoryChip.vue'
import { computed, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'
import { useCategories } from 'src/composables/categories'
import { useUserStore } from 'src/stores/user'
import { useTxStore } from 'src/stores/tx'

const router = useRouter()
const user = useUserStore()
const store = useTxStore()
const { transactions: { data: transactions, pending }, total, filter } = useTransactions()

const monthlyTx = computed(() => filter(transactions.value, { month: store.date.month, year: store.date.year }))
const monthlyTotal = computed(() => (total(monthlyTx)))
const monthlyTxByUser = computed(() => filter(monthlyTx.value, { userId: selectedUserId.value }))

const { users } = useUsers(monthlyTx)
const selectedUserId = ref(null)

const onSelectUser = (user) => {
  if (selectedUserId.value === user.id) selectedUserId.value = null
  else selectedUserId.value = user.id
}

const selectedCategory = ref(null)
const { categories } = useCategories(monthlyTxByUser)

const onSelectCategory = (category) => {
  if (selectedCategory.value === category.name) selectedCategory.value = null
  else selectedCategory.value = category.name
}

const sortedTransactions = (tx, descending = true) => {
  if (descending) return unref(tx).sort((a, b) => a.timestamp - b.timestamp)
  else return unref(tx).sort((a, b) => b.timestamp - a.timestamp)
}
const displayedTransactions = computed(() => {
  return filter(
    monthlyTx.value,
    {
      userId: selectedUserId.value,
      category: selectedCategory.value
    }
  )
})

const isSelectedCategory = (category) => {
  return (selectedCategory.value === null) || (selectedCategory.value === category.name)
}

const isSelectedUser = (user) => {
  return ((selectedUserId.value === null) || (selectedUserId.value === user.id))
}

const onSwipeMonth = ({ evt, ...info }) => {
  if (info.direction === 'left') store.nextMonth()
  else store.prevMonth()
}

const expanded = ref(false)
const clearFilters = () => {
  selectedCategory.value = null
  selectedUserId.value = null
}
</script>

<template>
  <finance-header></finance-header>
  <q-page padding style="padding-bottom: 80px;">
    <q-banner avatar="mdi-alert" rounded class="bg-red-5" v-if="!user.authorized">
      <template v-slot:avatar>
        <q-icon name="mdi-alert-rhombus" color="white" />
      </template>
      <div class="text-bold text-white">Log in to view</div>
    </q-banner>

    <q-card v-else flat>
      <q-card-section class="card-title q-px-md">
        <div
          v-touch-swipe.mouse="onSwipeMonth"
          class="q-ma-none cursor-pointer row items-center justify-between no-wrap"
          style="font-size: 1.5rem;"
        >
          <div class="">{{ store.date.monthLong }} {{ store.date.year }}</div>
          <div class="gt-xs">
            <q-btn color="primary" dense flat icon="mdi-chevron-left" @click="store.prevMonth"/>
            <q-btn color="primary" dense flat icon="mdi-calendar" @click="store.currentMonth()"/>
            <q-btn color="primary" dense flat icon="mdi-chevron-right" @click="store.nextMonth"/>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-sm">
        <div class="row q-pt-sm q-px-sm">
          <div class="col-auto q-mr-xs">
            <balance-chip
              :balance="monthlyTotal"
              icon="mdi-finance"
              style="font-size: 0.8rem;"
            />
          </div>
          <template v-for="user, i in users" :key="i">
            <div class="col-auto q-mr-xs">
              <q-chip
                :class="`full-width q-ma-none ${!isSelectedUser(user) ? '' : 'text-on-color'}`"
                color="indigo-8"
                style="font-size: 0.8rem;"
                clickable
                :outline="!isSelectedUser(user)"
                @click="onSelectUser(user)"
              >
                <q-avatar
                  :text-color="!isSelectedUser(user) ? 'indigo-8' : 'text-on-color'"
                >
                  {{ user.name[0] }}
                </q-avatar>
                <span>${{ (user.total).toFixed(2) }}</span>
              </q-chip>
            </div>
          </template>
        </div>

      </q-card-section>
    </q-card>

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
              <template v-if="(selectedCategory || selectedUserId)">
                <q-chip
                  class="q-ma-none"
                  color="grey"
                  icon="mdi-filter"
                  removable
                  style="font-size: 0.8rem;"
                  @remove="clearFilters"
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
            <div class="row q-pt-sm q-px-sm">
              <template v-for="category, i in categories" :key="i">
                <div class="col-auto q-mr-xs q-mb-sm">
                  <category-chip
                    :category="category"
                    :selected="isSelectedCategory(category)"
                    @click="onSelectCategory(category)"
                    style="font-size: 0.8rem;"
                  />
                </div>
              </template>
            </div>
          </template>
        </q-expansion-item>
      </div>
      <q-linear-progress rounded indeterminate v-if="pending"/>
      <div v-if="displayedTransactions.length === 0">
        <q-item>
          <q-item-section>
            <q-item-label class="text-muted row items-center">
              <q-icon class="q-mr-sm" name="mdi-alert-circle" color="warning" size="sm"/>
              <span>No Matching Transactions</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <template v-else v-for="item in sortedTransactions(displayedTransactions, store.descending)" :key="item.id">
        <q-slide-item
          left-color="transparent"
          right-color="transparent"
          @left="router.push(`/finance/transactions/${item.id}/edit`)"
          class="q-mb-xs rounded"
        >
          <template #left>
            <div class="row items-center text-warning">
              <q-icon left name="mdi-pencil" color="warning"/>Edit
            </div>
          </template>
          <template #default>
            <transaction-item
              class="rounded"
              :item="item"
              :category="categories[item.category]"
              :user="users[item.paid_by]"
              @view="(i) => router.push('/finance/transactions/' + i.id)"
            />
          </template>
        </q-slide-item>
      </template>
    </div>

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
