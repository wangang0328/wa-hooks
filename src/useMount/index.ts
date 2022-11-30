import { useEffect } from 'react'
import { isDev, isFunction } from './../utils/validate'

/**
 * 首次挂载调用
 * @param fn
 */
const useMount = (fn: () => void) => {
  if (isDev && !isFunction(fn)) {
    console.error(`expect parameter is a function, but got ${typeof fn}`)
  }

  useEffect(() => {
    fn?.()
  }, [])
}

export default useMount
