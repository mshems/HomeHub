<script setup>
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import NavChip from 'src/components/NavChip.vue'
import TransactionForm from 'src/components/finance/TransactionForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'

const router = useRouter()

const { currentUser } = useUsers()
const { create } = useTransactions()

const form = ref({
  category: 'other',
  name: '',
  paid_by: currentUser.value.id,
  amount: null,
  notes: '',
  timestamp: DateTime.now().toSeconds()
})

const resetForm = () => {
  txForm.value.reset()
}

const addTransaction = async () => {
  const payload = { ...form.value }
  create(payload)
    .then(() => router.push('/finance/transactions'))
    .catch(() => console.log('error'))
}

const txForm = ref(null)
</script>

<template>
  <finance-header>
    <nav-chip :path="`/finance/transactions`" icon="mdi-credit-card-multiple" label="Transactions"/>
    <nav-chip :path="`/finance/transactions/new`" icon="mdi-credit-card-plus" label="New Transaction"/>
  </finance-header>

  <q-page padding class="container">
    <q-card flat>
      <q-card-section class="card-title row items-center">
        <q-icon class="q-mr-sm" name="mdi-piggy-bank" color="pink-4" size="lg"/>
        New Transaction
      </q-card-section>
      <q-card-section>
        <q-form
          class="column q-gutter-sm"
          @submit="addTransaction"
          @reset="resetForm"
        >
          <transaction-form ref="txForm" v-model:form="form"/>
          <div class="column items-center q-gutter-sm">
            <q-btn unelevated type="submit" label="Create" color="positive" icon-right="mdi-credit-card-plus"/>
            <q-btn flat type="reset" label="Reset" color="negative"/>
            <q-btn flat label="cancel" @click="router.push('/finance/transactions')"/>
          </div>
          </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
