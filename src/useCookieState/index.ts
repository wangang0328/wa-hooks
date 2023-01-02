import { useEffect, useState } from 'react'
import useCreate from '../useCreate'
import type { Options as CookieOptions } from '../utils/store/cookieStore'
import CookieStore from '../utils/store/cookieStore'
import { isUndefined } from '../utils/validate'

export interface Options<T> {
  /**
   * 默认单位毫秒
   */
  expires?: CookieOptions['expires']
  /**
   * 如果没有获取到值，默认显示的值(如果设置，并且没有获取到初始值，那么将此值存储到localStorage中)
   */
  defaultValue?: T
  expiresUnit?: CookieOptions['expiresUnit']
  [key: string]: any
}

// TODO: 将 useLocalSotrage useSessionStorage useCookieState 抽离出来
const useLocalStorage = <T extends any = any>(
  key: string,
  options?: Options<T>,
) => {
  const localStore = useCreate(() => new CookieStore<T>(), [])
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
