<script setup>
import NavChip from 'src/components/NavChip.vue'
import FinanceHeader from 'src/components/finance/FinanceHeader.vue'

import { useRecurrences } from 'src/composables/recurrences'
import { formatBalance } from 'src/balance'

const { recurrences: bills } = useRecurrences()
</script>

<template>
  <finance-header>
    <nav-chip path="/finance/transactions" icon="mdi-credit-card-multiple" label="Transactions"/>
  </finance-header>
  <q-page padding>
    <q-card>
      <q-list>
        <template v-for="bill in bills" :key="bill.id">
          <q-item>
            <q-item-section avatar class="col-shrink q-pr-md">
              <q-icon name="mdi-cash"/>
            </q-item-section>

            <q-item-section>
              <!-- label -->
              <q-item-label class="text-default text-capitalize">
                {{ bill.name }}
              </q-item-label>
              <q-item-label caption class="subtitle text-muted">
                {{ bill.period }}
              </q-item-label>
            </q-item-section>

            <q-item-section class="text-right">
              <!-- credit -->
              <q-item-label v-if="bill.amount > 0" class="text-credit">
                {{ formatBalance(Math.abs(bill.amount)) }}
              </q-item-label>
              <!-- debit -->
              <q-item-label v-else class="text-debit">
                {{ formatBalance(Math.abs(bill.amount)) }}
              </q-item-label>
              <!-- user -->
              <!-- <q-item-label caption class="subtitle text-muted">{{ user.name }}</q-item-label> -->
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-card>
  </q-page>
</template>
