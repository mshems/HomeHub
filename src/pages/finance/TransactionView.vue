<script setup>
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import CategorySelect from 'src/components/finance/CategorySelect.vue'
import MoneyInput from 'src/components/finance/MoneyInput.vue'
import TxEditableField from 'src/components/finance/tx/TxEditableField.vue'
import UserSelect from 'src/components/finance/UserSelect.vue'
import TimestampInput from 'src/components/finance/TimestampInput.vue'
import NavChip from 'src/components/finance/NavChip.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { DateTime } from 'luxon'
import { useRtdb } from 'src/composables/rtdb'
import { useTransactions } from 'src/composables/transactions'

const $q = useQuasar()
const router = useRouter()
const props = defineProps({
  id: String
})

const { categories, users } = useRtdb()
const { get, update, removeTx } = useTransactions()
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
  removeTx(props.id).then(() => {
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
  </finance-header>
  <q-page padding>
    <q-card :class="`bg-${type}-bg`">
      <q-card-section :class="`row items-center justify-between q-pa-xs text-on-${type}`">
        <div class="col-shrink">
          <q-spinner v-if="loading"/>
          <q-btn
            v-else-if="transaction"
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
            <q-spinner v-if="loading"/>
            <q-btn
              v-else-if="transaction"
              flat
              dense
              class="cursor-pointer rounded q-py-xs q-px-md"
              @click="showAmountDialog = true"
              style="font-size: 2.5rem; font-weight: 400;"
            >
              ${{ Math.abs(transaction?.amount).toFixed(2) }}
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
      <money-input
        filled
        :credit="type === 'credit'"
        v-model:amount="transaction.amount"
        style="font-size: 1.5rem;"
      >
      </money-input>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showCategoryDialog"
    @hide="onUpdate({category: transaction.category})"
  >
    <q-card style="min-width: 300px;">
      <category-select
        v-model:category="transaction.category"
        behavior="dialog"
      />
    </q-card>
  </q-dialog>
</template>
