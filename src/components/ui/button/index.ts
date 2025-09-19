import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center border-2 border-transparent justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        accent: 'bg-accent text-accent-foreground hover:bg-accent-focus',
        positive: 'bg-positive text-positive-foreground hover:bg-positive-focus',
        warning: 'bg-warning text-warning-foreground hover:bg-warning-focus',
        positiveoutline:
          'border-2 border-positive-typography/50 bg-positive/15 hover:bg-positive-focus text-positive-typography',
        negative: 'bg-negative text-negative-foreground hover:bg-negative-focus',
        negativeoutline:
          'border-2 border-negative-typography/50 bg-negative/15 hover:bg-negative-focus text-negative-typography',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive-focus',
        outline:
          'border-2 border-border bg-transparent hover:bg-muted hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-focus',
        secondaryoutline:
          'border-2 border-secondary bg-transparent hover:bg-secondary text-secondary-typography hover:text-secondary-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        ghostaccent: 'text-accent-typography hover:bg-accent hover:text-accent-foreground',
        ghostdestructive:
          'text-destructive-typography hover:bg-destructive hover:text-destructive-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded-sm px-2',
        sm: 'h-8 rounded-md px-3 py-2',
        lg: 'h-12 rounded-lg px-5',
        icon: 'h-10 w-10',
        iconsm: 'text-xs h-9 w-9',
        iconxl: 'text-lg rounded-lg w-14 h-12'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
