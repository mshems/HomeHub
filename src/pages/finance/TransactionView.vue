<script setup>
import UserSelect from 'src/components/finance/UserSelect.vue'
import TimestampInput from 'src/components/finance/TimestampInput.vue'
import NavChip from 'src/components/finance/NavChip.vue'
import { computed } from 'vue'
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
const type = computed(() => transaction.value ? ((transaction.value.amount < 0) ? 'debit' : 'credit') : 'default')
</script>

<template>
  <q-page padding>
    <q-card :class="`bg-${type}-bg`">
      <q-card-section :class="`row items-center justify-between q-py-xs text-on-${type}`">
        <div class="col">
          <q-spinner v-if="loading"/>
            <template v-else-if="transaction">
              <q-icon
                :class="`q-mr-xs text-on-${type}`"
                :name="categories[transaction.category].icon"
                size="xl"
              />
            </template>
        </div>
        <div class="col text-right ">
          <div style="font-size: 2.5rem;">
            <q-spinner v-if="loading"/>
            <div v-else>
              ${{ Math.abs(transaction?.amount).toFixed(2) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="!loading && transaction" class="q-mt-sm">
      <q-card-section class="q-pa-xs">
        <q-list class="q-px-none">
          <q-item class="rounded q-px-md" clickable>
            <q-item-section>
              <q-item-label>
                <q-icon name="mdi-label" class="q-mr-sm"/>{{ transaction.name }}
              </q-item-label>
            </q-item-section>
            <q-popup-edit class="q-px-none" v-model="transaction.name" v-slot="scope" auto-save @save="(val) => onUpdate({name: val})">
              <q-input dense filled v-model="scope.value" autofocus @keyup.enter="scope.set">
                <template #prepend>
                  <q-icon name="mdi-label"/>
                </template>
              </q-input>
            </q-popup-edit>
          </q-item>
          <q-item class="q-px-md rounded" clickable>
            <q-item-section>
              <q-item-label>
                <q-icon name="mdi-calendar" class="q-mr-sm"/>{{ transactionDate }}
              </q-item-label>
            </q-item-section>
            <q-popup-edit
              class="q-px-none"
              v-model="transaction.timestamp"
              v-slot="scope"
              auto-save
              @save="(val) => onUpdate({timestamp: val})"
            >
              <timestamp-input dense filled v-model:timestamp="scope.value" autofocus @keyup.enter="scope.set"/>
            </q-popup-edit>
          </q-item>
          <q-item class="q-px-md rounded" clickable>
            <q-item-section>
              <q-item-label>
                <q-icon name="mdi-account" class="q-mr-sm"/>{{ users[transaction.paid_by].name }}
              </q-item-label>
            </q-item-section>
            <q-popup-edit class="q-px-none" v-model="transaction.paid_by" v-slot="scope" auto-save @save="(val) => onUpdate({paid_by: val})">
              <user-select dense filled :users="users" v-model:user="scope.value" autofocus @keyup.enter="scope.set"/>
            </q-popup-edit>
          </q-item>
          <q-item class="q-px-md rounded" clickable>
            <q-item-section>
              <q-item-label>
                <q-icon name="mdi-note" class="q-mr-sm"/>Notes
              </q-item-label>
              <q-item-label class="subtitle text-muted">
                <div v-if="transaction.notes" class="q-my-xs" style="font-size: 0.8rem;">{{ transaction.notes }}</div>
              </q-item-label>
            </q-item-section>
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
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn label="edit" color="warning" :to="`/finance/transactions/${id}/edit`"/>
        <q-btn flat label="delete" color="negative" @click="confirm"/>
      </q-card-actions>
    </q-card>
  </q-page>
  <teleport to="#toolbar">
    <nav-chip :path="`/finance/transactions`" icon="mdi-credit-card-multiple" label="Transactions"/>
  </teleport>
</template>
