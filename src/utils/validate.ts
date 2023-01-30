// 类型校验
const is =
  <T>(expectType: string) =>
  (v: unknown): v is T =>
    typeof v === expectType
export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object'
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = is<Function>('function')
export const isString = is<string>('string')
export const isBoolean = is<boolean>('boolean')
export const isNumber = is<number>('number')
export const isUndefined = is<undefined>('undefined')
export const isNull = is<undefined>('undefined')

export const isNil = (v: unknown): v is undefined | null =>
  isUndefined(v) || v === null

// 环境校验
export const isDev = ['development', 'test'].includes(
  process?.env?.NODE_ENV || '',
)

export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined'
