import { useEffect, useState } from 'react'
import useCreate from '../useCreate'
import type { Options as LocalOptions } from '../utils/store/localStore'
import LocalStore from '../utils/store/localStore'
import { isUndefined } from '../utils/validate'

export interface Options<T> {
  expires?: LocalOptions['expires']
  /**
   * 如果没有获取到值，默认显示的值(如果设置，并且没有获取到初始值，那么将此值存储到localStorage中)
   */
  defaultValue?: T
  expiresUnit?: LocalOptions['expiresUnit']
}

const useLocalStorage = <T extends any = any>(
  key: string,
  options?: Options<T>,
) => {
  const localStore = useCreate(() => new LocalStore<T>(), [])
  const val = localStore.get(key)

  const [targetVal, setTargetVal] = useState<T | undefined>(
    val || options?.defaultValue,
  )

  const updateState = (value?: T, o?: Options<T>) => {
    if (isUndefined(value)) {
      localStore.remove(key)
    } else {
      localStore.set(key, value, { ...options, ...o })
    }
    setTargetVal(localStore.get(key))
  }

  useEffect(() => {
    if (!val && options?.defaultValue) {
      localStore.set(key, options.defaultValue, options)
    }
  }, [])

  return [targetVal, updateState] as const
}

export default useLocalStorage
