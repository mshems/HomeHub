import { ref } from 'vue'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

export const useTxStore = defineStore('tx', () => {
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
    date,
    currentMonth,
    prevMonth,
    nextMonth
  }
})
