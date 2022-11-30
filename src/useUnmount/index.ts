import { useEffect } from 'react'
import useLatest from '../useLatest'
import { isFunction, isDev } from '../utils/validate'


/**
 * 组件销毁时候调用
 * @param fn
 */
const useUnmount = (fn: () => void) => {
  if (isDev && !isFunction(fn)) {
    console.error(`expect parameter is a function, but got ${typeof fn}`)
  }
  const fnRef = useLatest(fn)
  useEffect(() => {
    return fnRef.current
  }, [])
}

export default useUnmount
