<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useCollection } from 'src/composables/collection'

import EditableField from '../EditableField.vue'

import RecipeIngredient from './RecipeIngredient.vue'
import RecipeStep from './RecipeStep.vue'

const $q = useQuasar()
const router = useRouter()
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { get, pending, update } = useCollection('data/recipes')
const recipe = get(props.id)

const onUpdate = (data) => {
  const payload = { ...recipe.value, ...data }
  update(props.id, payload)
    .then(() => {
      $q.notify({
        message: 'Recipe Updated',
        color: 'positive',
        icon: 'mdi-content-save'
      })
    })
    .catch(() => {
      $q.notify({
        message: 'Could not update recipe',
        color: 'negative',
        icon: 'mdi-alert-rhombus'
      })
    })
}
</script>

<template>
  <q-card class="q-pa-xs">
    <template v-if="pending">
      <q-card-section class="column q-gutter-md">
        <q-skeleton />
        <q-skeleton />
        <q-skeleton />
      </q-card-section>
    </template>
    <template v-else-if="!!recipe">
      <q-card-section class="card-title row justify-between no-wrap items-center">
        <div>{{ recipe.title }}</div>
        <q-btn
          round
          size="sm"
          @click="router.push('/recipes/' + id + '/edit')"
          icon="mdi-pencil"
        />
      </q-card-section>
      <q-card-section class="card-subtitle">
        <q-chip
          v-for="tag in recipe.tags"
          :key="tag"
          square
          size="sm"
          :label="tag"
          class="text-bold text-on-color"
          color="primary"
        />
      </q-card-section>
      <q-card-section
        class="card-title row items-center"
        style="font-size: 1rem;"
      >
        <q-icon
          class="q-mr-sm"
          name="mdi-shaker"
          color="recipes"
          size="sm"
        />
        Ingredients
      </q-card-section>
      <q-card-section>
        <template
          v-for="ingredient, i in recipe.ingredients"
          :key="i"
        >
          <recipe-ingredient
            :ingredient="ingredient"
          />
        </template>
      </q-card-section>
      <q-card-section
        class="card-title row items-center"
        style="font-size: 1rem;"
      >
        <q-icon
          class="q-mr-sm"
          name="mdi-pot-mix"
          color="recipes"
          size="sm"
        />
        Recipe
      </q-card-section>
      <q-card-section>
        <template
          v-for="step, i in recipe.steps"
          :key="i"
        >
          <recipe-step
            :step="step"
          />
        </template>
      </q-card-section>

      <editable-field
        v-model:field="recipe.notes"
        title="Notes"
        :subtitle="recipe.notes"
        label-classes="text-bold font-title"
        class="q-mb-md"
      >
        <q-popup-edit
          class="q-px-none"
          v-model="recipe.notes"
          v-slot="scope"
          buttons
          auto-save
          label-set="save"
          anchor="top middle"
          @save="(val) => onUpdate({notes: val})"
        >
          <q-input
            input-class="text-mono"
            type="textarea"
            dense
            filled
            v-model="scope.value"
            autofocus
            @keyup.enter.stop
          />
        </q-popup-edit>
      </editable-field>

      <!-- <q-card-section>
        <q-chip
          v-for="tag in recipe.tags"
          :key="tag"
          square
          size="sm"
          :label="tag"
          class="text-bold text-on-color"
          color="primary"
        />
      </q-card-section> -->
    </template>
  </q-card>
  <div class="q-pa-lg row justify-center">
    <q-btn
      label="Delete"
      flat
      color="negative"
    />
  </div>
</template>
