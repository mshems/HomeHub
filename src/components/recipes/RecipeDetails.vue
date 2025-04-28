<script setup lang="ts">
import MealPrepDialog from '../mealprep/MealPrepDialog.vue'
import RecipeTextEditor from './editor/RecipeTextEditor.vue'
import { useTimeAgo } from '@vueuse/core'
import { Calendar, Link, Pencil } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { ref, watch } from 'vue'

import DeleteDialog from '@/components/generic/DeleteDialog.vue'
import RecipeIngredient from '@/components/recipes/RecipeIngredient.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card'
import type { IMeal, IRecipe } from '@/lib/models'

const props = defineProps<{ recipe: IRecipe | undefined }>()
const emit = defineEmits(['cook', 'edit', 'delete'])

const body = ref<string | undefined>(props.recipe?.body || '')
watch(
  () => props.recipe?.body,
  (newValue) => {
    body.value = newValue
  },
  { immediate: true }
)
const now = DateTime.now().toSeconds()
</script>
<template>
  <Card v-if="recipe && recipe.image">
    <img :src="recipe.image" class="bg-muted h-64 w-full rounded-lg object-cover" />
  </Card>
  <Card v-if="recipe" class="">
    <CardHeader>
      <CardTitle>{{ recipe.title }}</CardTitle>
      <CardDescription>Updated {{ useTimeAgo(recipe.lastUpdated * 1000) }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap gap-2">
        <MealPrepDialog
          :meal="
            {
              meal: 'dinner',
              label: recipe.title,
              recipe: { id: recipe.id, title: recipe.title }
            } as IMeal
          "
          :timestamp="now"
          @save="(meal, timestamp) => emit('cook', meal, timestamp)"
        >
          <Button variant="accent">
            <Calendar :size="20" class="mr-2" />
            Prep
          </Button>
        </MealPrepDialog>
        <Button variant="warning" @click="emit('edit')">
          <Pencil :size="20" class="mr-2" /> Edit
        </Button>
        <Button variant="secondary">
          <a
            :href="recipe.link"
            target="_blank"
            rel="noopener noreferrer"
            class="flex cursor-default items-center"
          >
            <Link :size="20" class="mr-2" /> View Source
          </a>
        </Button>
      </div>

      <!-- class="overflow-hidden text-ellipsis text-nowrap font-serif text-sm text-muted-foreground hover:text-accent-typography" -->

      <div v-if="recipe.body">
        <RecipeTextEditor v-model="body" :readonly="true" />
      </div>

      <div v-if="recipe.ingredients">
        <div class="font-title pb-1 font-semibold">Ingredients</div>
        <template v-for="(ingredient, i) in recipe.ingredients" :key="i">
          <RecipeIngredient :ingredient="ingredient" />
        </template>
      </div>

      <div v-if="recipe.steps">
        <div class="font-title pb-1 font-semibold">Recipe</div>
        <ol>
          <li class="pb-5" v-for="(step, i) in recipe.steps" :key="i">
            <p class="text-sm leading-relaxed">{{ step.text }}</p>
          </li>
        </ol>
      </div>

      <div v-if="recipe.notes" class="bg-muted mt-3 rounded-md border-2 p-4">
        <div class="font-title pb-1 font-semibold">Notes</div>
        <p class="text-muted-foreground font-serif text-sm">{{ recipe.notes }}</p>
      </div>
    </CardContent>
    <CardFooter class="flex justify-center">
      <DeleteDialog
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This cannot be undone."
        @delete="emit('delete')"
      >
        <Button variant="ghostdestructive"> Delete Recipe </Button>
      </DeleteDialog>
    </CardFooter>
  </Card>
</template>
