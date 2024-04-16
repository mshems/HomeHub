<script setup>
// import HorizontalStackedBar from '../charts/HorizontalStackedBar.vue'

// import { computed } from 'vue'
// import { useTransactions } from 'src/composables/transactions'

const emit = defineEmits(['prev', 'next', 'current'])
defineProps({
  date: {
    type: Object,
    required: true
  },
  transactions: {
    type: [Array, Object],
    required: true
  },
  filters: {
    type: Object,
    default: () => ({})
  }
})

// const { total, filter } = useTransactions()
// const spent = computed(() => total(filter(props.transactions, { type: 'debit' })))
// const saved = computed(() => total(filter(props.transactions, { type: 'credit' })))

const onSwipeMonth = ({ evt, ...info }) => {
  if (info.direction === 'left') emit('next')
  else emit('prev')
}

</script>

<template>
  <div>
    <q-card-section class="q-pa-none">
      <div
        v-touch-swipe.mouse="onSwipeMonth"
        class="cursor-pointer row no-wrap justify-between"
      >
        <div
          class="lt-sm flex"
          style="width: 50px;"
        >
          <q-btn
            size="md"
            color="default"
            dense
            flat
            icon="mdi-chevron-left"
            @click="emit('prev')"
          />
        </div>

        <div class="lt-sm title q-py-sm text-bold">
          {{ date.monthLong }} {{ date.year }}
        </div>
        <div class="gt-xs q-py-sm title text-bold">
          {{ date.monthLong }} {{ date.year }}
        </div>

        <div class="lt-sm flex">
          <q-btn
            class="q-mr-xs"
            size="md"
            color="default"
            dense
            flat
            icon="mdi-calendar"
            @click="emit('current')"
          />
          <q-btn
            size="md"
            color="default"
            dense
            flat
            icon="mdi-chevron-right"
            @click="emit('next')"
          />
        </div>
        <div class="gt-xs row items-center q-gutter-xs">
          <q-btn
            color="default"
            dense
            flat
            icon="mdi-chevron-left"
            @click="emit('prev')"
          />
          <q-btn
            color="default"
            dense
            flat
            icon="mdi-calendar"
            @click="emit('current')"
          />
          <q-btn
            color="default"
            dense
            flat
            icon="mdi-chevron-right"
            @click="emit('next')"
          />
        </div>
      </div>
    </q-card-section>
    <!-- <horizontal-stacked-bar
      v-if="(spent !== null && saved !== null)"
      class="q-px-sm"
      :title="date.monthLong"
      :datasets="[
        { label: 'Saved', value: saved, color: 'credit' },
        { label: 'Spent', value: Math.abs(spent), color: 'debit' },
      ]"
    /> -->
  </div>
</template>
