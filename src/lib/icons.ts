import type { StringToFn } from './types'
import {
  Banknote,
  Bike,
  ChefHat,
  CookingPot,
  Croissant,
  Fuel,
  Gift,
  PartyPopper,
  PawPrint,
  Pill,
  Plane,
  Popcorn,
  Sandwich,
  ShoppingBag,
  ShoppingCart,
  Soup,
  Utensils,
  Wallet
} from 'lucide-vue-next'

export const categoryIcons: StringToFn = {
  activities: Bike,
  gifts: Gift,
  groceries: ShoppingCart,
  health: Pill,
  income: Banknote,
  other: ShoppingBag,
  pets: PawPrint,
  restaurants: Utensils,
  transportation: Fuel,
  travel: Plane,
  utilities: Wallet,
  wedding: PartyPopper
}

export const categoryColors: Record<string, string> = {
  activities: 'text-lime-500',
  gifts: 'text-purple-600',
  groceries: 'text-slate-400',
  health: 'text-pink-600',
  income: 'text-positive-typography',
  other: 'text-amber-500',
  pets: 'text-yellow-800',
  restaurants: 'text-slate-300',
  transportation: 'text-slate-500',
  travel: 'text-sky-500',
  utilities: 'text-red-500',
  wedding: 'text-foreground'
}

export const mealIcons: StringToFn = {
  breakfast: Croissant,
  lunch: Sandwich,
  dinner: Soup,
  prep: CookingPot,
  snack: Popcorn,
  other: ChefHat
}
