import { isNil } from '../validate'
import type { BaseOptions } from './baseStore'
import BaseStore, { formatExpires } from './baseStore'

const isExpired = (expires: number) => expires <= new Date().getTime()

export type Options = BaseOptions

class SessionStore<T = any> extends BaseStore<T> {
  get(key: string): T
  get(): Record<string, any>
  get(key?: string, options?: { defaultValue?: T }) {
    if (key) {
      try {
        const raw = sessionStorage.getItem(key)
        if (raw) {
          const rawData = JSON.parse(raw)
          if (isNil(rawData.expires) || !isExpired(rawData.expires)) {
            // 没有设置过期时间或者没有过期
            return rawData?.data as T
          }
        }
      } catch (e) {
        console.error(e)
      }
      return options?.defaultValue
    }
    // TODO: 没有key的情况
    return {}
  }

  set(key: string, v: T, options?: Options) {
    const expiresDuration = formatExpires(
      options?.expires,
      options?.expiresUnit,
      'millsecond',
    )
    const target = {
      data: v,
      expires: isNil(expiresDuration)
        ? null
        : new Date().getTime() + expiresDuration,
    }
    sessionStorage.setItem(key, JSON.stringify(target))
  }

  remove(k: string) {
    this.set(k, this.get(k), { expires: -1 })
  }
}

export default SessionStore
