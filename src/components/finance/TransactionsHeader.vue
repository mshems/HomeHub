<script setup>
import BalanceChip from './BalanceChip.vue'

const emit = defineEmits(['prev', 'next', 'current'])
defineProps({
  date: {
    type: Object,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  filters: {
    type: Object,
    default: () => ({})
  }
})

const onSwipeMonth = ({ evt, ...info }) => {
  if (info.direction === 'left') emit('next')
  else emit('prev')
}

</script>

<template>
  <q-card flat>
    <q-card-section class="card-title q-px-md">
      <div
        v-touch-swipe.mouse="onSwipeMonth"
        class="q-ma-none cursor-pointer row items-center justify-between no-wrap ellipsis"
        style="font-size: 1.5rem;"
      >
        <q-btn size="sm" class="lt-sm" color="primary" dense flat icon="mdi-chevron-left" @click="emit('prev')"/>
        <div class="">{{ date.monthLong }} {{ date.year }}</div>
        <div class="lt-sm">
          <q-btn class="q-mr-xs" size="sm" color="primary" dense flat icon="mdi-calendar" @click="emit('current')"/>
          <q-btn size="sm" color="primary" dense flat icon="mdi-chevron-right" @click="emit('next')"/>
        </div>
        <div class="gt-xs">
          <q-btn color="primary" dense flat icon="mdi-chevron-left" @click="emit('prev')"/>
          <q-btn color="primary" dense flat icon="mdi-calendar" @click="emit('current')"/>
          <q-btn color="primary" dense flat icon="mdi-chevron-right" @click="emit('next')"/>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-sm">
      <div class="row q-pt-sm q-px-sm">
        <div class="col-auto q-mr-xs">
          <balance-chip
            :balance="total"
            icon="mdi-finance"
            style="font-size: 0.8rem;"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
