<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'

import MealPrepDay from 'src/components/mealprep/MealPrepDay.vue'
import NavChip from 'src/components/NavChip.vue'
import RecipesHeader from 'src/components/recipes/RecipesHeader.vue'

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

const prev = () => {
  const prev = DateTime.fromISO(props.d).minus({ weeks: 1 }).toISODate()
  router.replace(`/mealprep?d=${prev}`)
}

const next = () => {
  const next = DateTime.fromISO(props.d).plus({ weeks: 1 }).toISODate()
  router.replace(`/mealprep?d=${next}`)
}

const thisWeek = () => {
  router.replace(`/mealprep?d=${DateTime.now().startOf('week').toISODate()}`)
}

</script>

<template>
  <recipes-header>
    <nav-chip
      path="/mealprep"
      icon="mdi-calendar"
      label="Meal Prep"
    />
  </recipes-header>
  <q-page
    padding
    class="container"
  >
    <div class="row justify-between q-mb-md">
      <q-btn
        icon="mdi-chevron-left"
        @click="prev"
      />
      <q-btn
        icon="mdi-calendar-today"
        @click="thisWeek"
      />
      <q-btn
        icon-right="mdi-chevron-right"
        @click="next"
      />
    </div>

    <q-virtual-scroll
      style="height: 100%;"
      :items="dates"
      v-slot="{ item }"
    >
      <div
        :key="item"
        class="q-mb-sm"
      >
        <meal-prep-day :date="item" />
      </div>
    </q-virtual-scroll>
  </q-page>
</template>
