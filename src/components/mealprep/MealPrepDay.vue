<script setup>
import { ref } from 'vue'
import { DateTime } from 'luxon'

import { useCollection } from 'src/composables/collection'

import MealCard from './MealCard.vue'
import MealPrepDialog from './MealPrepDialog.vue'

const props = defineProps({
  date: {
    type: String,
    default: DateTime.now().toISODate()
  }
})

const { get } = useCollection('data/mealprep')
const { pending } = get(props.date)
const { collection: meals, create, remove } = useCollection(`data/mealprep/${props.date}/meals`)
const showDialog = ref(false)

const onSave = (data) => {
  create(data)
  showDialog.value = false
}
</script>

<template>
  <div
    v-if="!!date"
    class="q-px-md q-py-xs"
  >
    <div class="q-mb-sm">
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

    <div
      v-if="pending"
      class="q-mb-sm"
    >
      <q-skeleton />
    </div>

    <div
      v-else-if="meals.length > 0"
      class="q-mb-sm"
    >
      <div class="row q-gutter-xs">
        <template
          v-for="meal in meals"
          :key="meal.id"
        >
          <meal-card
            :meal="meal"
            class="col-auto"
            @delete="remove"
          />
        </template>
        <q-btn
          flat
          no-caps
          color="muted"
          icon="mdi-plus"
          @click="showDialog = true"
        />
      </div>
    </div>

    <div
      v-if="!pending && !meals.length"
      class="row items-center text-muted"
    >
      <q-btn
        flat
        no-caps
        color="muted"
        @click="showDialog = true"
        label="Add Meal"
        icon="mdi-plus"
      />
    </div>
  </div>
  <meal-prep-dialog
    :date="date"
    v-model="showDialog"
    @save="(data) => onSave(data)"
  />
</template>
