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
const props = defineProps<{ meal: IMeal; removable?: Boolean }>()
let recipe: any = undefined
if (props.meal.recipe) {
  recipe = getRecipe(props.meal.recipe.id)
}
</script>

<template>
  <Card :hoverable="true" class="relative w-full sm:w-64">
    <Button
      v-if="props.removable"
      variant="secondary"
      class="absolute top-2 right-2 h-5 w-5 p-0"
      @click.stop="() => emit('remove')"
    >
      <X />
    </Button>

    <template v-if="recipe && recipe.image">
      <img :src="recipe.image" class="h-24 w-full rounded-t-md object-cover" />
    </template>
    <template v-else>
      <div class="bg-secondary h-24 rounded-t-md">
        <MealIcon :meal="meal.meal" class="text-muted-foreground h-full w-full p-4" />
      </div>
    </template>
    <CardHeader class="px-5 py-3">
      <CardTitle class="overflow-hidden text-base text-nowrap text-ellipsis">
        {{ recipe ? recipe.title : meal.label }}
      </CardTitle>
    </CardHeader>
    <CardContent class="px-5 pb-5">
      <Badge class="flex w-fit items-center text-xs capitalize">
        <MealIcon :meal="meal.meal" class="mr-2" :size="16" />
        {{ meal.meal }}
      </Badge>
      <Button
        v-if="recipe"
        variant="link"
        class="text-muted-foreground hover:text-primary mt-2 p-0 text-sm"
        @click.prevent="() => router.push('recipes/' + recipe.id)"
      >
        {{ recipe ? 'View Recipe' : 'Add Recipe' }}
      </Button>
    </CardContent>
  </Card>
</template>
