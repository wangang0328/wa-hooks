import { isUndefined } from '../validate'

export interface BaseOptions {
  /**
   * 有效时间
   */
  expires?: number
  /**
   * 有效时间单位
   */
  expiresUnit?:
    | 'day'
    | 'Day'
    | 'hour'
    | 'Hour'
    | 'minute'
    | 'Minute'
    | 'second'
    | 'Second'
    | 'millsecond'
    | 'Millsecond'
}

/**
 * 格式化单位
 */
export const formatExpires = (
  expires: BaseOptions['expires'],
  prevUnit: BaseOptions['expiresUnit'] = 'millsecond',
  expectUnit: BaseOptions['expiresUnit'] = 'millsecond',
) => {
  if (isUndefined(expires)) {
    return expires
  }
  const lowPrevUnit = prevUnit.toLocaleLowerCase()
  const lowExpectUnit = expectUnit.toLocaleLowerCase()
  const unitOfValuesList = [
    { unit: 'day', value: 1 },
    { unit: 'hour', value: 24 },
    { unit: 'minute', value: 60 },
    { unit: 'second', value: 60 },
    { unit: 'millsecond', value: 1000 },
  ]

  const prevUnitIndex = unitOfValuesList.findIndex(
    (v) => v.unit === lowPrevUnit,
  )
  const expectUnitIndex = unitOfValuesList.findIndex(
    (v) => v.unit === lowExpectUnit,
  )
  let target: BaseOptions['expires'] = expires
  if (prevUnitIndex === expectUnitIndex) {
    return target
  } else if (prevUnitIndex > expectUnitIndex) {
    // 转换的单位比之前的单位大， 用除
    for (let i = prevUnitIndex; i > expectUnitIndex; i--) {
      target = target / unitOfValuesList[i].value
    }
    return target
  } else {
    // 转换的单位比之前的单位小，用乘
    for (let i = prevUnitIndex; i < expectUnitIndex; i++) {
      target = target * unitOfValuesList[i].value
    }
    return target
  }
}

export default abstract class BaseStore<T = any> {
  /**
   * 设置值
   * @param v
   */
  abstract set(key: string, v: T, options?: Record<string, any>): void

  abstract get(key: string, options?: Record<string, any>): T

  abstract get(): Record<string, any>

  abstract remove(k: string): void
}
