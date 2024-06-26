import { useDatabase, useDatabaseList, useDatabaseObject } from 'vuefire'
import { get, push, ref as dbRef, remove, set } from 'firebase/database'

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

  return { db, write, add, get, remove, getRef, getList, getObject }
}

export { useRtdb }
