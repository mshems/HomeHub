<script setup lang="ts">
import { CookingPot, ImageIcon, Link2Icon, Tag } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'

import RecipeTextEditor from '@/components/recipes/editor/RecipeTextEditor.vue'
import Button from '@/components/ui/button/Button.vue'
import { Card, CardHeader, CardContent } from '@/components/ui/card/'
import { InputWithIcon } from '@/components/ui/input'
import Label from '@/components/ui/label/Label.vue'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import { getRecipe } from '@/composables/recipes'
import type { IRecipe } from '@/lib/models'

const emit = defineEmits(['cancel', 'save'])
const props = defineProps({
  recipeId: {
    type: String,
    required: false
  }
})

const data = ref({
  title: '',
  image: '',
  link: '',
  favorite: false,
  body: '',
  notes: '',
  tags: [] as string[]
} as IRecipe)

const updating = computed(() => !!props.recipeId)
if (updating.value) {
  const recipe = getRecipe(props.recipeId as string)
  recipe.promise.value.then((res) => {
    if (res) {
      data.value = { ...res }
    }
  })
}

const onSave = () => {
  data.value.lastUpdated = DateTime.now().toSeconds()
  emitRecipe(data.value)
}

const emitRecipe = (recipe: IRecipe) => {
  emit('save', recipe)
}
</script>
<template>
  <div class="flex flex-col gap-5">
    <Card class="">
      <CardHeader>
        <h2 class="font-title flex items-center gap-3 text-2xl font-semibold">
          <CookingPot class="h-8 w-8" />
          {{ updating ? 'Edit' : 'New' }} Recipe
        </h2>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSave" class="space-y-5">
          <div class="flex flex-col space-y-2">
            <Label for="name">Title</Label>
            <InputWithIcon id="name" v-model="data.title" required>
              <Tag class="h-4 w-4" />
            </InputWithIcon>
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="link">Link</Label>
            <InputWithIcon id="link" v-model="data.link">
              <Link2Icon class="h-4 w-4" />
            </InputWithIcon>
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="image">Image</Label>
            <InputWithIcon id="image" v-model="data.image">
              <ImageIcon class="h-4 w-4" />
            </InputWithIcon>
          </div>

          <div class="flex w-full flex-col space-y-2">
            <Label for="recipe">Recipe</Label>
            <RecipeTextEditor id="recipe" v-model="data.body" />
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="notes">Notes</Label>
            <Textarea id="notes" v-model="data.notes" />
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="tags">Tags</Label>
            <TagsInput id="tags" v-model="data.tags">
              <TagsInputItem v-for="item in data.tags" :key="item" :value="item">
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>
              <TagsInputInput placeholder="Add a tag..." />
            </TagsInput>
          </div>

          <div class="flex justify-between gap-3 pt-5">
            <Button type="button" variant="ghost" @click="() => emit('cancel')">Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
