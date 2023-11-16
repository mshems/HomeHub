import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { LocalStorage } from 'quasar'

export const useTxStore = defineStore('tx', () => {
  const descending = ref(LocalStorage.getItem('txDesc'))
  watch(descending, (val, _) => {
    LocalStorage.set('txDesc', val)
  })

  const date = ref(DateTime.local())
  const currentMonth = () => {
    date.value = DateTime.local()
  }
  const prevMonth = () => {
    date.value = date.value.minus({ month: 1 })
  }
  const nextMonth = () => {
    date.value = date.value.plus({ month: 1 })
  }

  return {
    descending,
    date,
    currentMonth,
    prevMonth,
    nextMonth
  }
})
