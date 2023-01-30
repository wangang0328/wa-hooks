import type { MutableRefObject } from 'react'
import { isBrowser, isFunction } from './validate'

export type TargetValue = Window | Document | Element | HTMLElement

export type TargetType<T> = T | null | undefined

export type Target<T = TargetValue> =
  | MutableRefObject<TargetType<T>>
  | (() => T)
  | T

/**
 * 获取dom对象
 */
export const getTargetDom = <T extends TargetValue = TargetValue>(
  target: Target<T> | undefined,
  defaultEle?: T,
) => {
  if (!isBrowser) {
    return null
  }

  if (!target) {
    return defaultEle ?? null
  }

  if (isFunction(target)) {
    return target()
  }

  if ('current' in target) {
    return target.current
  }

  return target
}
