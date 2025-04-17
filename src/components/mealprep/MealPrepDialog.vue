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
import { DateTime } from 'luxon'
import { ref } from 'vue'

import MealIcon from '@/components/ui/icon/MealIcon.vue'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { mealIcons } from '@/lib/icons'
import type { IMeal } from '@/lib/models'

const emit = defineEmits(['save'])
const props = defineProps<{
  timestamp?: number
  meal?: IMeal
}>()

const DEFAULTS = {
  meal: props.meal?.meal || ('dinner' as IMeal['meal']),
  label: props.meal?.label || '',
  recipe: props.meal?.recipe || '',
  notes: props.meal?.notes || ''
}
const date = ref<number>(props.timestamp || DateTime.now().toSeconds())
const data = ref<any>({
  ...DEFAULTS
})

const onSave = () => {
  emit('save', data.value, date.value)
  data.value = { ...DEFAULTS }
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
            <Input :autofocus="false" id="mealName" type="text" v-model="data.label" label="Meal" />
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
