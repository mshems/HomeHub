<script setup>
import { ref, computed } from 'vue'
import { useUsers } from 'src/composables/users'

const emit = defineEmits(['update:user'])
defineProps({
  user: String
})

const { users } = useUsers()
const userOptions = computed(() => users.value ? Object.entries(users.value).map(([id, user]) => ({ label: user.name, value: id, color: user.color })) : [])
const userSelect = ref()
</script>

<template>
  <q-select
    ref="userSelect"
    :loading="users === undefined"
    emit-value
    map-options
    :options="userOptions"
    :model-value="user"
    @update:model-value="val => emit('update:user', val)"
  >
    <template #prepend>
      <q-icon name="mdi-account"/>
    </template>
    <template v-slot:option="{itemProps, opt, selected}">
      <q-item
        class="rounded q-ma-xs hoverable"
        v-bind="itemProps"
        :active="selected"
        v-close-popup
      >
        <q-item-section avatar>
          <q-avatar size="sm" :color="opt.color" class="text-on-color text-bold">
            {{ opt.label[0] }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
