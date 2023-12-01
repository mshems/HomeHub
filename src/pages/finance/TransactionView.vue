<script setup>
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import CategoryPopup from 'src/components/finance/tx/TxCategoryPopup.vue'
import MoneyInput from 'src/components/finance/inputs/MoneyInput.vue'
import TxEditableField from 'src/components/finance/tx/TxEditableField.vue'
import UserSelect from 'src/components/finance/inputs/UserSelect.vue'
import TimestampInput from 'src/components/finance/inputs/TimestampInput.vue'
import NavChip from 'src/components/NavChip.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { DateTime } from 'luxon'
import { formatBalance } from 'src/balance'
import { useRtdb } from 'src/composables/rtdb'
import { useTransactions } from 'src/composables/transactions'
import { useCategories } from 'src/composables/categories'

const $q = useQuasar()
const router = useRouter()
const props = defineProps({
  id: String
})

const { users } = useRtdb()
const { categories } = useCategories()
const { get, update, remove } = useTransactions()
const { data: transaction, pending: loading } = get(props.id)

const transactionDate = computed(() => {
  if (loading.value) return ''
  return DateTime.fromSeconds(parseInt(transaction.value.timestamp)).toLocaleString()
})

const paidBy = computed(() => {
  if (loading.value) return ''
  return users.value[transaction.value.paid_by].name
})

const onUpdate = (data) => {
  const payload = { ...transaction.value, ...data }
  update(props.id, payload)
    .then(() => {
      $q.notify({
        message: 'Transaction Updated',
        color: 'positive',
        icon: 'mdi-content-save'
      })
    })
    .catch(() => {
      $q.notify({
        message: 'Could not update transaction',
        color: 'negative',
        icon: 'mdi-alert-rhombus'
      })
    })
}

const confirm = () => {
  $q.dialog({
    title: 'Delete Transaction',
    icon: 'mdi-delete',
    message: 'Are you sure? This cannot be undone.',
    ok: {
      'icon-right': 'mdi-delete',
      unelevated: true,
      label: 'delete',
      color: 'negative'
    },
    cancel: {
      flat: true,
      color: 'muted'
    }
  }).onOk(() => {
    onDelete()
  })
}

const onDelete = async () => {
  transaction.value = {}
  remove(props.id).then(() => {
    $q.notify({
      message: 'Transaction deleted',
      color: 'negative',
      icon: 'mdi-delete'
    })
    router.push('/finance/transactions')
  }
  )
}
const showAmountDialog = ref(false)
const showCategoryDialog = ref(false)
const type = computed(() => transaction.value ? ((transaction.value.amount < 0) ? 'debit' : 'credit') : 'default')
</script>

<template>
  <finance-header>
    <nav-chip :path="`/finance/transactions`" icon="mdi-credit-card-multiple" label="Transactions"/>
    <nav-chip :path="`/finance/transactions/${id}`" icon="mdi-cash" label="Transaction Info"/>
  </finance-header>
  <q-page padding>
    <q-card v-if="loading" style="height: 88px" class="row items-center">
      <q-spinner class="q-ml-md" size="lg" color="primary"/>
      <q-space/>
      <q-skeleton style="width: 200px; height: 32px" class="rounded q-mr-md" animation="none"/>
    </q-card>
    <q-card v-else :class="`bg-${type}-bg`">
      <q-card-section :class="`row items-center justify-between q-pa-xs text-on-${type}`">
        <div class="col-shrink">
          <q-btn
            v-if="transaction"
            flat
            dense
            class="cursor-pointer rounded q-py-xs q-px-sm"
            @click="showCategoryDialog = true"
            style="font-size: 2.5rem; font-weight: 400;"
          >
            <q-icon
              :class="`text-on-${type}`"
              :name="categories[transaction.category].icon"
              size="xl"
            />
          </q-btn>
        </div>
        <q-space/>
        <div class="col-shrink text-right ">
          <div style="font-size: 2.5rem;">
            <q-btn
              v-if="!loading && transaction"
              flat
              dense
              class="cursor-pointer rounded q-py-xs q-px-md"
              @click="showAmountDialog = true"
              style="font-size: 2.5rem; font-weight: 400;"
            >
              {{ formatBalance(Math.abs(transaction?.amount)) }}
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-if="!loading && transaction" class="q-mt-sm">
      <q-card-section class="q-pa-xs">
        <q-list class="q-px-none">
          <tx-editable-field
            v-model:field="transaction.name"
            icon="mdi-label"
            @save="onUpdate"
          />

          <tx-editable-field
            icon="mdi-calendar"
            :field="transaction.timestamp"
            :display="transactionDate">
            <q-popup-edit
              class="q-px-none"
              v-model="transaction.timestamp"
              v-slot="scope"
              auto-save
              @save="(val) => onUpdate({timestamp: val})"
            >
              <timestamp-input dense filled v-model:timestamp="scope.value" autofocus @keyup.enter="scope.set"/>
            </q-popup-edit>
          </tx-editable-field>

          <tx-editable-field
            icon="mdi-account"
            :field="transaction.paid_by"
            :display="paidBy"
          >
            <q-popup-edit
              class="q-px-none"
              v-model="transaction.paid_by"
              v-slot="scope"
              auto-save
              @save="(val) => onUpdate({paid_by: val})"
            >
              <user-select dense filled :users="users" v-model:user="scope.value" autofocus @keyup.enter="scope.set"/>
            </q-popup-edit>
          </tx-editable-field>

          <tx-editable-field
            v-model:field="transaction.notes"
            title="Notes"
            icon="mdi-note"
            :subtitle="transaction.notes"
          >
            <q-popup-edit
              class="q-px-none"
              v-model="transaction.notes"
              v-slot="scope"
              buttons
              auto-save
              label-set="save"
              @save="(val) => onUpdate({notes: val})"
              anchor="top middle"
            >
              <q-input type="textarea" dense filled v-model="scope.value" autofocus @keyup.enter.stop/>
            </q-popup-edit>
          </tx-editable-field>
        </q-list>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="delete" color="negative" @click="confirm"/>
      </q-card-actions>
    </q-card>
  </q-page>

  <q-dialog
    v-model="showAmountDialog"
    @hide="onUpdate({amount: transaction.amount})"
  >
    <q-card style="min-width: 300px;">
      <q-card-section class="card-title" style="font-size: 1rem;">
        Amount
      </q-card-section>
      <q-card-section class="card-subtitle" style="font-size: 0.8rem;">
        Enter a value
      </q-card-section>
      <q-card-section>
        <money-input
          filled
          :credit="transaction.category === 'income'"
          v-model:amount="transaction.amount"
          style="font-size: 1.5rem;"
          >
        </money-input>
      </q-card-section>
    </q-card>
  </q-dialog>

  <category-popup
    v-model="showCategoryDialog"
    :category="transaction?.category"
    @save="(val) => onUpdate({category: val})"
  />
</template>
src/balance
