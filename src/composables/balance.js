import { unref } from 'vue'

const color = (balance) => {
  if (unref(balance) === 0) return 'grey'
  return (unref(balance) > 0) ? 'credit' : 'debit'
}

export { color }
