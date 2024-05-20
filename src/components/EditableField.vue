<script setup>
import PopupEdit from './PopupEdit.vue'

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
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  popupProps: {
    type: Object,
    default: () => ({})
  },
  labelClasses: {
    type: String,
    default: ''
  }

})
</script>

<template>
  <q-item
    class="rounded q-px-md"
    clickable
  >
    <slot name="content">
      <q-item-section>
        <q-item-label :class="labelClasses">
          <q-icon
            v-if="icon"
            :name="icon"
            class="q-mr-sm"
          />
          <slot name="display">
            {{ title || display || field }}
          </slot>
        </q-item-label>
        <q-item-label
          v-if="subtitle"
          class="subtitle text-muted"
        >
          <div
            class="q-my-xs"
            style="font-size: 0.8rem;"
          >
            {{ subtitle }}
          </div>
        </q-item-label>
      </q-item-section>
    </slot>
    <slot>
      <popup-edit
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
./PopupEdit.vue
