<script setup>
import pluralize from 'pluralize'

defineProps({
  ingredient: {
    type: Object,
    default: () => ({})
  },
  scale: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div>
    <div>
      <span class="text-accent text-bold">{{ pluralize(ingredient.unit, ingredient.quantity * scale, true) }}</span>
      <span>{{ ' ' + (!!ingredient.unit ? ingredient.name : pluralize(ingredient.name, ingredient.quantity * scale)) }}</span>
    </div>
  </div>
</template>
