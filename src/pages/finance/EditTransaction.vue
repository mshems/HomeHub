<script setup>
import TransactionForm from 'src/components/finance/TransactionForm.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { useTransactions } from 'src/composables/transactions'

const props = defineProps({
  id: String
})

const router = useRouter()

const form = ref({})
const { get, update } = useTransactions()
const updateTransaction = async () => {
  const payload = { ...form.value }
  payload.timestamp = DateTime.fromFormat(payload.timestamp, 'yyyy-MM-dd').toSeconds()
  if (payload.category !== 'income') payload.amount = -payload.amount
  update(props.id, payload)
    .then(() => router.push(`/finance/transactions/${props.id}`))
    .catch(() => console.log('error'))
}

const txForm = ref(null)
const resetForm = () => {
  txForm.value.reset()
}

onMounted(() => {
  const { data, promise } = get(props.id)
  promise.value.then(() => {
    const defaultValue = {
      category: data.value.category,
      name: data.value.name,
      paid_by: data.value.paid_by,
      amount: Math.abs(data.value.amount),
      notes: data.value.notes,
      timestamp: DateTime.fromSeconds(data.value.timestamp).toFormat('yyyy-MM-dd')
    }
    txForm.value.setDefault(defaultValue)
    form.value = { ...defaultValue }
  })
})
</script>

<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="card-title row justify-center">
        <q-icon name="mdi-piggy-bank" color="pink-4" size="xl"/>
      </q-card-section>
      <q-card-section>
        <q-form
          class="column q-gutter-sm"
          @submit="updateTransaction"
          @reset="resetForm"
        >
          <transaction-form ref="txForm" v-model:form="form"/>
          <q-btn unelevated rounded type="submit" label="Submit" color="positive" class="q-mt-md"/>
          <q-btn flat type="reset" label="Reset" color="negative"/>
          <q-btn flat label="cancel" @click="router.push(`/finance/transactions/${id}`)"/>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
  <teleport to="#toolbar">
    <q-chip clickable icon="mdi-chevron-left" color="green-10" text-color="on-color" class="q-ma-none q-ml-xs text-bold" label="Transactions" @click="router.push('/finance/transactions')"/>
  </teleport>
</template>
