<script setup>
import { ref } from 'vue'

const emit = defineEmits(['save', 'cancel'])
const props = defineProps({
  recipe: {
    type: Object,
    default: () => ({})
  },
  create: {
    type: Boolean,
    default: false
  }
})

const recipe = ref(props.recipe)

const swapIngredients = (index, direction) => {
  const ingredients = [...recipe.value.ingredients]
  const temp = ingredients[index]
  ingredients[index] = ingredients[index + direction]
  ingredients[index + direction] = temp
  recipe.value.ingredients = ingredients
}

const removeIngredient = (index) => {
  const ingredients = [...recipe.value.ingredients]
  ingredients.splice(index, 1)
  recipe.value.ingredients = ingredients
}

const swapSteps = (index, direction) => {
  const steps = [...recipe.value.steps]
  const temp = steps[index]
  steps[index] = steps[index + direction]
  steps[index + direction] = temp
  recipe.value.steps = steps
}

const removeStep = (index) => {
  const steps = [...recipe.value.steps]
  steps.splice(index, 1)
  recipe.value.steps = steps
}

const onSave = () => {
  recipe.value.ingredients = recipe.value.ingredients.filter(ingredient => ingredient.quantity)
  recipe.value.steps = recipe.value.steps.filter(step => step.text)
  emit('save', recipe.value)
}
</script>

<template>
  <q-card class="q-mb-xl">
    <template v-if="pending">
      <q-card-section class="column q-gutter-md">
        <q-skeleton />
        <q-skeleton />
        <q-skeleton />
      </q-card-section>
    </template>
    <template v-else-if="!!recipe">
      <q-card-section class="card-title row items-baseline">
        <q-icon
          class="q-mr-sm"
          name="mdi-pot-mix"
          color="recipes"
          size="lg"
        />
        {{ create ? "Create" : "Edit" }} Recipe
      </q-card-section>
      <q-card-section class="column q-gutter-md">
        <q-input
          filled
          label="Title"
          v-model="recipe.title"
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
        <div
          v-for="ingredient, i in recipe.ingredients"
          :key="i"
          class="row no-wrap q-gutter-sm q-mb-sm items-center"
        >
          <div class="column justify-center">
            <q-btn
              :disable="i === 0"
              color="accent"
              dense
              icon="mdi-chevron-up"
              flat
              @click="() => swapIngredients(i, -1)"
            />
            <q-btn
              :disable="i === recipe.ingredients.length - 1"
              color="accent"
              dense
              icon="mdi-chevron-down"
              flat
              @click="() => swapIngredients(i, 1)"
            />
          </div>
          <q-input
            stack-label
            style="width: 80px; min-width: 80px;"
            filled
            type="number"
            label="Quantity"
            v-model="ingredient.quantity"
          />
          <q-input
            stack-label
            style="width: 160px; min-width: 80px;"
            class="col-shrink"
            filled
            label="Unit"
            v-model="ingredient.unit"
          />
          <q-input
            stack-label
            style="width: fit-content;"
            class="col-grow"
            filled
            label="Ingredient"
            v-model="ingredient.name"
          />
          <q-btn
            dense
            class="self-center"
            icon="mdi-close"
            color="negative"
            flat
            @click="() => removeIngredient(i)"
          />
        </div>
        <div class="row justify-center">
          <q-btn
            class="q-mx-auto q-mt-sm text-on-color"
            label="Add Ingredient"
            color="accent"
            icon="mdi-plus"
            no-caps
            @click="() => recipe.ingredients.push({quantity: 0, unit: '', name: ''})"
          />
        </div>
      </q-card-section>
      <q-card-section
        class="card-title row items-center"
        style="font-size: 1rem;"
      >
        <q-icon
          class="q-mr-sm"
          name="mdi-note-text"
          color="recipes"
          size="sm"
        />
        Steps
      </q-card-section>
      <q-card-section>
        <div
          v-for="step, i in recipe.steps"
          :key="i"
          class="row no-wrap q-gutter-sm items-center q-mb-sm"
        >
          <div class="column justify-center">
            <q-btn
              :disable="i === 0"
              color="accent"
              dense
              icon="mdi-chevron-up"
              flat
              @click="() => swapSteps(i, -1)"
            />
            <q-btn
              :disable="i === recipe.steps.length - 1"
              color="accent"
              dense
              icon="mdi-chevron-down"
              flat
              @click="() => swapSteps(i, 1)"
            />
          </div>
          <q-input
            style="width: fit-content;"
            class="col-grow"
            filled
            autogrow
            type="textarea"
            v-model="step.text"
          />
          <q-btn
            dense
            class="self-center"
            icon="mdi-close"
            color="negative"
            flat
            @click="() => removeStep(i)"
          />
        </div>
        <div class="row justify-center">
          <q-btn
            class="q-mx-auto q-mt-sm text-on-color"
            label="Add Step"
            color="accent"
            icon="mdi-plus"
            no-caps
            @click="() => recipe.steps.push({text: ''})"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          filled
          type="textarea"
          label="Notes"
          autogrow
          v-model="recipe.notes"
        />
      </q-card-section>
      <q-card-section class="lt-sm column items-center q-gutter-sm q-py-lg">
        <q-btn
          v-if="create"
          class="full-width text-on-color"
          size="md"
          unelevated
          type="submit"
          label="Add Recipe"
          color="positive"
          @click="onSave"
          icon="mdi-plus"
        />
        <q-btn
          v-else
          class="full-width text-on-color"
          size="md"
          unelevated
          type="submit"
          label="Save"
          color="positive"
          @click="onSave"
          icon="mdi-content-save"
        />
        <q-btn
          flat
          label="cancel"
          @click="emit('cancel')"
        />
      </q-card-section>
      <q-card-section class="gt-xs row items-center q-py-lg">
        <q-btn
          flat
          label="cancel"
          @click="emit('cancel')"
        />
        <q-space />
        <q-btn
          v-if="create"
          unelevated
          label="Add Recipe"
          color="positive"
          icon="mdi-plus"
          class="text-on-color"
          @click="onSave"
        />
        <q-btn
          v-else
          unelevated
          label="Save"
          color="positive"
          icon="mdi-content-save"
          class="text-on-color"
          @click="onSave"
        />
      </q-card-section>
    </template>
  </q-card>
</template>
