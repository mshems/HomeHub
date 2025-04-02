<script setup lang="ts">
import { Button } from '../ui/button'
import { X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MealIcon from '@/components/ui/icon/MealIcon.vue'
import { getRecipe } from '@/composables/recipes'
import type { IMeal } from '@/lib/models'

const router = useRouter()
const emit = defineEmits(['remove'])
const props = defineProps<{ meal: IMeal }>()
let recipe: any = undefined
if (props.meal.recipe) {
  recipe = getRecipe(props.meal.recipe)
}
</script>

<template>
  <div class="w-full sm:w-48">
    <Card
      :hoverable="true"
      class="relative"
      @click="() => !!recipe && router.push(`/recipes/${recipe.id}`)"
    >
      <Button
        variant="secondary"
        class="absolute right-2 top-2 h-5 w-5 p-0"
        @click.stop="() => emit('remove')"
      >
        <X />
      </Button>

      <template v-if="recipe && recipe.image">
        <img :src="recipe.image" class="h-24 w-full rounded-t-md object-cover" />
      </template>
      <template v-else>
        <div class="h-24 rounded-t-md bg-secondary">
          <MealIcon :meal="meal.meal" class="h-full w-full p-4 text-muted-foreground" />
        </div>
      </template>
      <CardHeader class="px-5 py-3">
        <CardTitle class="overflow-hidden text-ellipsis text-nowrap text-base">
          {{ recipe ? recipe.title : meal.label }}
        </CardTitle>
      </CardHeader>
      <CardContent class="px-5 pb-5">
        <Badge class="flex w-fit items-center text-xs capitalize">
          <MealIcon :meal="meal.meal" class="mr-2" :size="16" />
          {{ meal.meal }}
        </Badge>
      </CardContent>
    </Card>
  </div>
</template>
