<script setup>
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['update:amount', 'update:credit', 'credit', 'debit'])
const props = defineProps({
  amount: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: 'Amount'
  }
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

const credit = ref(props.amount > 0)
watch(credit, () => {
  emit('update:amount', -props.amount)
})

const reset = () => {
  emit('update:amount', 0)
}
defineExpose({ reset })
</script>

<template>
  <div class="row">
    <q-input
      class="col"
      filled
      ref="input"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      placeholder="0.00"
      inputmode="numeric"
      input-class="text-right"
      :label="label"
      v-model="inner"
      @focus="input.select()"
    >
      <template #prepend>
        <q-icon name="mdi-cash-multiple" />
      </template>
    </q-input>
    <q-btn
      class="col-auto q-ml-xs"
      unelevated
      :outline="credit"
      color="debit"
      label="spend"
      @click="credit = false; emit('debit')"
    />
    <q-btn
      class="col-auto q-ml-xs"
      unelevated
      :outline="!credit"
      color="credit"
      label="save"
      @click="credit = true; emit('credit')"
    />
  </div>
</template>
