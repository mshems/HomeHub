<script setup>
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

const store = useTxStore()
const {
  transactions: { data: transactions, pending },
  byMonth,
  total,
  filter
} = useTransactions()

const monthlyTx = computed(() => byMonth(transactions, store.date.month, store.date.year))
const monthlyTotal = computed(() => (total(monthlyTx.value)))

const user = useUserStore()
const { users, currentUser } = useUsers(monthlyTx)
const selectedUserId = ref(currentUser.id)
const onSelectUser = (userId) => {
  if (selectedUserId.value === userId) selectedUserId.value = null
  else selectedUserId.value = userId
}

const selectedCategory = ref(null)
const { categories } = useCategories(monthlyTx)
const onSelectCategory = (category) => {
  if (selectedCategory.value === category) selectedCategory.value = null
  else selectedCategory.value = category
}

const filteredTransactions = computed(() => {
  return filter(transactions.value, selectedUserId.value, selectedCategory.value, store.date.month, store.date.year)
})

const descending = ref(true)
const sortedTransactions = (tx, descending = true) => {
  if (descending) return unref(tx).sort((a, b) => a.timestamp - b.timestamp)
  else return unref(tx).sort((a, b) => b.timestamp - a.timestamp)
}

const isDeselected = (category) => {
  return (selectedCategory.value !== null) && (selectedCategory.value !== category)
}

const onSwipeMonth = ({ evt, ...info }) => {
  if (info.direction === 'left') store.nextMonth()
  else store.prevMonth()
}

const highlightColor = (amount) => {
  if (amount === 0) return 'grey'
  if (amount < 0) return 'credit'
  return 'debit'
}

const expanded = ref(false)
const clearFilters = () => {
  selectedCategory.value = null
  selectedUserId.value = null
}
</script>

<template>
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
      <q-card-section class="q-px-xs q-pt-sm q-pb-xs">
        <q-expansion-item
          v-model="expanded"
          dense
          header-class="q-px-none rounded"
          expand-icon-class="text-muted"
        >
          <template #header>
            <div class="q-pl-sm col-grow items-center row no-wrap">
              <balance-chip
                :balance="monthlyTotal"
                icon="mdi-finance"
                style="font-size: 0.8rem;"
              >
              </balance-chip>
              <template v-if="(selectedCategory || selectedUserId)">
                <q-space/>
                <q-chip
                  color="grey"
                  icon="mdi-filter"
                  removable
                  style="font-size: 0.8rem;"
                  @remove="clearFilters"
                />
              </template>
            </div>
          </template>

          <template #default>
            <div class="row q-pt-sm q-px-sm">
              <template v-for="user, i in users" :key="i">
                <div class="col-auto q-pl-xs q-pb-xs">
                  <q-chip
                    :class="`full-width q-ma-none ${selectedUserId === user.id ? '' : 'text-on-color'}`"
                    color="indigo-8"
                    style="font-size: 0.8rem;"
                    clickable
                    :outline="selectedUserId === user.id"
                    @click="(e) => { onSelectUser(user.id); e.stopPropagation() }"
                  >
                    <q-avatar :text-color="selectedUserId === user.id ? 'indigo-8' : 'white'">
                      {{ user.name[0] }}
                    </q-avatar>
                    <span>${{ Math.abs(user.total).toFixed(2) }}</span>
                  </q-chip>
                </div>
              </template>
            </div>
            <div class="row q-pt-sm q-px-sm">
              <template v-for="category, i in categories" :key="i">
                <div class="col-auto q-pl-xs q-pb-xs">
                  <category-chip
                    :category="category"
                    :selected="!isDeselected(category.name)"
                    @click="onSelectCategory(category.name)"
                    style="font-size: 0.8rem;"
                  />
                </div>
              </template>
            </div>
          </template>
        </q-expansion-item>
      </q-card-section>
    </q-card>

    <div flat class="tx-container rounded q-mt-sm q-pa-xs">

      <div class="row items-center no-wrap justify-between q-mt-sm q-px-md">
        <div class="text-bold text-default">Transactions</div>

        <div class="row items-center">
          <q-btn
            dense
            color="muted"
            flat
            :icon="descending ? 'mdi-sort-calendar-descending' : 'mdi-sort-calendar-ascending'"
            @click="descending = !descending"
          />
        </div>
      </div>

      <q-linear-progress rounded indeterminate v-if="pending"/>

      <template v-for="item in sortedTransactions(filteredTransactions, descending)" :key="item.id">
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
