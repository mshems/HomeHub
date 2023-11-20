<script setup>
import TxPopupEdit from './TxPopupEdit.vue'
const emit = defineEmits(['update:field', 'save'])

defineProps({
  field: [String, Number, Boolean, Object, Array],
  display: String,
  title: String,
  subtitle: String,
  icon: String,
  popupProps: Object
})
</script>

<template>
  <q-item class="rounded q-px-md" clickable>
    <slot name="content">
      <q-item-section>
        <q-item-label>
          <q-icon :name="icon" class="q-mr-sm"/>
          <slot name="display">
            {{ title || display || field }}
          </slot>
        </q-item-label>
        <q-item-label v-if="subtitle" class="subtitle text-muted">
          <div class="q-my-xs" style="font-size: 0.8rem;">{{ subtitle }}</div>
        </q-item-label>
      </q-item-section>
    </slot>
    <slot>
      <tx-popup-edit
        v-bind="popupProps"
        :display="display"
        :icon="icon"
        :field="field"
        @save="(val) => emit('save', val)"
        @update:field="(val) => emit('update:field', val)"
      />
    </slot>
  </q-item>
</template>
