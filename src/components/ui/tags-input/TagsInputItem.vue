<script setup lang="ts">
import { TagsInputItem, type TagsInputItemProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<TagsInputItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItem
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-6 items-center gap-2 rounded bg-accent py-0.5 pl-2.5 pr-1.5 ring-offset-background data-[state=active]:ring-2 data-[state=active]:ring-ring data-[state=active]:ring-offset-2',
        props.class
      )
    "
  >
    <slot />
  </TagsInputItem>
</template>
