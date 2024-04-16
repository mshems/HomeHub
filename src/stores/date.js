import { ref } from 'vue'
import { DateTime } from 'luxon'
import { defineStore } from 'pinia'

export const useDateStore = defineStore('financeDate', () => {
  const date = ref(DateTime.local())
  const m = () => date.value.month
  const y = () => date.value.year

  const set = (d) => {
    date.value = d
  }
  const get = () => {
    return date.value
  }

  const currentMonth = () => {
    set(DateTime.local())
  }
  const prevMonth = () => {
    set(date.value.minus({ month: 1 }))
  }
  const nextMonth = () => {
    set(date.value.plus({ month: 1 }))
  }

  return {
    date,
    m,
    y,
    currentMonth,
    prevMonth,
    nextMonth,
    set,
    get
  }
})
