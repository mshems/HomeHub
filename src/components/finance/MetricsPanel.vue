<script setup lang="ts">
import SpendingBalance from './SpendingBalance.vue'
import UserMetricsTab from './UserMetricsTab.vue'
import { ref, watchEffect } from 'vue'
import { computed } from 'vue'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/composables/auth'
import { useDateProps } from '@/composables/dateProps'
import { useFilters } from '@/composables/filters'
import { getTransactionsList, useFilteredTransactions } from '@/composables/transactions'
import { getUsersList } from '@/composables/users'

const props = defineProps<{
  m: number
  y: number
}>()

const users = getUsersList()
const { user } = useAuth()
const tab = ref(user.value?.id || 'cstone')
watchEffect(() => {
  tab.value = user.value?.id || 'cstone'
})

const { month, year } = useDateProps(props)
const { transactions: tx } = useFilteredTransactions(
  getTransactionsList(),
  useFilters({
    byMonth: { month, year }
  }).filters
)
</script>

<template>
  <div class="space-y-3">
    <SpendingBalance :tx="computed(() => tx)" />
    <Tabs :model-value="tab" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="cstone" @click="() => (tab = 'cstone')"> Colleen </TabsTrigger>
        <TabsTrigger value="mshems" @click="() => (tab = 'mshems')"> Matt </TabsTrigger>
      </TabsList>
      <template v-for="user in users" :key="user.id">
        <TabsContent :value="user.id">
          <UserMetricsTab :user="user" :tx="computed(() => tx)" />
        </TabsContent>
      </template>
    </Tabs>
  </div>
</template>
