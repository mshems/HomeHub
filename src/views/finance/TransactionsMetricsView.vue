<script setup lang="ts">
import { useSwipe } from '@vueuse/core'
import { ChevronLeft, Plus } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import MonthHeader from '@/components/finance/MonthHeader.vue'
import MetricsPanel from '@/components/finance/metrics/MetricsPanel.vue'
import SpendingBalance from '@/components/finance/metrics/SpendingBalance.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useDateProps } from '@/composables/dateProps'
import { useFilters } from '@/composables/filters'
import { useSwipeNavigation } from '@/composables/swipeNavigation'
import { getTransactionsList, useFilteredTransactions } from '@/composables/transactions'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const settings = useSettingsStore()
const windowSize = computed({
  get: () => String(settings.metrics.windowSize),
  set: (v: string) => settings.setMetricsWindow(Number(v))
})
const props = defineProps({
  m: {
    type: [Number],
    default: DateTime.local().month
  },
  y: {
    type: [Number],
    default: DateTime.local().year
  }
})

const { month, year, date } = useDateProps(props)
const windowSizeOptions = [
  { label: '6 months', value: '6' },
  { label: '12 months', value: '12' },
  { label: '18 months', value: '18' },
  { label: '24 months', value: '24' },
  { label: '36 months', value: '36' }
]
const { transactions: tx } = useFilteredTransactions(
  getTransactionsList(),
  useFilters({
    byMonth: { month, year }
  }).filters
)
// Swipe gesture handling
const containerEl = ref<HTMLElement>()
const contentEl = ref<HTMLElement>()
const { animateAndNavigate } = useSwipeNavigation(contentEl)

useSwipe(containerEl, {
  onSwipeEnd(e, direction) {
    if (direction === 'right') {
      // Swipe right - go to previous month
      const previousMonth = date.value.minus({ months: 1 })
      animateAndNavigate('right', () => {
        router.push({ query: { m: previousMonth.month, y: previousMonth.year } })
      })
    } else if (direction === 'left') {
      // Swipe left - go to next month
      const nextMonth = date.value.plus({ months: 1 })
      animateAndNavigate('left', () => {
        router.push({ query: { m: nextMonth.month, y: nextMonth.year } })
      })
    }
  }
})
</script>

<template>
  <div ref="containerEl" class="container flex max-w-[800px] flex-col gap-3 py-8">
    <MonthHeader
      :date="date"
      @onChange="(date) => router.push({ query: { m: date.month, y: date.year } })"
    />

    <div ref="contentEl" class="flex flex-col gap-3 overflow-hidden">
      <div class="mt-3 flex flex-row flex-wrap gap-3">
        <Card
          class="bg-secondary text-secondary-foreground hover:bg-secondary-focus"
          @click="router.push('/finance/transactions?m=' + month + '&y=' + year)"
        >
          <div class="flex flex-row items-center gap-3 py-3 pr-5 pl-3">
            <ChevronLeft />
            Transactions
          </div>
        </Card>
        <SpendingBalance :tx="computed(() => tx)" />
        <Button variant="accent" size="iconxl" @click="router.push('/finance/transactions/edit')">
          <Plus />
        </Button>
      </div>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="font-title text-xl font-semibold">Metrics</CardTitle>
          <Select v-model="windowSize">
            <SelectTrigger class="w-auto">
              <SelectValue placeholder="Window" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in windowSizeOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent class="space-y-3 pt-3">
          <MetricsPanel :m="month" :y="year" :window-size="Number(windowSize)" />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
