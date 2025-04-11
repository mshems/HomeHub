<script setup lang="ts">
import { TabsList, type TabsListProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-background text-secondary-foreground inline-flex h-12 w-fit items-center justify-center rounded-lg p-1.5',
        props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>
