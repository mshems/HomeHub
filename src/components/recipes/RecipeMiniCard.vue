<script setup lang="ts">
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { Soup } from 'lucide-vue-next'

import type { IRecipe } from '@/lib/models'

defineProps<{ recipe: IRecipe; hoverable?: boolean }>()
</script>

<template>
  <Card
    :hoverable="hoverable"
    :class="`bg-muted cursor-pointer rounded-lg p-3 ${hoverable ? 'hover:bg-card-focus' : ''}`"
  >
    <CardContent class="flex gap-3 px-0 py-0">
      <div class="flex-shrink-0">
        <template v-if="recipe.image">
          <img :src="recipe.image" :alt="recipe.title" class="h-16 w-16 rounded-md object-cover" />
        </template>
        <template v-else>
          <div class="bg-secondary flex h-16 w-16 items-center justify-center rounded-md">
            <Soup class="text-muted-foreground h-6 w-6" />
          </div>
        </template>
      </div>
      <div class="min-w-0 flex-1">
        <h5 class="truncate font-medium">{{ recipe.title }}</h5>
        <div class="mt-2 flex flex-wrap gap-1" v-if="recipe.tags.length > 0">
          <Badge
            v-for="tag in recipe.tags.slice(0, 2)"
            :key="tag"
            variant="secondary"
            class="text-xs"
          >
            {{ tag }}
          </Badge>
          <span v-if="recipe.tags.length > 2" class="text-muted-foreground text-xs">
            +{{ recipe.tags.length - 2 }} more
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
