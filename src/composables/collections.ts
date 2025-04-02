import { useRtdb } from './rtdb'
import { unref } from 'vue'

const useCollection = (path: string) => {
  const { getList, getObject, add, write, getRef, remove: dbRemove } = useRtdb()
  const collection = getList(path)

  const get = (id: string) => {
    return getObject(`${path}/${id}`)
  }

  const update = (id: string, data: any) => {
    return write(`${path}/${id}`, unref(data))
  }

  const remove = (id: string) => {
    const item = getRef(`${path}/${id}`)
    return dbRemove(item)
  }

  const create = (data: any) => {
    return add(path, data)
  }

  return {
    collection,
    get,
    update,
    remove,
    create
  }
}

export { useCollection }
