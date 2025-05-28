<script setup lang="ts">
import { Calendar, Pencil, StickyNote, Tag, User } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import AutoBreadcrumbs from '@/components/ui/breadcrumb/AutoBreadcrumbs.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle
} from '@/components/ui/card'
import DeleteDialog from '@/components/ui/dialog/DeleteDialog.vue'
import CategoryIcon from '@/components/ui/icon/CategoryIcon.vue'
import { useTransactionDetails, useTransactions } from '@/composables/transactions'
import { formatBalance } from '@/lib/balance'
import { cn } from '@/lib/utils'
import { balanceVariants } from '@/lib/variants'

const router = useRouter()
const props = defineProps({
  id: {
    type: [String],
    required: true
  }
})
const { data: tx, user, date, dateTime, category, type } = useTransactionDetails(props.id)
const { remove } = useTransactions()

const onDelete = () => {
  remove(props.id).then(() => router.push('/finance/transactions'))
}
</script>
<template>
  <div class="container flex max-w-[800px] flex-col gap-5 py-8">
    <AutoBreadcrumbs
      :page="tx?.name || 'Details'"
      :items="{ Transactions: `/finance/transactions?m=${dateTime?.month}&y=${dateTime?.year}` }"
      no-dashboard
    />

    <Card
      :class="
        cn(balanceVariants({ variant: type }), 'font-title rounded-lg p-8 text-4xl font-semibold')
      "
    >
      <div class="flex items-center justify-between">
        <div>
          <CategoryIcon
            no-color
            :category="category?.id || ''"
            :class="cn(balanceVariants({ variant: type }), 'size-10')"
          />
        </div>
        <div>
          {{ formatBalance(tx?.amount || 0, true) }}
        </div>
      </div>
    </Card>

    <Card v-if="tx" class="relative">
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent class="space-y-5 text-base">
        <div class="flex flex-wrap gap-2">
          <Button
            variant="warning"
            @click="() => router.push('/finance/transactions/edit?id=' + tx?.id)"
          >
            <Pencil :size="20" class="mr-2" /> Edit
          </Button>
        </div>
        <div class="flex items-center gap-3"><Tag :size="20" />{{ tx.name }}</div>
        <div class="flex items-center gap-3"><Calendar :size="20" /> {{ date }}</div>
        <div class="flex items-center gap-3"><User :size="20" /> {{ user?.name }}</div>
        <div class="flex flex-col">
          <div class="flex items-center gap-3">
            <StickyNote filled :size="20" />
            Notes
          </div>
          <div class="text-muted-foreground ml-8 font-serif text-base">
            {{ tx.notes || '' }}
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-center">
        <DeleteDialog
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This cannot be undone."
          action="Delete"
          @delete="onDelete"
        >
          <Button variant="ghostdestructive"> Delete Transaction </Button>
        </DeleteDialog>
      </CardFooter>
    </Card>
  </div>
</template>
