<script setup lang="ts">
import MealPrepDialog from '../mealprep/MealPrepDialog.vue'
import RecipeTextEditor from './editor/RecipeTextEditor.vue'
import { useTimeAgo } from '@vueuse/core'
import { Calendar, Link, Pencil, Check, X, Tag } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { ref, watch, computed } from 'vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card'
import DeleteDialog from '@/components/ui/dialog/DeleteDialog.vue'
import { TagSelect } from '@/components/ui/tag-select'
import { getRecipesList, useRecipes } from '@/composables/recipes'
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

// Tags editing state
const isEditingTags = ref(false)
const editingTags = ref<string[]>([])

// Get all recipes and extract unique tags for suggestions
const recipes = getRecipesList()
const knownTags = computed(() => {
  const allTags = recipes.value.flatMap((recipe) => recipe.tags || [])
  return [...new Set(allTags)].sort()
})

const { update } = useRecipes()

const startEditingTags = () => {
  editingTags.value = [...(props.recipe?.tags || [])]
  isEditingTags.value = true
}

const cancelEditingTags = () => {
  isEditingTags.value = false
  editingTags.value = []
}

const saveTags = async () => {
  if (props.recipe) {
    try {
      await update(props.recipe.id, { ...props.recipe, tags: editingTags.value })
      isEditingTags.value = false
    } catch (error) {
      console.error('Failed to update tags:', error)
    }
  }
}
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
        <Button variant="secondary" v-if="recipe.link">
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

      <div v-if="body && body !== '<p></p>'">
        <RecipeTextEditor v-model="body" :readonly="true" />
      </div>

      <div v-if="recipe.notes" class="bg-muted mt-4 rounded-md border-2 p-4">
        <div class="font-title pb-1 font-semibold">Notes</div>
        <p class="text-muted-foreground font-serif text-sm">{{ recipe.notes }}</p>
      </div>

      <div class="mt-8">
        <div v-if="!isEditingTags" class="flex flex-wrap justify-center gap-2">
          <Badge
            v-for="tag in recipe.tags"
            :key="tag"
            variant="accent"
            class="hover:bg-accent/80 cursor-pointer transition-colors"
            @click="startEditingTags"
          >
            {{ tag }}
          </Badge>
          <Button
            v-if="!recipe.tags || recipe.tags.length === 0"
            variant="outline"
            size="sm"
            @click="startEditingTags"
            class="text-muted-foreground"
          >
            <Tag :size="16" class="mr-1" />
            Add Tags
          </Button>
        </div>

        <div v-else class="space-y-3">
          <TagSelect v-model="editingTags" :suggestions="knownTags" placeholder="Add a tag..." />
          <div class="flex justify-center gap-2">
            <Button size="sm" @click="saveTags">
              <Check :size="16" class="mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" @click="cancelEditingTags">
              <X :size="16" class="mr-1" />
              Cancel
            </Button>
          </div>
        </div>
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
