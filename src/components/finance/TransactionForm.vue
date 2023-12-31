<script setup>
import UserSelect from './inputs/UserSelect.vue'
import CategorySelect from './inputs/CategorySelect.vue'
import MoneyInput from 'src/components/finance/inputs/MoneyInput.vue'
import TimestampInput from './inputs/TimestampInput.vue'
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
  <timestamp-input
    filled
    label="Date"
    :timestamp="form.timestamp"
    @update:timestamp="val => emit('update:form', {...form, timestamp: val})"
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

  <CategorySelect
    :category="form.category"
    @update:category="val => emit('update:form', {...form, category: val})"
  />
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
  >
    <template #prepend>
      <q-icon name="mdi-note"/>
    </template>
  </q-input>
</template>
