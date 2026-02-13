<script setup lang="ts">
import { Button } from '../button'
import { CheckIcon, X } from 'lucide-vue-next'
import {
  ListboxContent,
  ListboxFilter,
  ListboxItem,
  ListboxItemIndicator,
  ListboxRoot,
  useFilter
} from 'reka-ui'
import { computed, ref, watch } from 'vue'

import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@/components/ui/tags-input'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    suggestions?: string[]
    placeholder?: string
  }>(),
  {
    suggestions: () => [],
    placeholder: 'Add a tag...'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const searchTerm = ref('')
const open = ref(false)

const { contains } = useFilter({ sensitivity: 'base' })

const filteredSuggestions = computed(() =>
  searchTerm.value === ''
    ? props.suggestions.filter((tag) => !props.modelValue.includes(tag))
    : props.suggestions.filter(
        (tag) => contains(tag, searchTerm.value) && !props.modelValue.includes(tag)
      )
)

watch(searchTerm, (val) => {
  if (val) {
    open.value = true
  }
})

const onSelect = () => {
  searchTerm.value = ''
}

const addCustomTag = () => {
  const trimmed = searchTerm.value.trim()
  if (trimmed && !props.modelValue.includes(trimmed)) {
    emit('update:modelValue', [...props.modelValue, trimmed])
    searchTerm.value = ''
  }
}

const clearAllTags = () => {
  emit('update:modelValue', [])
}

const onKeydown = (event: KeyboardEvent) => {
  // Allow adding custom tags with Enter when no suggestion is highlighted
  if (event.key === 'Enter' && searchTerm.value.trim()) {
    // Check if the search term matches any suggestion exactly
    const exactMatch = props.suggestions.some(
      (s) => s.toLowerCase() === searchTerm.value.toLowerCase()
    )
    if (!exactMatch) {
      event.preventDefault()
      addCustomTag()
    }
  }
}
</script>

<template>
  <Popover v-model:open="open">
    <ListboxRoot
      :model-value="modelValue"
      @update:model-value="(val: unknown) => emit('update:modelValue', val as string[])"
      highlight-on-hover
      multiple
    >
      <PopoverAnchor class="inline-flex w-full">
        <TagsInput
          :model-value="modelValue"
          @update:model-value="(val: unknown) => emit('update:modelValue', val as string[])"
          class="w-full"
        >
          <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <ListboxFilter v-model="searchTerm" as-child>
            <TagsInputInput
              :placeholder="placeholder"
              @keydown="onKeydown"
              @keydown.down="open = true"
            />
          </ListboxFilter>

          <Button
            v-if="modelValue.length > 0"
            variant="ghost"
            size="icon"
            class="text-muted-foreground h-7 w-7 shrink-0"
            @click="clearAllTags"
          >
            <X class="h-4 w-4" />
          </Button>
        </TagsInput>
      </PopoverAnchor>

      <PopoverContent class="w-[var(--reka-popover-trigger-width)] p-1" @open-auto-focus.prevent>
        <ListboxContent
          class="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto empty:p-1 empty:after:block empty:after:content-['No_options']"
          tabindex="0"
        >
          <ListboxItem
            v-for="item in filteredSuggestions"
            :key="item"
            class="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            :value="item"
            @select="onSelect"
          >
            <span>{{ item }}</span>
            <ListboxItemIndicator class="ml-auto inline-flex items-center justify-center">
              <CheckIcon />
            </ListboxItemIndicator>
          </ListboxItem>
        </ListboxContent>
      </PopoverContent>
    </ListboxRoot>
  </Popover>
</template>
