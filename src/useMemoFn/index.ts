import { useRef } from 'react'
import { isDev, isFunction } from '../utils/validate'
type Noop = (...args: any[]) => any
type MemoizedFn<T extends Noop> = (v: Parameters<T>) => ReturnType<T>

const useMemoFn = <T extends Noop>(fn: T) => {
  if (isDev && !isFunction(fn)) {
    console.error(
      `useMemoFn expect parameter is a function but got ${typeof fn}`,
    )
  }

  const fnRef = useRef<T>(fn)
  fnRef.current = fn

  const memoizedFnRef = useRef<MemoizedFn<T>>()
  if (!memoizedFnRef.current) {
    // 只在初始化时执行一次，保证  memoizedFnRef.current 的指针不变
    memoizedFnRef.current = (...args) => {
      return fnRef.current(...args)
    }
  }
  return memoizedFnRef.current as T
}

export default useMemoFn
