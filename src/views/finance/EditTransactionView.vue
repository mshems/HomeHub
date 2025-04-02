<script setup lang="ts">
import { TagIcon, Wallet } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AutoBreadcrumbs from '@/components/ui/breadcrumb/AutoBreadcrumbs.vue'
import Button from '@/components/ui/button/Button.vue'
import { Card, CardHeader, CardContent } from '@/components/ui/card/'
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'
import CategoryIcon from '@/components/ui/icon/CategoryIcon.vue'
import { InputWithIcon } from '@/components/ui/input'
import Label from '@/components/ui/label/Label.vue'
import MoneyInput from '@/components/ui/money-input/MoneyInput.vue'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { useAuth } from '@/composables/auth'
import { getCategoriesList } from '@/composables/categories'
import { getTransaction, useTransactionDetails, useTransactions } from '@/composables/transactions'
import { getUsersList } from '@/composables/users'

const route = useRoute()
const router = useRouter()

const updating = computed(() => !!route.query.id)

const categories = getCategoriesList()
const categoryData = computed(() => Object.fromEntries(categories.value.map((c) => [c.id, c])))

const users = getUsersList()
const userData = computed(() => Object.fromEntries(users.value.map((u) => [u.id, u])))

const credit = ref(false)
const data = ref({
  name: undefined as string | undefined,
  amount: 0,
  category: 'other' as string | undefined,
  notes: '',
  paid_by: undefined as string | undefined,
  timestamp: DateTime.now().toSeconds()
})

if (updating.value) {
  const tx = getTransaction(route.query.id as string)
  tx.promise.value.then((res) => {
    if (res) {
      credit.value = res.amount > 0
      data.value = {
        name: res.name,
        amount: Math.abs(res.amount),
        category: res.category,
        notes: res.notes,
        paid_by: res.paid_by,
        timestamp: res.timestamp
      }
    }
  })
}

const { user } = useAuth()
watchEffect(() => {
  if (!data.value.paid_by) {
    data.value.paid_by = user.value?.id || ''
  }
})

const { create, update } = useTransactions()
const payload = computed(() => {
  const pl = { ...data.value }
  pl.amount = credit.value ? pl.amount : -pl.amount
  return pl
})

const addTransaction = async () => {
  create(payload.value)
    .then(() => router.push('/finance/transactions'))
    .catch(() => console.log('error'))
}

const onBack = () => {
  if (updating.value) {
    router.push('/finance/transactions/' + route.query.id)
  } else {
    router.push('/finance/transactions')
  }
}

const onSave = () => {
  if (updating.value) {
    update(route.query.id as string, payload.value)
      .then(() => router.push('/finance/transactions/' + route.query.id))
      .catch(() => console.log('error'))
  } else {
    addTransaction()
  }
}

const breadcrumbs: Record<string, string> = {
  Transactions: '/finance/transactions'
}
if (updating.value) {
  const id = route.query.id as string
  const { data: tx, dateTime } = useTransactionDetails(id)
  breadcrumbs[tx.value?.name || 'Details'] = '/finance/transactions/' + id
  breadcrumbs['Transactions'] =
    `/finance/transactions?m=${dateTime.value?.month}&y=${dateTime.value?.year}`
}
</script>

<template>
  <div class="container flex max-w-[800px] flex-col gap-5 py-8">
    <AutoBreadcrumbs :page="updating ? 'Edit' : 'New'" :items="breadcrumbs" no-dashboard />
    <Card>
      <CardHeader>
        <h2 class="flex items-center gap-3 font-title text-2xl font-semibold">
          <Wallet class="h-8 w-8" />
          {{ updating ? 'Edit' : 'New' }} Transaction
        </h2>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSave" class="space-y-5">
          <div>
            <Label for="amount">Amount</Label>
            <div className="flex items-center  sm:gap-3 sm:flex-nowrap flex-wrap">
              <MoneyInput
                v-model:amount="data.amount"
                :class="`mb-3 flex-shrink sm:mb-0 ${credit ? 'text-positive-typography' : 'text-negative-typography'}`"
              />
              <div class="flex w-full gap-3 sm:w-auto">
                <Button
                  class="w-1/2 sm:w-auto"
                  type="button"
                  :variant="credit ? 'secondary' : 'negative'"
                  @click="credit = false"
                >
                  Expense
                </Button>
                <Button
                  class="w-1/2 sm:w-auto"
                  type="button"
                  :variant="credit ? 'positive' : 'secondary'"
                  @click="
                    () => {
                      credit = true
                      data.category = 'income'
                    }
                  "
                >
                  Income
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Label for="name">Label</Label>
            <InputWithIcon id="name" v-model="data.name" required>
              <TagIcon class="h-4 w-4" />
            </InputWithIcon>
          </div>
          <div>
            <Label for="category">Category</Label>
            <Select id="category" v-model="data.category" required>
              <SelectTrigger>
                <template v-if="data.category">
                  <div class="flex items-center gap-5">
                    <CategoryIcon :category="data.category" class="size-5" />
                    <span class="capitalize">{{ categoryData[data.category]?.name }}</span>
                  </div>
                </template>
                <span class="text-muted-foreground" v-else>Select a category</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in categories" :key="c.id" :value="c.id">
                  <div class="flex items-center gap-5">
                    <CategoryIcon :category="c.id" class="size-5" />
                    <span class="capitalize">{{ c.name }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="paid_by">User</Label>
            <Select id="paid_by" v-model="data.paid_by">
              <SelectTrigger>
                <template v-if="data.paid_by">
                  <div class="flex items-center gap-5">
                    {{ userData[data.paid_by].name }}
                  </div>
                </template>
                <span class="text-muted-foreground" v-else>Select a User</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="u in users" :key="u.id" :value="u.id">
                  <div class="flex items-center gap-5">
                    <span>{{ u.name }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <DatePicker v-model:timestamp="data.timestamp" />
          </div>
          <div>
            <Label for="notes">Notes</Label>
            <Textarea id="notes" v-model="data.notes" type="text" />
          </div>

          <div class="flex justify-between gap-3 pt-5">
            <Button type="button" variant="ghost" @click="onBack">Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
