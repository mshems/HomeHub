<script setup>
import { computed } from 'vue'
import { useCategories } from 'src/composables/categories'

const emit = defineEmits(['update:category'])
defineProps({
  category: String
})
const { categories } = useCategories()
const categoryOptions = computed(() => categories.value ? Object.entries(categories.value).map(([k, v]) => v.name) : [])
</script>

<template>
  <q-select
    filled
    label="Category"
    required
    :model-value="category"
    :loading="categories === undefined"
    :options="categoryOptions"
    @update:model-value="val => emit('update:category', val)"
  >
    <template #prepend><q-icon name="mdi-tag"/></template>
    <template #selected-item="{opt}">
      <div v-if="opt">
        <q-icon
          class="q-mr-sm"
          :color="(categories !== undefined) ? categories[opt]?.color : 'grey-5'"
          :name="(categories !== undefined) ? categories[opt]?.icon : 'mdi-question'"
        />
        <span class="text-capitalize">{{ opt }}</span>
      </div>
    </template>
    <template #option="{itemProps, opt}">
      <q-item
        class="rounded q-ma-xs hoverable"
        v-bind="itemProps"
        :active="category === opt.name"
        v-close-popup
      >
        <q-item-section avatar>
          <q-icon
            :color="(categories !== undefined) ? categories[opt].color : 'grey-5'"
            :name="(categories !== undefined) ? categories[opt].icon : 'mdi-question'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">{{ opt }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
