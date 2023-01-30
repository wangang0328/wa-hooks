import useEffectWithTarget from '../useEffectWithTarget'
import useLatest from '../useLatest'
import { exclude } from '../utils'
import type { Target } from '../utils/domTarget'
import { getTargetDom } from '../utils/domTarget'

interface Options<T extends Target = Target> extends AddEventListenerOptions {
  target?: T
  [k: string]: any
}

type noop = (...args: any[]) => void

function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  listener: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>,
): void

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  listener: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>,
): void

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  listener: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>,
): void

function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  listener: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>,
): void

function useEventListener(
  eventName: string,
  listener: noop,
  options: Options,
): void

function useEventListener(
  eventName: string,
  listener: noop,
  options: Options = {},
) {
  // 解决闭包问题
  const listenerRef = useLatest(listener)

  useEffectWithTarget(
    () => {
      const targetDom = getTargetDom(options.target, window)
      const listener = (event: Event) => {
        listenerRef.current(event)
      }
      const listenerOptions = exclude(options, 'target') || {}
      targetDom?.addEventListener(eventName, listener, { ...listenerOptions })

      return () => {
        targetDom?.removeEventListener(eventName, listener, {
          capture: options.capture,
        })
      }
    },
    [options.capture, options.once, options.passive, options.signal],
    options.target,
  )
}

export default useEventListener
