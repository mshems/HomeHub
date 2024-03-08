<script setup>
import NavChip from 'src/components/NavChip.vue'
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'

import { useRecurrences } from 'src/composables/recurrences'
import { formatBalance, color } from 'src/balance'
import { useUsers } from 'src/composables/users'

const { users } = useUsers()
const { recurrences: bills } = useRecurrences()
</script>

<template>
  <finance-header>
    <nav-chip path="/finance/transactions" icon="mdi-credit-card-multiple" label="Transactions"/>
  </finance-header>
  <q-page padding class="container">
    <q-card>
      <q-card-section class="card-title">
        Bills
      </q-card-section>
      <q-list>
        <template v-for="bill in bills" :key="bill.id">
          <q-item>
            <q-item-section avatar class="col-shrink q-pr-md">
              <q-icon name="mdi-cash" :color="color(bill.amount)"/>
            </q-item-section>

            <q-item-section>
              <!-- label -->
              <q-item-label class="text-default text-capitalize">
                {{ bill.name }}
              </q-item-label>
              <q-item-label caption class="subtitle text-muted text-capitalize">
                <q-icon name="mdi-repeat" color="muted"/>
                {{ bill.period }}
              </q-item-label>
            </q-item-section>

            <q-item-section class="text-right">
              <!-- amount -->
              <q-item-label :class="`text-${color(bill.amount)}`">
                {{ formatBalance(Math.abs(bill.amount)) }}
              </q-item-label>
              <!-- user -->
              <q-item-label caption class="subtitle text-muted">{{ users[bill.paid_by]?.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-card>
  </q-page>
</template>
