<script setup lang="ts">
import MealPrepDay from '../../components/mealprep/MealPrepDay.vue'
import { DateTime } from 'luxon'
import { computed } from 'vue'
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
</script>
<template>
  <div class="container flex max-w-[800px] flex-col gap-5 py-8">
    <WeeksHeader
      :date="DateTime.fromISO(d)"
      @onChange="(date) => router.push({ query: { d: date.toISODate() } })"
    >
      <div>
        <h1 class="flex flex-row items-center font-title text-4xl font-semibold">Meal Prep</h1>
        <h2 class="font-title text-lg font-semibold text-muted-foreground">
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
