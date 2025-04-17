<script setup lang="ts">
import MealPrepDialog from './MealPrepDialog.vue'
import { Plus } from 'lucide-vue-next'
import { DateTime } from 'luxon'

import MealPrepMeal from '@/components/mealprep/MealPrepMeal.vue'
import { Button } from '@/components/ui/button'
import { useCollection } from '@/composables/collections'
import type { IMeal } from '@/lib/models'

const props = defineProps({
  day: {
    type: String,
    required: true
  }
})
const date = DateTime.fromISO(props.day)
const { collection: meals, remove } = useCollection(`data/mealprep/${props.day}/meals`)
const addMeal = (mealData: Omit<IMeal, 'id'>, timestamp: number) => {
  const isoDate = DateTime.fromSeconds(timestamp).toISODate()
  const { create } = useCollection(`data/mealprep/${isoDate}/meals`)
  create(mealData)
}
const updateMeal = (id: string, mealData: Omit<IMeal, 'id'>, timestamp: number) => {
  const isoDate = DateTime.fromSeconds(timestamp).toISODate()
  const { remove } = useCollection(`data/mealprep/${date.toISODate()}/meals`)
  remove(id)
  const { create } = useCollection(`data/mealprep/${isoDate}/meals`)
  create(mealData)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <h3 class="flex items-center justify-between">
      <div class="font-title font-medium">
        <div>{{ date.toFormat('cccc') }}</div>
        <div class="text-muted-foreground text-sm">
          {{ date.toFormat('MMM d') }}
        </div>
      </div>
      <MealPrepDialog @save="addMeal" :timestamp="date.toSeconds()">
        <Button variant="accent" size="iconsm">
          <Plus />
        </Button>
      </MealPrepDialog>
    </h3>
    <div class="flex flex-wrap gap-3">
      <template v-for="meal in meals" :key="meal.id">
        <MealPrepDialog
          :meal="meal as IMeal"
          :timestamp="date.toSeconds()"
          @save="(m, timestamp) => updateMeal(meal.id, m, timestamp)"
        >
          <MealPrepMeal :meal="meal as IMeal" :removable="true" @remove="() => remove(meal.id)" />
        </MealPrepDialog>
      </template>
    </div>
  </div>
</template>
