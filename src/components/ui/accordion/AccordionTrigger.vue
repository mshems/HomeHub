<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { AccordionHeader, AccordionTrigger, type AccordionTriggerProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      v-bind="delegatedProps"
      :class="
        cn(
          'flex flex-1 items-center justify-between rounded-lg px-3 py-3 font-medium transition-all hover:bg-card-focus [&[data-state=open]>svg]:rotate-180',
          props.class
        )
      "
    >
      <slot />
      <slot name="icon">
        <ChevronDown class="h-5 w-5 shrink-0 transition-transform duration-200" />
      </slot>
    </AccordionTrigger>
  </AccordionHeader>
</template>
