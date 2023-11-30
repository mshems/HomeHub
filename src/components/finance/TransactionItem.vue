<script setup>
import { computed } from 'vue'
import { DateTime } from 'luxon'
import { formatBalance } from 'src/balance'
const emit = defineEmits(['delete', 'view'])
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  category: {
    type: [Object, Boolean],
    required: true
  },
  user: {
    type: Object,
    required: true
  }
})

const transactionDate = computed(() => {
  return DateTime.fromSeconds(parseInt(props.item.timestamp)).toLocaleString()
})

const onClick = () => {
  emit('view', props.item)
}
</script>

<template>
  <q-item class="q-px-md q-py-sm" clickable @click="onClick">
    <q-item-section avatar class="col-shrink q-pr-md">
      <q-icon :name="category.icon || 'mdi-cash'" :color="category.color || 'grey-5'"></q-icon>
    </q-item-section>

    <q-item-section>
      <!-- label -->
      <q-item-label>
        {{ item.name }}
      </q-item-label>
      <!-- date -->
      <q-item-label caption class="row items-center subtitle text-muted">
        {{ transactionDate }}
        <q-icon v-if="item.notes" class="text-muted q-ml-xs" name="mdi-note"/>
      </q-item-label>
    </q-item-section>

    <q-item-section class="text-right">
      <!-- credit -->
      <q-item-label v-if="item.amount > 0" class="text-credit">
        {{ formatBalance(Math.abs(item.amount)) }}
      </q-item-label>
      <!-- debit -->
      <q-item-label v-else class="text-debit">
        {{ formatBalance(Math.abs(item.amount)) }}
      </q-item-label>
      <!-- user -->
      <q-item-label caption class="subtitle text-muted">{{ user.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
src/balance
