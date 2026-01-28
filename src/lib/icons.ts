import type { StringToFn } from './types'
import {
  ArrowLeftRight,
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
  House,
  Sandwich,
  ShoppingBag,
  ShoppingCart,
  Soup,
  Utensils,
  Wallet,
  Repeat2
} from 'lucide-vue-next'

export const categoryIcons: StringToFn = {
  activities: Bike,
  gifts: Gift,
  groceries: ShoppingCart,
  health: Pill,
  home: House,
  income: Banknote,
  other: ShoppingBag,
  pets: PawPrint,
  restaurants: Utensils,
  transportation: Fuel,
  travel: Plane,
  utilities: Wallet,
  wedding: PartyPopper,
  transfer: ArrowLeftRight,
  subscriptions: Repeat2
}

export const categoryColors: Record<string, string> = {
  activities: 'text-lime-500',
  gifts: 'text-purple-600',
  groceries: 'text-slate-400',
  health: 'text-pink-600',
  home: 'text-blue-500',
  income: 'text-positive-typography',
  other: 'text-amber-500',
  pets: 'text-yellow-800',
  restaurants: 'text-slate-300',
  transportation: 'text-slate-500',
  travel: 'text-sky-500',
  utilities: 'text-red-500',
  wedding: 'text-foreground',
  transfer: 'text-foreground',
  subscriptions: 'text-foreground'
}

export const mealIcons: StringToFn = {
  breakfast: Croissant,
  lunch: Sandwich,
  dinner: Soup,
  prep: CookingPot,
  snack: Popcorn,
  other: ChefHat
}
