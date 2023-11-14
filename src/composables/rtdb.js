import { useDatabase, useDatabaseObject, useDatabaseList } from 'vuefire'
import { ref as dbRef, set, push, remove, get } from 'firebase/database'

const db = useDatabase()

const useRtdb = () => {
  const write = (path, payload) => {
    return set(dbRef(db, path), payload)
  }

  const add = (path, payload) => {
    const newItemRef = push(dbRef(db, path))
    return set(newItemRef, payload)
  }

  const getRef = (path) => {
    return dbRef(db, path)
  }

  const categories = useDatabaseObject(dbRef(db, 'data/finance/categories'))
  const users = useDatabaseObject(dbRef(db, 'data/users'))
  const transactions = useDatabaseList(dbRef(db, 'data/finance/transactions'))
  return { db, categories, transactions, users, write, add, get, remove, getRef }
}

export { useRtdb }
