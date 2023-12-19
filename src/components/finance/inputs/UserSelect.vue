<script setup>
import { computed } from 'vue'
import { useUsers } from 'src/composables/users'

const emit = defineEmits(['update:user'])
const props = defineProps({
  user: String
})

const { users } = useUsers()
const userOptions = computed(() => users.value ? Object.entries(users.value).map(([id, user]) => ({ label: user.name, value: id })) : [])

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
