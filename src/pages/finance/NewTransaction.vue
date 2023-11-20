<script setup>
import NavChip from 'src/components/finance/NavChip.vue'
import TransactionForm from 'src/components/finance/TransactionForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'

const router = useRouter()

const { currentUser } = useUsers()
const { create } = useTransactions()

const type = ref('debit')
const form = ref({
  category: '',
  name: '',
  paid_by: currentUser.value.id,
  amount: null,
  notes: '',
  timestamp: DateTime.now().toFormat('yyyy-MM-dd')
})

const setType = (t) => {
  if (t === 'credit') {
    form.value.category = 'income'
  } else if (type.value !== t) {
    form.value.category = ''
  }
  type.value = t
}

const resetForm = () => {
  txForm.value.reset()
}

const addTransaction = async () => {
  const payload = { ...form.value }
  payload.timestamp = DateTime.fromFormat(payload.timestamp, 'yyyy-MM-dd').toSeconds()
  if (type.value === 'debit') {
    payload.amount = -payload.amount
  }
  console.log(payload)
  create(payload)
    .then(() => router.push('/finance/transactions'))
    .catch(() => console.log('error'))
}

const txForm = ref(null)

</script>

<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="lt-sm row items-center justify-between q-gutter-sm q-pb-none">
        <q-btn class="" unelevated :outline="type !== 'debit'" color="debit" rounded label="spend" @click="setType('debit')"/>
        <q-icon class="" name="mdi-piggy-bank" color="pink-4" size="xl"/>
        <q-btn class="" unelevated :outline="type !== 'credit'" color="credit" rounded label="save" @click="setType('credit')"/>
      </q-card-section>
      <q-card-section class="gt-xs row items-center justify-start q-gutter-sm q-pb-none">
        <q-btn class="" unelevated :outline="type !== 'debit'" color="debit" rounded label="spend" @click="setType('debit')"/>
        <q-icon class="" name="mdi-piggy-bank" color="pink-4" size="xl"/>
        <q-btn class="" unelevated :outline="type !== 'credit'" color="credit" rounded label="save" @click="setType('credit')"/>
      </q-card-section>
      <q-card-section>
        <q-form
          class="column q-gutter-sm"
          @submit="addTransaction"
          @reset="resetForm"
        >
          <transaction-form ref="txForm" v-model:form="form"/>
          <div class="lt-sm column items-center q-gutter-sm">
            <q-btn unelevated type="submit" label="Create" color="positive" icon-right="mdi-cash-plus"/>
            <q-btn flat type="reset" label="Reset" color="negative"/>
            <q-btn flat label="cancel" @click="router.push('/finance/transactions')"/>
          </div>
          <div class="gt-xs row items-center q-gutter-sm">
            <q-btn flat label="cancel" @click="router.push('/finance/transactions')"/>
            <q-btn unelevated type="reset" label="Reset" color="negative"/>
            <q-btn unelevated type="submit" label="Create" color="positive" icon-right="mdi-cash-plus"/>
          </div>
          </q-form>
      </q-card-section>
    </q-card>
  </q-page>
  <teleport to="#toolbar">
    <nav-chip :path="`/finance/transactions`" icon="mdi-credit-card-multiple" label="Transactions"/>
  </teleport>
</template>
