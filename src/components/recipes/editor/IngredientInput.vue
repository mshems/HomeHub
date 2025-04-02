<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon, Trash2Icon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { IIngredient } from '@/lib/models'

const emit = defineEmits(['delete', 'moveUp', 'moveDown'])
const ingredient = defineModel<IIngredient>('ingredient', { required: true })
defineProps<{ top?: boolean; bottom?: boolean }>()
</script>

<template>
  <div class="flex flex-row gap-2">
    <div class="flex flex-col justify-between px-2">
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
    <Input v-model="ingredient.quantity" class="h-12 w-24" placeholder="Quantity" />
    <Input v-model="ingredient.unit" class="h-12 w-24" placeholder="Unit" />
    <Input v-model="ingredient.name" class="h-12" placeholder="Ingredient" />
    <div>
      <Button type="button" variant="ghostdestructive" size="icon" @click="emit('delete')">
        <Trash2Icon :size="20" />
      </Button>
    </div>
  </div>
</template>
