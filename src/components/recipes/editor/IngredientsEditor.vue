<script setup lang="ts">
import IngredientInput from './IngredientInput.vue'
import { PlusIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import type { IIngredient } from '@/lib/models'

const ingredients = defineModel<IIngredient[]>('ingredients', { required: true })

const addIngredient = () => {
  if (!ingredients.value) {
    ingredients.value = []
  }
  ingredients.value.push({ quantity: undefined, unit: undefined, name: '' })
}

const swapIngredients = (index: number, direction: -1 | 1) => {
  const copy = [...ingredients.value]
  const temp = copy[index]
  copy[index] = copy[index + direction]
  copy[index + direction] = temp
  ingredients.value = copy
}

const removeIngredient = (index: number) => {
  const copy = [...ingredients.value]
  copy.splice(index, 1)
  ingredients.value = copy
}
</script>

<template>
  <div>
    <h3 class="my-5 font-title text-xl font-semibold">Ingredients</h3>
    <div class="flex flex-col gap-3">
      <template v-for="(_, i) in ingredients" :key="i">
        <IngredientInput
          :top="i === 0"
          :bottom="i === ingredients.length - 1"
          v-model:ingredient="ingredients[i]"
          @move-up="() => swapIngredients(i, -1)"
          @move-down="() => swapIngredients(i, 1)"
          @delete="() => removeIngredient(i)"
        />
      </template>
      <div class="flex w-full justify-center">
        <Button type="button" variant="accent" @click="addIngredient" class="ml-11 mr-12 w-full">
          <PlusIcon :size="20" />
        </Button>
      </div>
    </div>
  </div>
</template>
