<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon, Trash2Icon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { IStep } from '@/lib/models'

const emit = defineEmits(['delete', 'moveUp', 'moveDown'])
defineProps<{ top?: boolean; bottom?: boolean }>()
const step = defineModel<IStep>('step', { required: true })
</script>

<template>
  <div class="flex flex-row gap-2">
    <div class="flex flex-col gap-2 px-2">
      <Button
        type="button"
        :disabled="top"
        class="size-5 rounded-sm"
        size="icon"
        variant="ghostaccent"
        @click="emit('moveUp')"
      >
        <ChevronUpIcon :size="20" />
      </Button>
      <Button
        type="button"
        :disabled="bottom"
        class="size-5 rounded-sm"
        size="icon"
        variant="ghostaccent"
        @click="emit('moveDown')"
      >
        <ChevronDownIcon :size="20" />
      </Button>
    </div>
    <Textarea v-model="step.text" />
    <div>
      <Button type="button" variant="ghostdestructive" size="icon" @click="emit('delete')">
        <Trash2Icon :size="20" />
      </Button>
    </div>
  </div>
</template>
