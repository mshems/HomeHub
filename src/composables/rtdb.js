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

  const getList = (path) => {
    return useDatabaseList(dbRef(db, path))
  }

  const getObject = (path) => {
    return useDatabaseObject(dbRef(db, path))
  }

  const categories = useDatabaseObject(dbRef(db, 'data/finance/categories'))
  const users = useDatabaseObject(dbRef(db, 'data/users'))

  return { db, categories, users, write, add, get, remove, getRef, getList, getObject }
}

export { useRtdb }
