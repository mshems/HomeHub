<script setup>
import TransactionItem from './TransactionItem.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  transactions: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Object,
    default: () => ({})
  },
  users: {
    type: Object,
    default: () => ({})
  }
})
const onClickItem = (item) => {
  router.push(`/finance/transactions/${item.id}`)
}
</script>

<template>
  <div>
    <q-linear-progress rounded indeterminate v-if="loading"/>
    <div v-if="transactions.length === 0">
      <q-item>
        <q-item-section>
          <q-item-label class="text-muted row items-center">
            <q-icon class="q-mr-sm" name="mdi-alert-circle" color="warning" size="sm"/>
            <span>No Transactions</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <template v-else v-for="item, i in transactions" :key="i">
      <transaction-item
        class="rounded"
        :item="item"
        :category="categories[item.category]"
        :user="users[item.paid_by]"
        @view="onClickItem"
      />
    </template>
  </div>
</template>
