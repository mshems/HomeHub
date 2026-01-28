export type TransactionType = 'credit' | 'debit' | 'neutral'

export interface ITransaction {
  id: string
  amount: number
  category: string
  name: string
  notes: string
  paid_by: string
  timestamp: number
}

export interface IUser {
  id: string
  color: string
  email: string
  name: string
}

export interface ICategory {
  id: string
  name: string
  icon: string
  color: string
  type: 'need' | 'want' | 'save'
}

export interface IIngredient {
  name: string
  quantity: string | undefined
  unit: string | undefined
}

export interface IStep {
  text: string
}

export interface IRecipe {
  id: string
  title: string
  favorite: boolean
  ingredients: IIngredient[]
  steps: IStep[]
  body: string
  image: string | undefined
  link: string | undefined
  notes: string | undefined
  tags: string[]
  created: number
  lastUpdated: number
}

export interface IRecipeBrief {
  id: string
  title: string
}

export interface IMeal {
  id: string
  label: string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'prep' | 'other'
  recipe: IRecipeBrief | undefined
  notes: string | undefined
  link: string | undefined
}
