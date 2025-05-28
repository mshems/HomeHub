<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'

const emit = defineEmits(['delete'])
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  action: {
    type: String,
    default: 'Delete'
  }
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot>
        <Button size="icon" variant="ghostdestructive">
          <Trash2 :size="24" />
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[300px] rounded-md border-none sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="flex flex-row items-center pb-3 tracking-wide">
          <Trash2 :size="24" class="mr-3 text-destructive" />
          <div>
            {{ title }}
          </div>
        </DialogTitle>
        <DialogDescription class="font-serif">
          {{ message }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-3">
        <DialogClose as-child>
          <Button type="button" variant="ghost">Cancel</Button>
        </DialogClose>
        <DialogClose as-child>
          <Button type="button" variant="destructive" @click="() => emit('delete')">
            {{ action }}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
