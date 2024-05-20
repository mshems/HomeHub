<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:field', 'save'])
defineProps({
  field: {
    type: [String, Number, Boolean, Object, Array],
    required: true
  },
  display: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  inputProps: {
    type: Object,
    default: () => ({})
  }
})
const input = ref()
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
    <q-input
      ref="input"
      v-bind="inputProps"
      dense
      filled
      v-model="scope.value"
      autofocus
      @keyup.enter="scope.set"
    >
      <template #prepend>
        <q-icon :name="icon" />
      </template>
    </q-input>
  </q-popup-edit>
</template>
