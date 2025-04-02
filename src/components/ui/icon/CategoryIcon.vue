<script setup lang="ts">
import { categoryIcons, categoryColors } from '@/lib/icons'

defineProps<{
  category: string
  noColor?: boolean
}>()
</script>

<template>
  <component :is="categoryIcons[category]" :class="noColor ? '' : categoryColors[category]" />
</template>
