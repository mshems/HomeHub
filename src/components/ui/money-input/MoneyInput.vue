<script setup lang="ts">
import { type MaskInputOptions } from 'maska'
import { vMaska } from 'maska/vue'
import { computed, reactive } from 'vue'

import { Input } from '@/components/ui/input'

const emit = defineEmits(['update:amount'])
const props = defineProps<{
  amount: number
}>()

const inner = computed({
  get: () => {
    return props.amount.toFixed(2)
  },
  set: (value: string) => {
    if (value === undefined) return
    if (!value.includes('.')) {
      if (value.length === 1) {
        value = `0.0${value}`
      } else {
        value = `0.${value}`
      }
    }
    emit('update:amount', parseFloat(value))
  }
})

const options = reactive<MaskInputOptions>({
  tokens: {
    '9': {
      pattern: /\d/,
      repeated: true
    }
  },
  mask: '9.##',
  eager: true,
  reversed: true
})
</script>

<template>
  <Input
    class="text-right"
    v-maska="options"
    placeholder="0.00"
    v-model="inner"
    inputmode="numeric"
    @focus="(e: any) => e.target.select()"
  />
</template>
