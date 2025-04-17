<script setup lang="ts">
import MealPrepDialog from '../mealprep/MealPrepDialog.vue'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { useTimeAgo } from '@vueuse/core'
import { Calendar, Link, Pencil } from 'lucide-vue-next'
import { DateTime } from 'luxon'

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

const editor = useEditor({
  extensions: [StarterKit, Highlight, Typography],
  editable: false,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl'
    }
  },
  content: `${props.recipe?.body}`
})
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
    <CardContent class="space-y-5">
      <div class="flex flex-wrap gap-2">
        <MealPrepDialog
          :meal="{ meal: 'dinner', label: recipe.title, recipe: recipe.id } as IMeal"
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
        <editor-content :editor="editor" />
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

      <div v-if="recipe.notes">
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
