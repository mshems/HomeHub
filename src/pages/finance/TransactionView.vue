<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { useRtdb } from 'src/composables/rtdb'
import { useTransactions } from 'src/composables/transactions'

const router = useRouter()
const props = defineProps({
  id: String
})

const { categories, users } = useRtdb()
const { get, removeTx } = useTransactions()
const transaction = get(props.id)
const loading = computed(() => transaction.value === undefined)
const transactionDate = computed(() => {
  if (loading.value) return ''
  return DateTime.fromSeconds(parseInt(transaction.value.timestamp)).toLocaleString()
})

const onDelete = () => {
  transaction.value = {}
  removeTx(props.id).then(
    router.push('/finance/transactions')
  )
}

const type = computed(() => transaction.value ? ((transaction.value.amount < 0) ? 'debit' : 'credit') : 'default')
</script>

<template>
  <q-page padding>
    <q-card
      :class="`bg-${type}-bg`"
    >
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
            <div v-else>${{ Math.abs(transaction?.amount).toFixed(2) }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="!loading && transaction" class="q-mt-sm">
      <q-card-section class="row items-center no-wrap ellipsis">
        <q-icon name="mdi-label" class="q-mr-sm"/>{{ transaction.name }}
      </q-card-section>
      <q-card-section class="row items-center no-wrap ellipsis q-pt-none">
        <q-icon name="mdi-calendar" class="q-mr-sm"/>{{ transactionDate }}
      </q-card-section>
      <q-card-section class="row items-center no-wrap ellipsis q-pt-none">
        <q-icon name="mdi-account" class="q-mr-sm"/>{{ users[transaction.paid_by].name }}
      </q-card-section>
      <q-card-section class="row items-center q-pt-none q-px-sm">
        <div class="full-width rounded q-py-sm q-px-md bordered">
          <div class="text-muted">
            {{ transaction.notes || 'Notes' }}
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="q-mt-md row justify-center q-gutter-sm">
      <q-btn unelevated label="edit" color="warning" @click="router.push(`/finance/transactions/${id}/edit`)"/>
      <q-btn flat label="delete" color="negative" @click="onDelete"/>
    </div>
  </q-page>
  <teleport to="#toolbar">
    <q-chip clickable icon="mdi-chevron-left" color="green-10" text-color="on-color" class="q-ma-none q-ml-xs text-bold" label="Transactions" @click="router.push('/finance/transactions')"/>
  </teleport>
</template>

<style lang="scss">
// .debit {
//   background: $red-2;
//   // border: 1px solid $red-3;
// }
// .credit {
//   background: $green-2;
//   // border: 1px solid $green-3;
// }
// .text-debit {
//   color: $red-10;
// }
// .text-credit {
//   color: $green-10;
// }
</style>
