import { exclude } from '../index'
import { isNil } from '../validate'
import { isDev, isUndefined } from './../validate'
import type { BaseOptions } from './baseStore'
import BaseStore, { formatExpires } from './baseStore'

export interface Options extends BaseOptions {
  path?: string
  [key: string]: any
}

const defaultAttributes = {
  path: '/',
}

class CookieStore<T = any> extends BaseStore<T> {
  get(key: string): T
  get(): Record<string, any>
  get(key?: string, options?: { defaultValue?: T }) {
    if (isUndefined(document)) {
      return
    }

    const cookies = document.cookie ? document.cookie.split('; ') : []
    const map: Record<string, any> = {}

    cookies.forEach((cookieStr) => {
      const parts = cookieStr.split('=')
      const value = parts.slice(1).join('=') // 防止值里有=
      try {
        const key = decodeURIComponent(parts[0])
        map[key] = JSON.parse(decodeURIComponent(value))
      } catch (e) {
        if (isDev) {
          console.error(e)
        }
      }
    })
    if (key) {
      return map[key] ?? options?.defaultValue
    }
    return map
  }

  set(key: string, v: T, options?: Options) {
    if (isUndefined(document)) {
      return undefined
    }
    const expires = formatExpires(
      options?.expires,
      options?.expiresUnit,
      'millsecond',
    )
    const attributes: Record<string, any> = {
      ...defaultAttributes,
      ...exclude(options || {}, ['expires', 'expiresUnit', 'defaultValue']),
    }
    if (!isUndefined(expires)) {
      attributes.expires = new Date(Date.now() + expires).toUTCString()
    }

    let stringifedAttributes = ''
    for (const attributeName in attributes) {
      if (isNil(attributes[attributeName])) {
        continue
      }

      stringifedAttributes += '; ' + attributeName
      if (attributes[attributeName] === true) {
        continue
      }
      stringifedAttributes += '=' + attributes[attributeName].split(';')[0]
    }
    document.cookie =
      key + '=' + encodeURIComponent(JSON.stringify(v)) + stringifedAttributes
  }

  remove(k: string) {
    this.set(k, '' as any, { expires: -1 })
  }
}

export default CookieStore
