<script setup>
defineProps({
  step: {
    type: Object,
    default: () => ({})
  },
  stepNumber: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div class="text-capitalize q-my-xs">
    {{ step.text }}
  </div>
</template>
