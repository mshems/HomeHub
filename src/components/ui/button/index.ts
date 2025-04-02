import { type VariantProps, cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center border border-transparent justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        accent: 'bg-accent text-accent-foreground hover:bg-accent-focus',
        positive: 'bg-positive text-positive-foreground hover:bg-positive-focus',
        warning: 'bg-warning text-warning-foreground hover:bg-warning-focus',
        positiveoutline:
          'border border-positive-typography/50 bg-positive/15 hover:bg-positive-focus text-positive-typography',
        negative: 'bg-negative text-negative-foreground hover:bg-negative-focus',
        negativeoutline:
          'border border-negative-typography/50 bg-negative/15 hover:bg-negative-focus text-negative-typography',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive-focus',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-focus',
        secondaryoutline:
          'border border-secondary bg-transparent hover:bg-secondary text-muted-foreground hover:text-secondary-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        ghostaccent: 'text-accent-typography hover:bg-accent hover:text-accent-foreground',
        ghostdestructive:
          'text-destructive-typography hover:bg-destructive hover:text-destructive-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded px-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        iconsm: 'text-xs h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
