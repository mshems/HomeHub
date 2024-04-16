import { filter } from '../filters'

import { useCollection } from './collection'

const useRecurrences = () => {
  const { get, update, remove, create, collection: recurrences } = useCollection('data/finance/recurrences')

  return {
    recurrences,
    get,
    update,
    remove,
    create,
    filter
  }
}

export { useRecurrences }
