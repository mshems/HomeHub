<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { DateTime } from 'luxon'

import { formatBalance } from 'src/balance'
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'
import MoneyInput from 'src/components/finance/inputs/MoneyInput.vue'
import TimestampInput from 'src/components/finance/inputs/TimestampInput.vue'
import UserSelect from 'src/components/finance/inputs/UserSelect.vue'
import CategoryPopup from 'src/components/finance/tx/TxCategoryPopup.vue'
import TxEditableField from 'src/components/finance/tx/TxEditableField.vue'
import NavChip from 'src/components/NavChip.vue'
import { useTransaction } from 'src/composables/transaction'
import { useTransactions } from 'src/composables/transactions'
import { useUsers } from 'src/composables/users'

const $q = useQuasar()
const router = useRouter()
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { users } = useUsers()
const { get, update, remove } = useTransactions()
const { data: transaction, pending: loading } = get(props.id)
const { user, category, type } = useTransaction(transaction)

const transactionDate = computed(() => {
  if (loading.value) return ''
  return DateTime.fromSeconds(parseInt(transaction.value.timestamp)).toFormat('MMM d, yyyy')
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
const amountDialog = ref()
const showAmountDialog = ref(false)
const showCategoryDialog = ref(false)
</script>

<template>
  <finance-header>
    <nav-chip
      :path="`/finance/transactions`"
      icon="mdi-credit-card-multiple"
      label="Transactions"
    />
    <nav-chip
      :path="`/finance/transactions/${id}`"
      icon="mdi-cash"
      label="Details"
    />
  </finance-header>

  <q-page padding>
    <div class="container">
      <q-card
        v-if="loading"
        style="height: 88px"
        class="row items-center"
      >
        <q-spinner
          class="q-ml-md"
          size="lg"
          color="primary"
        />
        <q-space />
        <q-skeleton
          style="width: 200px; height: 32px"
          class="rounded q-mr-md"
          animation="none"
        />
      </q-card>
      <q-banner
        v-if="!transaction && !loading"
        flat
        rounded
        class="bg-negative text-on-color"
        icon="mdi-alert-rhombus"
      >
        <template #avatar>
          <q-icon name="mdi-alert-circle-outline" />
        </template>
        <div class="text-bold">
          Transaction not found
        </div>
      </q-banner>
      <q-card
        v-else
        :class="`bg-${type}-bg`"
      >
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
                :name="category.icon"
                size="xl"
              />
            </q-btn>
          </div>
          <q-space />
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
      <q-card
        v-if="!loading && transaction"
        class="q-mt-sm"
        style="font-size: 1rem;"
      >
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
              :display="transactionDate"
            >
              <q-popup-edit
                class="q-px-none"
                v-model="transaction.timestamp"
                v-slot="scope"
                auto-save
                @save="(val) => onUpdate({timestamp: val})"
              >
                <timestamp-input
                  dense
                  filled
                  v-model:timestamp="scope.value"
                  autofocus
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </tx-editable-field>

            <tx-editable-field
              icon="mdi-account"
              :field="transaction.paid_by"
              :display="user.name"
            >
              <q-popup-edit
                class="q-px-none"
                v-model="transaction.paid_by"
                v-slot="scope"
                auto-save
                @save="(val) => onUpdate({paid_by: val})"
              >
                <user-select
                  dense
                  filled
                  :users="users"
                  v-model:user="scope.value"
                  autofocus
                  @keyup.enter="scope.set"
                />
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
                <q-input
                  input-class="text-mono"
                  type="textarea"
                  dense
                  filled
                  v-model="scope.value"
                  autofocus
                  @keyup.enter.stop
                >
                  <template #prepend>
                    <q-icon name="mdi-note" />
                  </template>
                </q-input>
              </q-popup-edit>
            </tx-editable-field>
          </q-list>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            flat
            label="delete"
            color="negative"
            @click="confirm"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>

  <q-dialog
    ref="amountDialog"
    v-model="showAmountDialog"
    @hide="onUpdate({amount: transaction.amount})"
  >
    <q-card style="min-width: 300px;">
      <q-card-section
        class="card-title"
        style="font-size: 1rem;"
      >
        Amount
      </q-card-section>
      <q-card-section
        class="card-subtitle"
        style="font-size: 0.8rem;"
      >
        Enter a value
      </q-card-section>
      <q-card-section>
        <MoneyInput
          class="col-grow"
          ref="moneyInput"
          label="Amount"
          v-model:amount="transaction.amount"
          style="font-size: 1.5rem;"
          @keyup.enter="amountDialog.hide()"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <category-popup
    v-model="showCategoryDialog"
    :category="transaction?.category"
    @save="(val) => onUpdate({category: val})"
  />
</template>
