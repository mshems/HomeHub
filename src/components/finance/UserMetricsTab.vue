<script setup lang="ts">
import BalanceMiniCard from './BalanceMiniCard.vue'
import { PiggyBank, Wallet } from 'lucide-vue-next'
import type { Ref } from 'vue'
import { ref } from 'vue'

import { useFilters } from '@/composables/filters'
import { useFilteredTransactions } from '@/composables/transactions'
import type { IUser, ITransaction } from '@/lib/models'

const props = defineProps<{ user: IUser; tx: Ref<ITransaction[]> }>()
const { transactions: transactions } = useFilteredTransactions(
  ref(props.tx),
  useFilters({ byUser: { user_id: props.user.id } }).filters
)
const { total: spending_total } = useFilteredTransactions(
  transactions,
  useFilters({ byCredit: { credit: false } }).filters
)
const { total: income_total } = useFilteredTransactions(
  transactions,
  useFilters({ byCredit: { credit: true } }).filters
)
</script>

<template>
  <div class="flex flex-row flex-wrap gap-3">
    <BalanceMiniCard :balance="income_total">
      <PiggyBank />
    </BalanceMiniCard>
    <BalanceMiniCard :balance="spending_total">
      <Wallet />
    </BalanceMiniCard>
  </div>
</template>
