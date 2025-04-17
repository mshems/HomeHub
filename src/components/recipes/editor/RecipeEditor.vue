<script setup lang="ts">
import { CookingPot, ImageIcon, Link2Icon, TagIcon } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'

import RecipeTextEditor from '@/components/recipes/editor/RecipeTextEditor.vue'
import Button from '@/components/ui/button/Button.vue'
import { Card, CardHeader, CardContent } from '@/components/ui/card/'
import { InputWithIcon } from '@/components/ui/input'
import Label from '@/components/ui/label/Label.vue'
import { Textarea } from '@/components/ui/textarea'
import { getRecipe } from '@/composables/recipes'
import type { IIngredient, IRecipe, IStep } from '@/lib/models'

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
  ingredients: [{ quantity: undefined, unit: undefined, name: '' }] as IIngredient[],
  steps: [{ text: '' }] as IStep[],
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
      if (data.value.ingredients) {
        data.value.ingredients.map((i) => {
          if (!i.quantity) i.quantity = undefined
          if (!i.unit) i.unit = undefined
        })
      }
    }
    data.value.ingredients = data.value.ingredients || [
      { quantity: undefined, unit: undefined, name: '' }
    ]
    data.value.steps = data.value.steps || [{ text: '' }]
  })
}

const onSave = () => {
  data.value.lastUpdated = DateTime.now().toSeconds()
  data.value.ingredients = data.value.ingredients.filter((i) => i.name || i.quantity || i.unit)
  data.value.ingredients.map((i) => {
    if (!i.quantity) i.quantity = ''
    if (!i.unit) i.unit = ''
  })
  data.value.steps = data.value.steps.filter((s) => s.text)

  data.value.ingredients = []
  data.value.steps = []
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
          <div>
            <Label for="name">Title</Label>
            <InputWithIcon id="name" v-model="data.title" required>
              <TagIcon class="h-4 w-4" />
            </InputWithIcon>
          </div>

          <div>
            <Label for="link">Link</Label>
            <InputWithIcon id="link" v-model="data.link">
              <Link2Icon class="h-4 w-4" />
            </InputWithIcon>
          </div>

          <div>
            <Label for="image">Image</Label>
            <InputWithIcon id="image" v-model="data.image">
              <ImageIcon class="h-4 w-4" />
            </InputWithIcon>
          </div>

          <div class="flex w-full flex-col gap-2">
            <RecipeTextEditor v-model="data.body" />
          </div>

          <div class="">
            <Label for="notes">Notes</Label>
            <Textarea id="notes" v-model="data.notes" />
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
