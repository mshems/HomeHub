<script setup lang="ts">
import MealPrepDay from '../../components/mealprep/MealPrepDay.vue'
import { useSwipe } from '@vueuse/core'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import WeeksHeader from '@/components/mealprep/WeekHeader.vue'

const router = useRouter()
const props = defineProps({
  d: {
    type: String,
    required: true
  }
})

const dates = computed(() => {
  const startDate = DateTime.fromISO(props.d)
  let date = startDate
  const dates = []
  while (date < startDate.plus({ weeks: 1 })) {
    dates.push(date.toISODate())
    date = date.plus({ days: 1 })
  }
  return dates
})

// Swipe gesture handling
const containerEl = ref<HTMLElement>()

const { direction } = useSwipe(containerEl, {
  onSwipeEnd(e, direction) {
    const currentDate = DateTime.fromISO(props.d)
    if (direction === 'right') {
      // Swipe right - go to previous week
      const previousWeek = currentDate.minus({ weeks: 1 })
      router.push({ query: { d: previousWeek.toISODate() } })
    } else if (direction === 'left') {
      // Swipe left - go to next week
      const nextWeek = currentDate.plus({ weeks: 1 })
      router.push({ query: { d: nextWeek.toISODate() } })
    }
  }
})
</script>
<template>
  <div ref="containerEl" class="container flex max-w-[800px] flex-col gap-5 py-8">
    <WeeksHeader
      :date="DateTime.fromISO(d)"
      @onChange="(date) => router.push({ query: { d: date.toISODate() } })"
    >
      <div>
        <h1 class="font-title flex flex-row items-center text-4xl font-semibold">Meal Prep</h1>
        <h2 class="font-title text-muted-foreground text-lg font-semibold">
          {{ DateTime.fromISO(d).toFormat('MMM d') }} -
          {{ DateTime.fromISO(d).plus({ weeks: 1, days: -1 }).toFormat('MMM d') }}
        </h2>
      </div>
    </WeeksHeader>
    <template v-for="day in dates" :key="day">
      <MealPrepDay v-if="day" :day="day" />
    </template>
  </div>
</template>
