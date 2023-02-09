export type Options = {
  delay?: number
  /**
   * 首次是否立即执行
   */
  immediate?: boolean
}

export type Debounce = (
  handler: (...args: any) => any,
  options?: Options,
) => {
  (this: ThisParameterType<any>, ...params: any[]): any
  cancel: () => void
}

function debounce(handler: (...args: any) => any, options: Options = {}) {
  const { delay = 300, immediate = true } = options
  let timer: NodeJS.Timeout
  let isFirstCalled = true

  function debounced(this: ThisParameterType<any>, ...params: any[]) {
    if (isFirstCalled && immediate) {
      isFirstCalled = false
      handler.apply(this, params)
      return
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      handler.apply(this, params)
    }, delay)
  }

  debounced.cancel = () => {
    clearTimeout(timer)
  }
  return debounced
}

export default debounce as Debounce
