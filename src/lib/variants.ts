import { balanceType } from './balance'
import { cva, type VariantProps } from 'class-variance-authority'

export type BalanceVariantProps = VariantProps<typeof balanceVariants>
export const balanceVariants = cva('', {
  variants: {
    variant: {
      credit: 'bg-positive! text-positive-foreground',
      debit: 'bg-negative! text-negative-foreground',
      neutral: 'bg-secondary! text-secondary-foreground'
    }
  }
})

export type BalanceTextVariantProps = VariantProps<typeof balanceTextVariants>
export const balanceTextVariants = cva('', {
  variants: {
    variant: {
      credit: 'text-positive-typography',
      debit: 'text-negative-typography',
      neutral: 'text-secondary-foreground'
    }
  }
})

export type BalanceBgVariantProps = VariantProps<typeof balanceBgVariants>
export const balanceBgVariants = cva('', {
  variants: {
    variant: {
      credit: 'bg-positive',
      debit: 'bg-negative',
      neutral: 'bg-secondary'
    }
  }
})

interface UseBalanceVariantProps {
  amount: number
  text: boolean
  bg: boolean
}
export const useBalanceVariants = ({ amount, text, bg }: UseBalanceVariantProps) => {
  const type = balanceType(amount)
  if (text && bg) return balanceVariants({ variant: type })
  if (text) return balanceTextVariants({ variant: type })
  if (bg) return balanceBgVariants({ variant: type })
}
