import { unref } from 'vue'

const color = (balance) => {
  if (!unref(balance)) return 'muted'
  return (unref(balance) > 0) ? 'credit' : 'debit'
}

const textColor = (balance) => {
  if (!unref(balance)) return 'text-muted'
  return `text-on-${color(balance)}`
}

const formatBalance = (balance) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(unref(balance))
}

export { color, formatBalance, textColor }
