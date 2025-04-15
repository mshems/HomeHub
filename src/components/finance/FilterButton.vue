<script setup lang="ts">
import { Button, type ButtonVariants } from '../ui/button'
import { computed, type Ref } from 'vue'

import { useFilters } from '@/composables/filters'
import { useFilteredTransactions } from '@/composables/transactions'
import { formatBalance } from '@/lib/balance'
import type { ITransaction } from '@/lib/models'

const emit = defineEmits(['toggle'])
const props = defineProps<{
  value: string
  transactions: Ref<ITransaction[]>
  active: boolean
}>()
const { total } = useFilteredTransactions(props.transactions, useFilters({}).filters)
const variant = computed(() => {
  if (total.value < 0) return props.active ? 'negative' : 'negativeoutline'
  if (total.value > 0) return props.active ? 'positive' : 'positiveoutline'
  else return props.active ? 'secondary' : 'secondaryoutline'
})
</script>

<template>
  <Button
    :variant="variant as ButtonVariants['variant']"
    @click="emit('toggle', value)"
    class="h-8 px-3 py-2"
  >
    <div class="flex w-full items-center justify-between text-sm">
      <slot />
      <div>{{ formatBalance(total, true) }}</div>
    </div>
  </Button>
</template>
