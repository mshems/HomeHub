<script setup lang="ts">
import { Soup } from 'lucide-vue-next'
import { computed } from 'vue'

import Badge from '@/components/ui/badge/Badge.vue'
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { type IRecipe } from '@/lib/models'

const props = defineProps<{ recipe: IRecipe; maxTags?: number }>()

const maxVisible = computed(() => props.maxTags ?? 3)
const visibleTags = computed(() => props.recipe.tags?.slice(0, maxVisible.value) ?? [])
const remainingCount = computed(() =>
  Math.max(0, (props.recipe.tags?.length ?? 0) - maxVisible.value)
)
</script>

<template>
  <Card class="group flex h-full flex-col">
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
    <CardFooter class="mt-auto w-full">
      <div class="flex w-full flex-wrap gap-2">
        <Badge v-for="tag in visibleTags" :key="tag" variant="secondary">{{ tag }}</Badge>
        <span v-if="remainingCount > 0" class="text-muted-foreground text-sm">
          +{{ remainingCount }} more
        </span>
      </div>
    </CardFooter>
  </Card>
</template>
