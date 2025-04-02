<script setup lang="ts">
import { TagsInputItemText, type TagsInputItemTextProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<TagsInputItemTextProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItemText
    v-bind="forwardedProps"
    :class="cn('rounded bg-transparent text-xs font-semibold text-accent-foreground', props.class)"
  />
</template>
