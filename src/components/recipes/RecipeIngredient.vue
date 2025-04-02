<script setup lang="ts">
import { numericQuantity } from 'numeric-quantity'
import pluralize from 'pluralize'

import { type IIngredient } from '@/lib/models'

defineProps<{ ingredient: IIngredient }>()
</script>

<template>
  <div class="text-sm leading-relaxed">
    <span class="text-bold text-accent-typography" v-if="ingredient.quantity">
      {{ ingredient.quantity }}
      {{ pluralize(ingredient.unit || '', numericQuantity(ingredient.quantity || 0)) }}
    </span>
    <span>
      {{
        ' ' +
        (!!ingredient.unit || !ingredient.quantity
          ? ingredient.name
          : pluralize(ingredient.name, numericQuantity(ingredient.quantity || 0)))
      }}
    </span>
  </div>
</template>
