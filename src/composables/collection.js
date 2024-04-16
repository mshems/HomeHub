import { unref } from 'vue'

import { useRtdb } from './rtdb'

const useCollection = (path) => {
  const { getList, getObject, add, write, getRef, remove: dbRemove } = useRtdb()
  const collection = getList(path)

  const get = (id) => {
    return getObject(`${path}/${id}`)
  }

  const update = (id, data) => {
    return write(`${path}/${id}`, unref(data))
  }

  const remove = (id) => {
    const item = getRef(`${path}/${id}`)
    return dbRemove(item)
  }

  const create = (data) => {
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
