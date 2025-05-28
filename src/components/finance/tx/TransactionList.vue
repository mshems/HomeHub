<script setup lang="ts">
import TransactionListItem from './TransactionListItem.vue'
import { CircleAlert, LoaderCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { type ITransaction } from '@/lib/models'

defineProps<{
  transactions: ITransaction[]
  loading?: boolean
}>()

const router = useRouter()
</script>

<template>
  <div>
    <template v-for="t of transactions" :key="t.id">
      <TransactionListItem :transaction="t" @click="router.push(`/finance/transactions/${t.id}`)" />
    </template>
    <template v-if="loading">
      <div
        class="text-muted-foreground mx-auto flex w-fit items-center justify-center rounded-md px-3 py-5"
      >
        <LoaderCircle :size="24" class="text-muted-foreground mr-2 animate-spin" />
        Loading transactions...
      </div>
    </template>
    <template v-else-if="transactions.length === 0">
      <div
        class="text-muted-foreground mx-auto flex w-fit items-center justify-center rounded-md px-3 py-5"
      >
        <CircleAlert :size="18" class="text-warning-typography mr-2" />
        No transactions found
      </div>
    </template>
  </div>
</template>
