<script setup>
import NavChip from 'src/components/finance/NavChip.vue'
import TransactionForm from 'src/components/finance/TransactionForm.vue'
import { ref } from 'vue'
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
</script>

<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="card-title row justify-center items-center">
        <q-icon name="mdi-pencil-box" color="warning" size="lg"/>
        <span class="text-default">Edit Transaction</span>
      </q-card-section>
      <q-card-section>
        <q-form
          class="column q-gutter-sm"
          @submit="updateTransaction"
          @reset="resetForm"
        >
          <transaction-form ref="txForm" v-model:form="form"/>
          <div class="lt-sm column items-center q-gutter-sm">
            <q-btn unelevated rounded type="submit" label="Save" color="positive" icon-right="mdi-content-save"/>
            <q-btn flat type="reset" label="Reset" color="negative"/>
            <q-btn flat label="cancel" @click="router.push(`/finance/transactions/${id}`)"/>
          </div>
          <div class="gt-xs row items-center q-gutter-sm">
            <q-btn flat label="cancel" @click="router.push(`/finance/transactions/${id}`)"/>
            <q-btn unelevated rounded type="reset" label="Reset" color="negative"/>
            <q-btn unelevated rounded type="submit" label="Save" color="positive" icon-right="mdi-content-save"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
  <teleport to="#toolbar">
    <nav-chip :path="`/finance/transactions`" icon="mdi-credit-card-multiple" label="Transactions"/>
    <nav-chip :path="`/finance/transactions/${id}`" icon="mdi-cash" label="Transaction"/>
  </teleport>
</template>
