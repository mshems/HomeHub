import { unref } from 'vue'

const color = (balance) => {
  if (unref(balance) === 0) return 'grey'
  return (unref(balance) > 0) ? 'credit' : 'debit'
}

const formatBalance = (balance) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(unref(balance))
}

export { color, formatBalance }
