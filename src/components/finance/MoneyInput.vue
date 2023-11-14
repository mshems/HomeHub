<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:money'])
defineProps({
  money: Number,
  label: String
})

const rawValue = ref('')

const set = (val) => {
  rawValue.value = val
  emit('update:money', Number.parseFloat(val).toFixed(2))
}

const reset = () => {
  rawValue.value = ''
  emit('update:money', 0)
}

defineExpose({ reset, set })
</script>

<template>
  <div>
    <q-input
      filled
      :label="label"
      mask="#.##"
      reverse-fill-mask
      placeholder="0.00"
      inputmode="numeric"
      input-class="text-right"
      required
      v-model="rawValue"
      @update:model-value="emit('update:money', Number.parseFloat(rawValue))"
    >
      <template #prepend>
        <q-icon name="mdi-cash-multiple"/>
      </template>
    </q-input>
  </div>
</template>
