<script setup>
defineProps({
  step: {
    type: Object,
    default: () => ({})
  }
  // ingredients: {
  //   type: Object,
  //   default: () => ({})
  // },
  // scale: {
  //   type: Number,
  //   default: 1
  // }
})
</script>

<template>
  <div>{{ step.text }}</div>
</template>
