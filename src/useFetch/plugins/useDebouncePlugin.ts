import { useEffect, useRef } from 'react'
import debounce from '../../utils/debounce'
import type { PluginFn } from '../types'

const useDebouncePlugin: PluginFn<any, any> = (
  fetchInstance,
  { debounceDelay, debounceImmediate },
) => {
  const debounceRef = useRef<any>()

  useEffect(() => {
    const originRunAsyncFn = fetchInstance.runAsync.bind(fetchInstance)
    if (!debounceDelay) {
      debounceRef.current = debounce(
        (cb) => {
          cb()
        },
        {
          delay: debounceDelay,
          immediate: debounceImmediate,
        },
      )

      fetchInstance.runAsync = (...params) => {
        return new Promise((resolve, reject) => {
          debounceRef.current(() => {
            originRunAsyncFn(...params)
              .then(resolve)
              .catch(reject)
          })
        })
      }

      return () => {
        debounceRef.current?.cancel()
        // 销毁时重置 runAsync函数，否则每次更新都会嵌套debounce
        fetchInstance.runAsync = originRunAsyncFn
      }
    }
  }, [debounceDelay, debounceImmediate])

  if (!debounceDelay || debounceDelay <= 0) {
    // 不设置debounce的情况
    return {}
  }

  return {
    onCancel: () => {
      debounceRef.current?.cancel()
    },
  }
}

export default useDebouncePlugin
