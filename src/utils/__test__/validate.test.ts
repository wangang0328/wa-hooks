import { isBoolean, isFunction, isObject, isString, isNumber, isUndefined } from '../validate'

describe('test validate utils', () => {
  test('isBoolean', () => {
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean({})).toBe(false)

    expect(isBoolean(false)).toBe(true)
    expect(isBoolean(true)).toBe(true)
  })

  test('isFunction', () => {
    expect(isFunction('')).toBe(false)
    expect(isFunction({})).toBe(false)

    expect(isFunction(() => { })).toBe(true)
    expect(isFunction(function a() { })).toBe(true)
  })

  test('isObject', () => {
    expect(isObject('')).toBe(false)
    expect(isObject(() => { })).toBe(false)
    expect(isObject(null)).toBe(false)

    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
  })

  test('isString', () => {
    expect(isString(0)).toBe(false)
    expect(isString(() => { })).toBe(false)
    expect(isString(null)).toBe(false)

    expect(isString('{}')).toBe(true)
    expect(isString('')).toBe(true)
  })

  test('isNumber', () => {
    expect(isNumber('0')).toBe(false)
    expect(isNumber(null)).toBe(false)

    expect(isNumber(NaN)).toBe(true)
    expect(isNumber(1.0)).toBe(true)
    expect(isNumber(Infinity)).toBe(true)
  })

  test('isUndefined', () => {
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined('')).toBe(false)

    expect(isUndefined(undefined)).toBe(true)
  })
})