<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:user'])
const props = defineProps({
  user: String,
  users: Object
})
const userOptions = computed(() => props.users ? Object.entries(props.users).map(([id, user]) => ({ label: user.name, value: id })) : [])

</script>

<template>
  <q-select
    :loading="users === undefined"
    emit-value
    map-options
    :options="userOptions"
    :model-value="user"
    @update:model-value="val => emit('update:user', val)"
    popup-content-class="bg-grey-3"
  >
    <template #prepend>
      <q-icon name="mdi-account"/>
    </template>
  </q-select>
</template>
