<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-lg bg-card text-card-foreground', {
  variants: {
    hoverable: {
      true: 'hover:bg-card-focus',
      false: ''
    }
  }
})
export type CardVariants = VariantProps<typeof cardVariants>

interface Props {
  hoverable?: CardVariants['hoverable']
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="cn(cardVariants({ hoverable }), props.class)">
    <slot />
  </div>
</template>
