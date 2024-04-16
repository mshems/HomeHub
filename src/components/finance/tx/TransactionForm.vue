<script setup>
import MoneyInput from '../inputs/MoneyInput.vue'
import UserSelect from '../inputs/UserSelect.vue'
import CategorySelect from '../inputs/CategorySelect.vue'
import TimestampInput from '../inputs/TimestampInput.vue'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['update:form'])
const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const moneyInput = ref(null)

const setCredit = () => {
  emit('update:form', { ...props.form, category: 'income' })
}

const setDebit = () => {
  emit('update:form', { ...props.form, category: 'other' })
}

const formDefault = ref({})
const setDefault = (val) => {
  formDefault.value = val
}
const reset = () => {
  emit('update:form', { ...formDefault.value })
}

onMounted(() => {
  formDefault.value = { ...props.form }
})

defineExpose({ reset, setDefault })
</script>

<template>

  <div class="row">
    <MoneyInput
      class="col-grow"
      filled
      ref="moneyInput"
      label="Amount"
      :amount="form.amount"
      @update:amount="val => emit('update:form', {...form, amount: val})"
      @credit="setCredit"
      @debit="setDebit"
    />
  </div>

  <CategorySelect
    :category="form.category"
    @update:category="val => emit('update:form', {...form, category: val})"
  />

  <q-input
    filled
    label="Label"
    :model-value="form.name"
    @update:model-value="val => emit('update:form', {...form, name: val})"
    required
  >
    <template #prepend>
      <q-icon name="mdi-label"/>
    </template>
  </q-input>

  <timestamp-input
    filled
    label="Date"
    :timestamp="form.timestamp"
    @update:timestamp="val => emit('update:form', {...form, timestamp: val})"
  />

  <UserSelect
    filled
    required
    label="User"
    :user="form.paid_by"
    @update:user="val => emit('update:form', {...form, paid_by: val})"
  />

  <q-input
    filled
    type="textarea"
    label="Notes"
    :model-value="form.notes"
    @update:model-value="val => emit('update:form', {...form, notes: val})"
    input-class="text-mono"
  >
    <template #prepend>
      <q-icon name="mdi-note"/>
    </template>
  </q-input>
</template>
