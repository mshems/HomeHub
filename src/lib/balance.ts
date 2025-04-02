import type { Ref } from 'vue'
import { unref } from 'vue'

export const balanceType = (balance: number | Ref<number> | undefined) => {
  if (balance === undefined || balance === 0) return 'neutral'
  return unref(balance) >= 0 ? 'credit' : 'debit'
}

export const formatBalance = (balance: number | Ref<number>, absolute: boolean = false) => {
  const amt = absolute ? Math.abs(unref(balance)) : unref(balance)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amt)
}
