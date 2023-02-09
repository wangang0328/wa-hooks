import { useRef } from 'react'
import type { PluginFn } from '../types'

const useRetryPlugin: PluginFn<any, any> = (
  fetchInstance,
  { retryCount, retryDelay },
) => {
  const countedRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const triggerByRetryRef = useRef(false)

  if (!retryCount) {
    return {}
  }

  const cancelTimeout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return {
    onBefore: () => {
      // 用户手动触发了该请求，取消timeout
      cancelTimeout()
      if (!triggerByRetryRef.current) {
        countedRef.current = 0
      }
      triggerByRetryRef.current = false
    },
    onError: () => {
      if (retryCount >= countedRef.current) {
        return
      }
      const delay = retryDelay ?? 1000 * 2 * (retryCount + 1)
      timerRef.current = setTimeout(() => {
        countedRef.current += 1
        triggerByRetryRef.current = true
        fetchInstance.reFetch()
        timerRef.current = null
      }, delay)
    },
    onSuccess: () => {
      countedRef.current = 0
    },
    onCancel: () => {
      countedRef.current = 0
      cancelTimeout()
    },
  }
}

export default useRetryPlugin
