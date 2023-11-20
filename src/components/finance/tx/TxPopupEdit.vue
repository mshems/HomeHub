<script setup>
const emit = defineEmits(['update:field', 'save'])
defineProps({
  field: [String, Number, Boolean, Object, Array],
  display: String,
  icon: String,
  inputProps: Object
})
</script>

<template>
  <q-popup-edit
    class="q-px-none"
    :model-value="field"
    @update:model-value="(val) => emit('update:field', val)"
    v-slot="scope"
    auto-save
    @save="(val) => emit('save', {name: val})"
  >
    <q-input v-bind="inputProps" dense filled v-model="scope.value" autofocus @keyup.enter="scope.set">
      <template #prepend>
        <q-icon :name="icon"/>
      </template>
    </q-input>
  </q-popup-edit>
</template>
