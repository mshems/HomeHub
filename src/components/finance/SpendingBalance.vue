<script setup lang="ts">
import Avatar from '../ui/avatar/Avatar.vue'
import AvatarFallback from '../ui/avatar/AvatarFallback.vue'
import { Card } from '../ui/card'
import { MoveRight } from 'lucide-vue-next'
import type { Ref } from 'vue'
import { computed } from 'vue'

import { useFilters } from '@/composables/filters'
import { useFilteredTransactions } from '@/composables/transactions'
import { formatBalance } from '@/lib/balance'
import type { ITransaction } from '@/lib/models'

const props = defineProps<{
  tx: Ref<ITransaction[]>
}>()

const { total: mshems_spending_total } = useFilteredTransactions(
  props.tx,
  useFilters({
    byUser: { user_id: 'mshems' },
    byCredit: { credit: false },
    byNotCategory: { categories: ['transfer'] }
  }).filters
)
const { total: cstone_spending_total } = useFilteredTransactions(
  props.tx,
  useFilters({
    byUser: { user_id: 'cstone' },
    byCredit: { credit: false },
    byNotCategory: { categories: ['transfer'] }
  }).filters
)
const spending_diff = computed(() => {
  return Math.abs(cstone_spending_total.value) - Math.abs(mshems_spending_total.value)
})

const user_owed = computed(() => {
  return spending_diff.value < 0 ? 'mshems' : 'cstone'
})

const { total: total_transfer } = useFilteredTransactions(
  props.tx,
  useFilters({
    byCategory: { categories: ['transfer'] },
    byCredit: { credit: true }
  }).filters
)

const transfer_amount = computed(() => {
  return Math.abs(spending_diff.value) / 2 - total_transfer.value
})
</script>

<template>
  <div>
    <Card class="bg-accent text-accent-foreground w-fit">
      <div class="flex flex-row items-center gap-3 px-5 py-3">
        <span class="font-medium">
          {{ formatBalance(transfer_amount, true) }}
        </span>
        <MoveRight />
        <Avatar size="sm" class="bg-primary">
          <AvatarFallback class="font-title text-primary-foreground font-semibold capitalize">
            {{ user_owed[0] }}
          </AvatarFallback>
        </Avatar>
      </div>
    </Card>
  </div>
</template>
