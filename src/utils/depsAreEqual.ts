/* eslint-disable no-self-compare */
import { isFunction, isNil } from './validate'

const is = (x: any, y: any) =>
  (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)

const objectIs = isFunction(Object.is) ? Object.is : is

const depsAreEqual = (prevDeps: any = null, nextDeps: any = null) => {
  if (isNil(prevDeps) || isNil(nextDeps)) return false
  if (prevDeps === nextDeps) return true

  if (prevDeps?.length !== nextDeps?.length) {
    return false
  }

  for (let i = 0; i < prevDeps.length && nextDeps.length; i++) {
    if (objectIs(prevDeps[i], nextDeps[i])) {
      continue
    }
    return false
  }
  return true
}

export default depsAreEqual
