<script setup lang="ts">
import { FilterX } from 'lucide-vue-next'
import { unref, computed } from 'vue'

import CategoryFilterButton from '@/components/finance/CategoryFilterButton.vue'
import UserFilterButton from '@/components/finance/UserFilterButton.vue'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { type FilterContext } from '@/composables/filters'
import type { ICategory, ITransaction, IUser } from '@/lib/models'

const props = defineProps<{
  filterContext: FilterContext
  tx: ITransaction[]
  categories: ICategory[]
  users: IUser[]
}>()

const { filters, hasFilter, clearFilters, setFilter, deleteFilter, swoggleFilter } =
  props.filterContext

const toggleCategory = (id: string) => {
  if (hasFilter('byCategory')) {
    let selectedCategories = unref(filters.value.byCategory!!.categories)
    if (selectedCategories.includes(id)) {
      selectedCategories = selectedCategories.filter((c) => c !== id)
      setFilter('byCategory', {
        categories: selectedCategories
      })
      if (selectedCategories.length === 0) {
        deleteFilter('byCategory')
      }
    } else if (selectedCategories) {
      setFilter('byCategory', {
        categories: [...selectedCategories, id]
      })
    }
  } else {
    setFilter('byCategory', { categories: [id] })
  }
}
</script>

<template>
  <Accordion type="single" collapsible>
    <AccordionItem value="categories">
      <AccordionTrigger>
        <div class="flex w-full items-center justify-between pr-3 pl-1">
          <div class="py-2">Filters</div>
          <Button
            v-if="hasFilter('byCategory') || hasFilter('byUser')"
            variant="accent"
            class="h-8 px-2"
            @click.stop="clearFilters"
          >
            <FilterX class="size-6" />
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent class="bg-muted mt-2 space-y-2 rounded-lg p-2 pb-2">
        <div class="flex flex-wrap gap-2">
          <template v-for="u in users" :key="u.id">
            <UserFilterButton
              :active="!hasFilter('byUser') || unref(filters.byUser?.user_id) === u.id || false"
              :user="u"
              :transactions="computed(() => tx)"
              @toggle="(v: string) => swoggleFilter('byUser', { user_id: v })"
            />
          </template>
        </div>
        <div class="flex flex-wrap gap-2">
          <template v-for="c in categories" :key="c.id">
            <CategoryFilterButton
              :active="
                !hasFilter('byCategory') ||
                unref(filters.byCategory?.categories)?.includes(c.id) ||
                false
              "
              :category="c"
              :transactions="computed(() => tx)"
              @toggle="toggleCategory(c.id)"
            />
          </template>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
