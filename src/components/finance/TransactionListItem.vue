<script setup lang="ts">
import Card from '../ui/card/Card.vue'
import CardContent from '../ui/card/CardContent.vue'
import CategoryIcon from '../ui/icon/CategoryIcon.vue'
import { StickyNote } from 'lucide-vue-next'
import { DateTime } from 'luxon'

import { getCategory } from '@/composables/categories'
import { getUser } from '@/composables/users'
import { formatBalance } from '@/lib/balance'
import { balanceType } from '@/lib/balance'
import type { ITransaction } from '@/lib/models'
import { cn } from '@/lib/utils'
import { balanceTextVariants } from '@/lib/variants'

const props = defineProps<{
  transaction: ITransaction
}>()
const user = getUser(props.transaction.paid_by)
const category = getCategory(props.transaction.category)
const type = balanceType(props.transaction.amount)
</script>

<template>
  <Card :hoverable="true">
    <CardContent class="flex flex-row justify-between p-3 font-sans">
      <div class="flex flex-row items-center gap-3">
        <template v-if="category">
          <CategoryIcon
            :category="category.id"
            :class="`mr-1 size-6 sm:mr-3 sm:size-7 text-[${category.color}]`"
          />
        </template>
        <div>
          <div>
            {{ transaction.name }}
          </div>
          <div class="flex items-center font-serif text-sm text-muted-foreground">
            {{ DateTime.fromSeconds(transaction.timestamp).toLocaleString() }}
            <StickyNote v-if="transaction.notes" class="ml-2 text-muted-foreground" :size="14" />
          </div>
        </div>
      </div>
      <div class="text-right">
        <div :class="cn(balanceTextVariants({ variant: type }), 'font-medium')">
          {{ formatBalance(transaction.amount, true) }}
        </div>
        <div class="ellipsis font-serif text-sm text-muted-foreground">
          {{ user?.name }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>
