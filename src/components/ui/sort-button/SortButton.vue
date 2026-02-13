<script setup lang="ts" generic="T extends string">
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export interface SortOption<T> {
  value: T
  label: string
  directionLabels?: {
    asc: string
    desc: string
  }
  defaultDirection?: 'asc' | 'desc'
}

export interface SortButtonProps<T extends string> {
  options: SortOption<T>[]
  currentSortType: T
  currentDirection: 'asc' | 'desc'
  variant?: 'default' | 'secondary' | 'ghost' | 'outline'
  showSortText?: boolean
  align?: 'start' | 'center' | 'end'
}

export interface SortButtonEmits<T extends string> {
  sort: [sortType: T, direction: 'asc' | 'desc']
}

const props = withDefaults(defineProps<SortButtonProps<T>>(), {
  variant: 'secondary',
  showSortText: false,
  align: 'end'
})

const emit = defineEmits<SortButtonEmits<T>>()

const handleSort = (selectedOption: SortOption<T>) => {
  if (props.currentSortType === selectedOption.value) {
    // Toggle direction if same sort type is selected
    const newDirection = props.currentDirection === 'asc' ? 'desc' : 'asc'
    emit('sort', selectedOption.value, newDirection)
  } else {
    // Set new sort type with its default direction
    const defaultDirection = selectedOption.defaultDirection || 'asc'
    emit('sort', selectedOption.value, defaultDirection)
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button :variant="props.variant" class="gap-2">
        <ArrowUpDown :size="16" />
        <span v-if="props.showSortText">Sort</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent :align="props.align" class="w-48">
      <DropdownMenuItem
        v-for="option in props.options"
        :key="option.value"
        @click="handleSort(option)"
        class="flex cursor-pointer items-center justify-between"
      >
        <span>{{ option.label }}</span>
        <div class="flex items-center">
          <span
            v-if="props.currentSortType === option.value"
            class="text-muted-foreground mr-1 text-xs"
          >
            {{
              option.directionLabels
                ? option.directionLabels[props.currentDirection]
                : props.currentDirection === 'asc'
                  ? 'Asc'
                  : 'Desc'
            }}
          </span>
          <ChevronUp
            v-if="props.currentSortType === option.value && props.currentDirection === 'asc'"
            :size="12"
            class="text-muted-foreground"
          />
          <ChevronDown
            v-if="props.currentSortType === option.value && props.currentDirection === 'desc'"
            :size="12"
            class="text-muted-foreground"
          />
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
