<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:amount'])
const props = defineProps({
  amount: Number,
  credit: Boolean
})

const inner = computed({
  get () {
    return props.amount
  },
  set (val) {
    emit('update:amount', props.credit ? parseFloat(val) : -parseFloat(val))
  }
})

const reset = () => {
  emit('update:amount', 0)
}
defineExpose({ reset })
</script>

<template>
  <q-input
    mask="#.##"
    fill-mask="0"
    reverse-fill-mask
    placeholder="0.00"
    inputmode="numeric"
    input-class="text-right"
    v-model="inner"
  >
    <template #prepend>
      <q-icon name="mdi-cash-multiple"/>
    </template>
  </q-input>
</template>
