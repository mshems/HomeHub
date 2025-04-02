<script setup lang="ts">
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-vue-next'
import { DateTime } from 'luxon'

import Button from '@/components/ui/button/Button.vue'

const emit = defineEmits<{
  onChange: [date: DateTime]
}>()
defineProps<{
  date: DateTime
}>()
</script>

<template>
  <div class="flex flex-row items-center justify-between gap-3">
    <slot></slot>
    <div class="flex flex-row gap-3">
      <Button
        class="size-8 sm:size-10"
        variant="ghost"
        size="icon"
        @click="() => emit('onChange', date.minus({ weeks: 1 }))"
      >
        <ChevronLeft />
      </Button>
      <Button
        class="size-8 sm:size-10"
        variant="ghost"
        size="icon"
        @click="() => emit('onChange', DateTime.now())"
      >
        <Calendar />
      </Button>
      <Button
        class="size-8 sm:size-10"
        variant="ghost"
        size="icon"
        @click="() => emit('onChange', date.plus({ weeks: 1 }))"
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
</template>
