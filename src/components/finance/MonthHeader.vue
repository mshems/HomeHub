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
    <h2 class="font-title text-2xl font-semibold sm:text-4xl">
      {{ date.monthLong }}
      <span class="text-lg text-muted-foreground sm:text-xl">{{
        date.year !== DateTime.now().year ? ' ' + date.year : ''
      }}</span>
    </h2>
    <div class="flex flex-row gap-3">
      <Button
        class="size-8 sm:size-10"
        variant="ghost"
        size="icon"
        @click="() => emit('onChange', date.minus({ months: 1 }))"
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
        @click="() => emit('onChange', date.plus({ months: 1 }))"
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
</template>
