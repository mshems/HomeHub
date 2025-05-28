import { get, push, ref as dbRef, remove, set } from 'firebase/database'
import { useDatabase, useDatabaseList, useDatabaseObject } from 'vuefire'

const useRtdb = () => {
  const db = useDatabase()
  const write = (path: string, payload: any) => {
    return set(dbRef(db, path), payload)
  }

  const add = (path: string, payload: any) => {
    const newItemRef = push(dbRef(db, path))
    return set(newItemRef, payload)
  }

  const getRef = (path: string) => {
    return dbRef(db, path)
  }

  const getList = <T>(path: string) => {
    return useDatabaseList<T>(dbRef(db, path))
  }

  const getObject = (path: string) => {
    return useDatabaseObject(dbRef(db, path))
  }

  return { db, write, add, get, remove, getRef, getList, getObject }
}

export { useRtdb }
