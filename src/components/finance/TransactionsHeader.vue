<script setup>
import BalanceChip from './BalanceChip.vue'
import { formatBalance } from 'src/balance'

const emit = defineEmits(['prev', 'next', 'current', 'selectUser'])
const props = defineProps({
  date: {
    type: Object,
    required: true
  },
  users: {
    type: Object,
    required: true
  },
  selectedUserId: {
    type: String
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

const isSelectedUser = (user) => {
  return ((props.selectedUserId === null) || (props.selectedUserId === user.id))
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
        <q-btn round size="sm" class="lt-sm" color="primary" dense flat icon="mdi-chevron-left" @click="emit('prev')"/>
        <div class="">{{ date.monthLong }} {{ date.year }}</div>
        <div class="lt-sm">
          <q-btn round size="sm" color="primary" dense flat icon="mdi-calendar" @click="emit('current')"/>
          <q-btn round size="sm" color="primary" dense flat icon="mdi-chevron-right" @click="emit('next')"/>
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
        <template v-for="u, i in users" :key="i">
          <div class="col-auto q-mr-xs">
            <q-chip
              :class="`full-width q-ma-none ${!isSelectedUser(u) ? '' : 'text-on-color'}`"
              color="indigo-8"
              style="font-size: 0.8rem;"
              clickable
              :outline="!isSelectedUser(u)"
              @click="emit('selectUser', u)"
            >
              <q-avatar
                :text-color="!isSelectedUser(u) ? 'indigo-8' : 'text-on-color'"
              >
                {{ u.name[0] }}
              </q-avatar>
              <span>{{ formatBalance(u.total) }}</span>
            </q-chip>
          </div>
        </template>
      </div>

    </q-card-section>
  </q-card>
</template>
