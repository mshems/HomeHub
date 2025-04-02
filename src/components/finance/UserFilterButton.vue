<script setup lang="ts">
import { Avatar, AvatarFallback } from '../ui/avatar'
import FilterButton from './FilterButton.vue'
import { computed, type Ref } from 'vue'

import { useFilters } from '@/composables/filters'
import { useFilteredTransactions } from '@/composables/transactions'
import type { ITransaction, IUser } from '@/lib/models'

const props = defineProps<{
  user: IUser
  transactions: Ref<ITransaction[]>
  active: boolean
}>()

const { transactions: userTx } = useFilteredTransactions(
  props.transactions,
  useFilters({
    byUser: { user_id: props.user.id }
  }).filters
)
</script>

<template>
  <FilterButton :value="user.id" :transactions="computed(() => userTx)" :active="active">
    <Avatar size="xs" class="mr-2 bg-primary">
      <AvatarFallback class="font-title font-semibold text-primary-foreground">{{
        user.name[0]
      }}</AvatarFallback>
    </Avatar>
  </FilterButton>
</template>
