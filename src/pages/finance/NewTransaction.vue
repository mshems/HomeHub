<script setup>
import TransactionForm from 'src/components/finance/TransactionForm.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { useUserStore } from 'src/stores/user'
import { useRtdb } from 'src/composables/rtdb'

const router = useRouter()

const { add, users } = useRtdb()
const userStore = useUserStore()
const currentUser = computed(() => {
  for (const uid in users.value) {
    if (users.value[uid].email === userStore.email) return users.value[uid]
  }
  return {}
})

const type = ref('debit')
const form = ref({
  category: '',
  name: '',
  paid_by: currentUser.value.id,
  amount: 0,
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
  add('/data/finance/transactions', payload)
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
            <q-btn unelevated rounded type="submit" label="Submit" color="positive"/>
            <q-btn flat type="reset" label="Reset" color="negative"/>
            <q-btn flat label="cancel" @click="router.push('/finance/transactions')"/>
          </div>
          <div class="gt-xs row items-center q-gutter-sm">
            <q-btn flat rounded label="cancel" @click="router.push('/finance/transactions')"/>
            <q-btn unelevated rounded type="reset" label="Reset" color="negative"/>
            <q-btn unelevated rounded type="submit" label="Submit" color="positive"/>
          </div>
          </q-form>
      </q-card-section>
    </q-card>
  </q-page>
  <teleport to="#toolbar">
    <q-chip clickable icon="mdi-chevron-left" color="green-10" text-color="on-color" class="q-ma-none q-ml-xs text-bold" label="Transactions" @click="router.push('/finance/transactions')"/>
  </teleport>
</template>
