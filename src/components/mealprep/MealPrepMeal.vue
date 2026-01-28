<script setup lang="ts">
import { Button } from '../ui/button'
import { X, CookingPot, Link2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MealIcon from '@/components/ui/icon/MealIcon.vue'
import { getRecipe } from '@/composables/recipes'
import type { IMeal } from '@/lib/models'

const router = useRouter()
const emit = defineEmits(['remove'])
const props = defineProps<{ meal: IMeal; removable?: Boolean; overview?: Boolean }>()
let recipe: any = undefined
if (props.meal.recipe) {
  recipe = getRecipe(props.meal.recipe.id)
}

const newTab = (url: string) => {
  window.open(url, '_blank', 'noopener')
}
</script>

<template>
  <Card
    :hoverable="true"
    class="relative w-full sm:w-64"
    @click="
      overview
        ? recipe
          ? router.push('recipes/' + recipe.id)
          : meal.link
            ? newTab(meal.link)
            : null
        : null
    "
  >
    <Button
      v-if="props.removable"
      variant="secondary"
      class="absolute top-2 right-2 h-5 w-5 p-0"
      @click.stop="() => emit('remove')"
    >
      <X />
    </Button>

    <Link2
      v-if="!recipe && meal.link && overview"
      class="text-muted-foreground absolute top-2 right-2 h-5 w-5 p-0"
    />

    <Badge class="dark absolute top-2 left-3 z-10 flex w-fit items-center text-xs capitalize">
      <MealIcon :meal="meal.meal" class="mr-2" :size="16" />
      {{ meal.meal }}
    </Badge>

    <template v-if="recipe && recipe.image">
      <img :src="recipe.image" class="h-24 w-full rounded-t-md object-cover" />
    </template>
    <template v-else>
      <div class="bg-secondary h-24 rounded-t-md">
        <MealIcon :meal="meal.meal" class="text-muted-foreground h-full w-full p-4" />
      </div>
    </template>

    <CardHeader class="px-3 py-3">
      <CardTitle class="overflow-hidden text-base text-nowrap text-ellipsis">
        {{ recipe ? recipe.title : meal.label }}
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-3 px-3 pb-5">
      <div>
        <Button
          v-if="recipe && !overview"
          size="sm"
          variant="accent"
          @click.stop="() => router.push('recipes/' + recipe.id)"
        >
          <CookingPot class="mr-2" :size="18" />
          View Recipe
        </Button>
        <Button
          v-if="!recipe && meal.link && !overview"
          size="sm"
          variant="secondary"
          :as="'a'"
          :href="meal.link"
          target="_blank"
          @click.stop
        >
          <Link2 class="mr-2" :size="18" />
          View Link
        </Button>
      </div>
      <div v-if="meal.notes" class="text-muted-foreground text-sm">
        {{ meal.notes }}
      </div>
    </CardContent>
  </Card>
</template>
