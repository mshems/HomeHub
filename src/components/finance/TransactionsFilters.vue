<script setup>
import CategoryChip from './CategoryChip.vue'

import { toRef } from 'vue'
import { useCategories } from 'src/composables/categories'
// import { useUsers } from 'src/composables/users'

const emit = defineEmits(['update:filters'])
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  },
  transactions: {
    type: Array,
    default: () => []
  }
})

// const { users } = useUsers(toRef(() => props.transactions))
// const onSelectUser = (user) => {
//   if (props.filters.userId === user.id) emit('update:filters', { ...props.filters, userId: null })
//   else emit('update:filters', { ...props.filters, userId: user.id })
// }

const { categories } = useCategories(toRef(() => props.transactions))
const onSelectCategory = (category) => {
  if (props.filters.category === category.name) emit('update:filters', { ...props.filters, category: null })
  else emit('update:filters', { ...props.filters, category: category.name })
}

const isSelectedCategory = (category) => {
  return (props.filters.category === null) || (props.filters.category === category.name)
}

// const clearFilters = () => {
//   emit('update:filters', {})
// }
</script>

<template>
  <div class="row q-pt-sm q-px-sm">
    <template v-for="category, i in categories" :key="i">
      <div class="col-auto q-mr-xs q-mb-sm">
        <category-chip
          :category="category"
          :selected="isSelectedCategory(category)"
          @click="onSelectCategory(category)"
          style="font-size: 0.8rem;"
        />
      </div>
    </template>
  </div>
</template>
