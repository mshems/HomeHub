<script setup lang="ts">
import BalanceMiniCard from '../finance/BalanceMiniCard.vue'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Plus } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { useRouter } from 'vue-router'

import { useFilters } from '@/composables/filters'
import { getTransactionsList, useFilteredTransactions } from '@/composables/transactions'

const router = useRouter()
const { total: YTD } = useFilteredTransactions(
  getTransactionsList(),
  useFilters({
    byYear: { year: DateTime.now().year }
  }).filters
)
const { total: monthly } = useFilteredTransactions(
  getTransactionsList(),
  useFilters({
    byMonth: { month: DateTime.now().month, year: DateTime.now().year }
  }).filters
)
</script>

<template>
  <Card class="w-full" @click="router.push('/finance/transactions')" :hoverable="true">
    <CardHeader>
      <CardTitle> Finance </CardTitle>
    </CardHeader>
    <CardContent class="flex flex-row flex-wrap items-center gap-3">
      <BalanceMiniCard :balance="YTD">
        <span class="font-medium">YTD</span>
      </BalanceMiniCard>
      <BalanceMiniCard :balance="monthly">
        <span class="font-medium">{{ DateTime.now().monthLong }}</span>
      </BalanceMiniCard>
      <Button variant="accent" size="lg" @click.stop="router.push('/finance/transactions/edit')">
        <Plus class="mr-2" /> Add Transaction
      </Button>
      <!-- <Card
        class="bg-accent text-accent-foreground hover:bg-accent-focus"
        @click.stop="router.push('/finance/transactions/edit')"
      >
        <div class="flex flex-row items-center gap-3 px-5 py-3">
          <Plus class="mr-2" /> Add Transaction
        </div>
      </Card> -->
    </CardContent>
  </Card>
</template>
