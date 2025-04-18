<script setup lang="ts">
import { Button } from '../ui/button'
import DatePicker from '../ui/date-picker/DatePicker.vue'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Plus } from 'lucide-vue-next'
import { Check, ChevronsUpDown, Search } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { ref } from 'vue'

import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger
} from '@/components/ui/combobox'
import MealIcon from '@/components/ui/icon/MealIcon.vue'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { getRecipesList } from '@/composables/recipes'
import { mealIcons } from '@/lib/icons'
import type { IMeal, IRecipe, IRecipeBrief } from '@/lib/models'
import { cn } from '@/lib/utils'

const emit = defineEmits(['save'])
const props = defineProps<{
  timestamp?: number
  meal?: IMeal
}>()

const recipes = getRecipesList()

const DEFAULTS = {
  meal: props.meal?.meal || ('dinner' as IMeal['meal']),
  label: props.meal?.label || '',
  recipe: props.meal?.recipe || undefined,
  notes: props.meal?.notes || ''
}
const date = ref<number>(props.timestamp || DateTime.now().toSeconds())
const data = ref<any>({
  ...DEFAULTS
})

const onSave = () => {
  data.value.recipe = data.value.recipe || ''
  emit('save', data.value, date.value)
  data.value = { ...DEFAULTS }
}

const selectedRecipe = ref<IRecipeBrief | undefined>(props.meal?.recipe || undefined)
const selectRecipe = (recipe: IRecipeBrief) => {
  data.value.label = recipe.title
  data.value.recipe = { id: recipe.id, title: recipe.title }
}
</script>

<template>
  <Dialog>
    <Dialog>
      <DialogTrigger as-child>
        <slot>
          <Button size="icon" variant="accent">
            <Plus :size="24" />
          </Button>
        </slot>
      </DialogTrigger>
      <DialogContent class="bg-card max-w-[350px] rounded-md">
        <DialogHeader>
          <DialogTitle> Plan Meal </DialogTitle>
        </DialogHeader>
        <form @submit.prevent="onSave" class="space-y-5 pt-3">
          <div class="flex flex-col space-y-2">
            <Label for="mealName">Recipe</Label>
            <!-- <Input :autofocus="false" id="mealName" type="text" v-model="data.label" label="Meal" /> -->

            <!-- {{ selectedRecipe }} -->
            <Combobox v-model="selectedRecipe" cla>
              <ComboboxAnchor class="w-full">
                <div class="relative w-full items-center">
                  <ComboboxInput
                    auto-focus
                    v-model:model-value="data.label"
                    :display-value="() => data.label"
                    placeholder="Select recipe..."
                  />
                </div>
              </ComboboxAnchor>

              <ComboboxList>
                <ComboboxEmpty> No framework found. </ComboboxEmpty>

                <ComboboxGroup>
                  <ComboboxItem
                    v-for="recipe in recipes"
                    :key="recipe.title"
                    :value="{ id: recipe.id, title: recipe.title }"
                    @select="() => selectRecipe(recipe)"
                  >
                    {{ recipe.title }}

                    <ComboboxItemIndicator>
                      <Check :class="cn('ml-auto h-4 w-4')" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
          </div>
          <div class="flex flex-col space-y-2">
            <Label for="meal">Meal</Label>
            <Select id="meal" v-model="data.meal" required>
              <SelectTrigger>
                <template v-if="data.meal">
                  <div class="flex items-center gap-5">
                    <MealIcon :meal="data.meal" class="text-foreground size-5" />
                    <span class="capitalize">{{ data.meal }}</span>
                  </div>
                </template>
                <span class="text-muted-foreground" v-else>Select meal</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="m in Object.keys(mealIcons)" :key="m" :value="m">
                  <div class="text-foreground flex items-center gap-5">
                    <MealIcon :meal="m" class="text-foreground size-5" />
                    <span class="capitalize">{{ m }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex flex-col space-y-2">
            <Label>Date</Label>
            <DatePicker v-model:timestamp="date" />
          </div>

          <div class="flex flex-col space-y-2">
            <Label for="notes">Notes</Label>
            <Textarea id="notes" class="text-xs" v-model="data.notes" />
          </div>

          <DialogFooter class="gap-3">
            <DialogClose as-child>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose as-child>
              <Button type="submit" :disabled="!data.label">Save</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </Dialog>
</template>
