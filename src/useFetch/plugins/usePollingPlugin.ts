import { useEffect, useRef } from 'react'
import subscribeVisible from '../../utils/subscribeVisibe'
import { documentIsVisible, isUndefined } from '../../utils/validate'
import type { PluginFn } from '../types'

const usePollingPlugin: PluginFn<any, any> = (
  fetchInstance,
  { pollingInterval, pollingRetryCount = 0, pollingWhenHidden = true },
) => {
  // 已经重试的次数
  const retriedCountRef = useRef(-1)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const triggerByRetryRef = useRef(false)
  const unSubscribeRef = useRef<() => void>()

  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    unSubscribeRef.current?.()
  }

  useEffect(() => {
    if (pollingInterval) {
      stopPolling()
    }
  }, [pollingInterval])

  if (isUndefined(pollingInterval)) {
    return {}
  }

  return {
    onBefore: () => {
      stopPolling()
      if (!triggerByRetryRef.current) {
        retriedCountRef.current = -1
      }
      triggerByRetryRef.current = false
    },
    onSuccess: () => {
      retriedCountRef.current = -1
    },
    onError: () => {
      retriedCountRef.current += 1
    },
    onFinally: (_0, _1, e) => {
      if (e && retriedCountRef.current >= pollingRetryCount) {
        // 报错,且重试次数到了，不再请求
        return
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        if (!documentIsVisible() && !pollingWhenHidden) {
          unSubscribeRef.current = subscribeVisible(() => {
            if (e) {
              triggerByRetryRef.current = true
            }
            fetchInstance.reFetch()
          })
        } else {
          if (e) {
            triggerByRetryRef.current = true
          }
          fetchInstance.reFetch()
        }
      }, pollingInterval)
    },
    onCancel: () => {
      retriedCountRef.current = 0
      stopPolling()
    },
  }
}

export default usePollingPlugin
