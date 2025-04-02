<script setup lang="ts">
import { mealIcons } from '@/lib/icons'

defineProps<{
  meal: string
}>()
</script>

<template>
  <component :is="mealIcons[meal]" />
</template>
