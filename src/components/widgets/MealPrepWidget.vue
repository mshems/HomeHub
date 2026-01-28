<script setup lang="ts">
import MealPrepMeal from '../mealprep/MealPrepMeal.vue'
import { Button } from '../ui/button'
import { Calendar } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { useRouter } from 'vue-router'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import { useCollection } from '@/composables/collections'
import type { IMeal } from '@/lib/models'

const router = useRouter()
const { collection: meals } = useCollection<IMeal>(
  `data/mealprep/${DateTime.local().toISODate()}/meals`
)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Meal Prep</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-3">
      <div v-if="meals.length" class="font-title font-medium">Today's Meals</div>
      <div class="flex flex-wrap gap-3">
        <template v-for="meal in meals" :key="meal.id">
          <MealPrepMeal
            class="bg-muted hover:bg-card-focus sm:w-full"
            :meal="meal"
            :overview="true"
          />
        </template>
      </div>
      <div class="pt-3">
        <Button variant="accent" @click.stop="() => router.push('/mealprep')">
          <Calendar class="mr-2" />
          <span>View Schedule</span>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
