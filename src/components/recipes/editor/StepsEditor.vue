<script setup lang="ts">
import StepInput from './StepInput.vue'
import { PlusIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import type { IStep } from '@/lib/models'

const steps = defineModel<IStep[]>('steps', { required: true })

const addStep = () => {
  if (!steps.value) {
    steps.value = []
  }
  steps.value.push({ text: '' })
}

const swapSteps = (index: number, direction: 1 | -1) => {
  const copy = [...steps.value]
  const temp = copy[index]
  copy[index] = copy[index + direction]
  copy[index + direction] = temp
  steps.value = copy
}

const removeStep = (index: number) => {
  const copy = [...steps.value]
  copy.splice(index, 1)
  steps.value = copy
}
</script>

<template>
  <div>
    <h3 class="my-5 font-title text-xl font-semibold">Recipe</h3>
    <div class="flex flex-col gap-3">
      <template v-for="(_, i) in steps" :key="i">
        <StepInput
          :top="i === 0"
          :bottom="i === steps.length - 1"
          v-model:step="steps[i]"
          @move-up="() => swapSteps(i, -1)"
          @move-down="() => swapSteps(i, 1)"
          @delete="() => removeStep(i)"
        />
      </template>
      <div class="flex w-full justify-center">
        <Button type="button" variant="accent" @click="addStep" class="ml-11 mr-12 w-full">
          <PlusIcon :size="20" />
        </Button>
      </div>
    </div>
  </div>
</template>
