<script setup lang="ts">
import MealPrepDialog from '../mealprep/MealPrepDialog.vue'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { useTimeAgo } from '@vueuse/core'
import { Calendar, Pencil } from 'lucide-vue-next'
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
</script>
<template>
  <Card v-if="recipe && recipe.image">
    <img :src="recipe.image" class="h-64 w-full rounded-lg bg-muted object-cover" />
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
          @save="(meal, timestamp) => emit('cook', meal, timestamp)"
          :timestamp="DateTime.now().toSeconds()"
        >
          <Button variant="accent" @click="emit('cook')">
            <Calendar :size="20" class="mr-2" /> Prep
          </Button>
        </MealPrepDialog>
        <Button variant="warning" @click="emit('edit')">
          <Pencil :size="20" class="mr-2" /> Edit
        </Button>
      </div>

      <div>
        <editor-content :editor="editor" />
      </div>

      <div v-if="recipe.ingredients">
        <div class="pb-1 font-title font-semibold">Ingredients</div>
        <template v-for="(ingredient, i) in recipe.ingredients" :key="i">
          <RecipeIngredient :ingredient="ingredient" />
        </template>
      </div>

      <div v-if="recipe.steps">
        <div class="pb-1 font-title font-semibold">Recipe</div>
        <ol>
          <li class="pb-5" v-for="(step, i) in recipe.steps" :key="i">
            <p class="text-sm leading-relaxed">{{ step.text }}</p>
          </li>
        </ol>
      </div>

      <div>
        <div class="pb-1 font-title font-semibold">Notes</div>
        <p class="font-serif text-sm text-muted-foreground">{{ recipe.notes }}</p>
      </div>

      <div v-if="recipe.link">
        <div class="pb-1 font-title font-semibold">Source</div>

        <a :href="recipe.link" target="_blank" rel="noopener noreferrer">
          <div
            class="overflow-hidden overflow-ellipsis text-nowrap font-serif text-sm text-muted-foreground hover:text-accent-typography"
          >
            {{ recipe.link }}
          </div>
        </a>
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
