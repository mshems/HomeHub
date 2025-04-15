<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'

import Button from '@/components/ui/button/Button.vue'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const emit = defineEmits(['update:timestamp'])
const props = defineProps<{
  timestamp: number | undefined
}>()

const toDT = (dv: DateValue) => {
  const now = DateTime.now()
  const dt = DateTime.fromObject({
    year: dv.year,
    month: dv.month,
    day: dv.day,
    hour: now.hour,
    minute: now.minute
  })
  dt.setZone(now.zoneName)
  return dt
}

const inner = computed({
  get() {
    if (props.timestamp) {
      const dt = DateTime.fromSeconds(props.timestamp)
      return new CalendarDate(dt.year, dt.month, dt.day)
    }
    return undefined
  },
  set(val) {
    if (val) {
      const dt = toDT(val)
      emit('update:timestamp', dt.toSeconds())
    }
  }
})

const calendarOpen = ref(false)
</script>

<template>
  <Popover :open="calendarOpen">
    <PopoverTrigger as-child>
      <Button
        @click="calendarOpen = !calendarOpen"
        variant="outline"
        :class="
          cn(
            'bg-background hover:bg-background w-full justify-start text-left text-base font-normal',
            !inner && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-4 h-4 w-4" />
        {{ inner ? toDT(inner).toFormat('MMM. d, yyyy') : 'Pick a date' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        v-model="inner"
        @update:model-value="() => (calendarOpen = false)"
        initial-focus
        @keydown.escape="calendarOpen = false"
      />
    </PopoverContent>
  </Popover>
</template>
