<script setup lang="ts">
import { useSwipe } from '@vueuse/core'
import { ChevronLeft, Plus } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import MetricsPanel from '@/components/finance/MetricsPanel.vue'
import MonthHeader from '@/components/finance/MonthHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDateProps } from '@/composables/dateProps'

const router = useRouter()
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

// Swipe gesture handling
const containerEl = ref<HTMLElement>()

const { direction } = useSwipe(containerEl, {
  onSwipeEnd(e, direction) {
    if (direction === 'right') {
      // Swipe right - go to previous month
      const previousMonth = date.value.minus({ months: 1 })
      router.push({ query: { m: previousMonth.month, y: previousMonth.year } })
    } else if (direction === 'left') {
      // Swipe left - go to next month
      const nextMonth = date.value.plus({ months: 1 })
      router.push({ query: { m: nextMonth.month, y: nextMonth.year } })
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
      <Button variant="accent" size="iconxl" @click="router.push('/finance/transactions/edit')">
        <Plus />
      </Button>
    </div>

    <Card>
      <CardHeader class="font-title pb-2 text-xl font-semibold">
        <CardTitle>Metrics</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 pt-3">
        <MetricsPanel :m="month" :y="year" />
      </CardContent>
    </Card>
  </div>
</template>
