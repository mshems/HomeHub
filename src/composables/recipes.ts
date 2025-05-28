import { useCollection } from './collections'
import { ref as dbRef } from 'firebase/database'
import { useDatabase, useDatabaseList, useDatabaseObject } from 'vuefire'

import type { IRecipe } from '@/lib/models'

export const getRecipesList = () => {
  const db = useDatabase()
  const recipes = useDatabaseList<IRecipe>(dbRef(db, 'data/recipes'))
  return recipes
}

export const getRecipe = (id: string) => {
  const db = useDatabase()
  const recipe = useDatabaseObject<IRecipe>(dbRef(db, 'data/recipes/' + id))
  return recipe
}

export const useRecipes = () => useCollection<IRecipe>('data/recipes')
