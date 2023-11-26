<script setup>
import { ref } from 'vue'
import { useCategories } from 'src/composables/categories'

const emit = defineEmits(['save', 'cancel'])
const props = defineProps({
  category: String
})

const { categories } = useCategories()
const dialog = ref(null)
const newVal = ref(props.category)

const save = () => {
  if (newVal.value !== props.category) {
    emit('save', newVal.value)
  }
  dialog.value.hide()
}

const onSelect = (category) => {
  newVal.value = category
  dialog.value.hide()
}
</script>

<template>
  <q-dialog
    ref="dialog"
    @hide="save"
  >
    <q-card style="min-width: 300px;">
      <q-card-section class="card-title" style="font-size: 1rem;">
        Category
      </q-card-section>
      <q-card-section class="card-subtitle" style="font-size: 0.8rem;">
        Click to select
      </q-card-section>
      <q-card-section class="q-px-xs q-pb-none">
        <q-list>
          <template v-for="category, i in categories" :key="i">
            <q-item
              class="rounded q-my-xs"
              :active="newVal === category.name"
              active-class="selected"
              clickable
              @click="onSelect(category.name)"
            >
              <q-item-section class="col-shrink">
                <q-icon :name="category.icon" :color="category.color" size="md"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-capitalize">{{ category.name }}</q-item-label>
              </q-item-section>
            </q-item>
            </template>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
