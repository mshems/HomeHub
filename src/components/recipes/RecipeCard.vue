<script setup lang="ts">
import { Soup } from 'lucide-vue-next'

import Badge from '@/components/ui/badge/Badge.vue'
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { type IRecipe } from '@/lib/models'

defineProps<{ recipe: IRecipe }>()
</script>

<template>
  <Card>
    <template v-if="recipe.image">
      <img :src="recipe.image" class="h-48 w-full rounded-t-md object-cover" />
    </template>
    <template v-else>
      <div class="bg-secondary h-48 rounded-t-md">
        <Soup class="text-muted-foreground h-full w-full p-8" />
      </div>
    </template>
    <CardHeader>
      <CardTitle>{{ recipe.title }}</CardTitle>
    </CardHeader>
    <CardFooter>
      <div class="space-y-2">
        <div class="flex flex-wrap gap-2 overflow-hidden text-ellipsis">
          <Badge v-for="tag in recipe.tags" :key="tag" variant="secondary">{{ tag }}</Badge>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
