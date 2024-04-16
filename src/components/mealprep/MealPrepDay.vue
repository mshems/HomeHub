<script setup>
import { DateTime } from 'luxon'

import MealCard from 'src/components/mealprep/MealCard.vue'
import { useCollection } from 'src/composables/collection'

const emit = defineEmits(['addMeal'])
const props = defineProps({
  date: {
    type: String,
    default: DateTime.now().toISODate()
  }
})

const { get } = useCollection('data/mealprep')
const { data: day, pending } = get(props.date)
</script>

<template>
  <div
    v-if="!!date"
    class="q-px-md q-py-xs"
  >
    <div class="q-mb-sm row justify-between">
      <div>
        <div
          class="card-title"
          style="font-size: 1rem;"
        >
          {{ DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('EEEE') }}
        </div>
        <div
          class="card-subtitle"
          style="font-size: 0.8rem;"
        >
          {{ DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('LLLL d') }}
        </div>
      </div>
      <div v-if="!day && !pending">
        <q-btn
          dense
          icon="mdi-plus"
          color="recipes"
          class="col-auto q-px-sm text-on-color"
          label="Add meal"
          @click="emit('addMeal', date)"
        />
      </div>
    </div>

    <div
      v-if="pending"
      class="q-mb-sm"
    >
      <q-skeleton />
    </div>

    <div
      v-else-if="!day"
      class="q-mb-sm q-pa-sm row justify-center items-center text-muted"
    >
      <!-- <q-icon name="mdi-pot-mix" size="sm" class="q-mr-xs q-pb-xs"/> -->
      <q-icon
        name="mdi-food"
        size="sm"
        class="q-mr-sm q-pb-xs"
      />
      <div style="font-size: 1rem;">
        No Meals Planned
      </div>
    </div>

    <div
      v-else
      class="q-mb-sm"
    >
      <div class="row q-gutter-xs q-mb-sm">
        <template
          v-for="meal in day.meals"
          :key="meal.id"
        >
          <meal-card
            :meal="meal"
            class="col-auto"
          />
        </template>
        <q-btn
          icon="mdi-pot-steam"
          outline
          color="recipes"
          class="col-auto"
        />
      </div>

      <div v-if="day.notes">
        <q-card>
          <q-card-section>
            <div class="text-mono row items-center">
              <q-icon
                name="mdi-note"
                class="q-mr-xs"
              />Notes
            </div>
            <div class="text-muted text-mono">
              {{ day.notes }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
