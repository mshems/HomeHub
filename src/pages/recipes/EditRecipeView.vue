<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import NavChip from 'src/components/NavChip.vue'
import RecipeEditor from 'src/components/recipes/RecipeEditor.vue'
import RecipesHeader from 'src/components/recipes/RecipesHeader.vue'
import { useCollection } from 'src/composables/collection'

const $q = useQuasar()
const router = useRouter()
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { update, get } = useCollection('data/recipes')
const onSave = (data) => {
  const payload = { ...data }
  update(props.id, payload)
    .then(() => {
      $q.notify({
        message: 'Recipe Updated',
        color: 'positive',
        icon: 'mdi-content-save'
      })
      router.push('/recipes/' + props.id)
    })
    .catch(() => {
      $q.notify({
        message: 'Could not update recipe',
        color: 'negative',
        icon: 'mdi-alert-rhombus'
      })
    })
}

</script>

<template>
  <recipes-header>
    <nav-chip
      :path="'/recipes/' + id"
      icon="mdi-pot-mix"
      label="Details"
    />
    <nav-chip
      :path="'/recipes/' + id + '/edit'"
      icon="mdi-pencil"
      label="Edit"
    />
  </recipes-header>
  <q-page
    padding
    class="container"
  >
    <q-form>
      <recipe-editor
        :recipe="get(id)"
        @save="onSave"
        @cancel="() => router.push('/recipes/' + id)"
      />
    </q-form>
  </q-page>
</template>
