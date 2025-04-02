import { cva, type VariantProps } from 'class-variance-authority'

export { default as Avatar } from './Avatar.vue'
export { default as AvatarFallback } from './AvatarFallback.vue'
export { default as AvatarImage } from './AvatarImage.vue'

export const avatarVariant = cva(
  'inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden',
  {
    variants: {
      size: {
        xs: 'h-5 w-5 text-xs',
        sm: 'h-6 w-6 text-xs',
        base: 'h-10 w-10 text-2xl',
        lg: 'h-16 w-16 text-5xl'
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md'
      }
    }
  }
)

export type AvatarVariants = VariantProps<typeof avatarVariant>
