<script setup>
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'

const emit = defineEmits(['save'])
const props = defineProps({
  date: {
    type: String,
    required: true
  },
  meal: {
    type: Object,
    default: () => ({ label: '', meal: 'dinner' })
  }
})

const label = ref(props.meal.label)
const meal = ref(props.meal.meal)
const data = computed(() => ({
  label: label.value,
  meal: meal.value
}))
</script>

<template>
  <q-dialog>
    <q-card style="min-width: 280px;">
      <q-card-section
        class="card-title row items-baseline"
      >
        <q-icon
          name="mdi-pot-steam"
          class="q-mr-xs text-recipes"
        />
        Add Meal
      </q-card-section>
      <q-card-section
        class="card-subtitle"
      >
        {{ DateTime.fromISO(date).toFormat('EEEE, LLLL d') }}
      </q-card-section>
      <q-card-section class="column q-gutter-md">
        <q-input
          filled
          v-model="label"
          label="Name"
        />
        <q-select
          label="Meal"
          required
          filled
          v-model="meal"
          popup-content-class="rounded"
          map-options
          emit-value
          :options="[
            { label: 'Breakfast', value: 'breakfast', icon: 'mdi-coffee' },
            { label: 'Lunch', value: 'lunch', icon: 'mdi-pizza' },
            { label: 'Dinner', value: 'dinner', icon: 'mdi-noodles'},
            { label: 'Prep', value: 'prep', icon: 'mdi-pot-mix'},
          ]"
        >
          <template #prepend>
            <q-icon name="mdi-silverware" />
          </template>
          <template #selected-item="{opt}">
            <div v-if="opt">
              <span class="text-capitalize">{{ opt.label }}</span>
            </div>
          </template>
          <template #option="{itemProps, opt}">
            <q-item
              class="rounded q-ma-xs hoverable"
              v-bind="itemProps"
              :active="meal === opt"
              v-close-popup
            >
              <q-item-section avatar>
                <q-icon
                  :name="opt.icon || 'mdi-silverware'"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-capitalize">
                  {{ opt.label }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-close-popup="true"
          flat
          label="Close"
          color="negative"
        />
        <q-btn
          :disable="!label"
          v-close-popup="true"
          label="Save"
          color="primary"
          @click="emit('save', data)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
