<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['update:amount'])
const props = defineProps({
  amount: Number,
  credit: Boolean
})

const input = ref()
const inner = computed({
  get () {
    return props.amount?.toFixed(2)
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
    ref="input"
    mask="#.##"
    fill-mask="0"
    reverse-fill-mask
    placeholder="0.00"
    inputmode="numeric"
    input-class="text-right"
    v-model="inner"
    @focus="input.select()"
  >
    <template #prepend>
      <q-icon name="mdi-cash-multiple"/>
    </template>
  </q-input>
</template>
