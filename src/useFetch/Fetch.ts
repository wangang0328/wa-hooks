/* eslint-disable @typescript-eslint/no-parameter-properties */
import type { MutableRefObject } from 'react'
import type {
  FetchState,
  ForceUpdate,
  Options,
  OptionsWithFormat,
  PluginReturn,
  Service,
} from './types'

export default class Fetch<TData, TParams extends any[], TOriginData = any> {
  // plugns的返回值
  pluginImpls: PluginReturn<TData, TParams>[] = []

  // 标识，可以通过该值控制显示最后一次请求，取消请求
  flagOfCount = 0

  state: FetchState<TData, TParams> = {
    loading: false,
    data: undefined,
    error: undefined,
    params: undefined,
  }

  constructor(
    public serviceRef: MutableRefObject<Service<TData, TParams>>,
    public options:
      | Options<TData, TParams>
      | OptionsWithFormat<TData, TParams, TOriginData>,
    public update: ForceUpdate,
    public initialState: FetchState<TData, TParams>,
  ) {
    const defaultData = this.options.defaultData
    this.setState({ ...initialState, data: defaultData }, false)
  }

  setState(s: Partial<FetchState<TData, TParams>> = {}, isForceUpdate = true) {
    this.state = {
      ...this.state,
      ...s,
    }
    if (isForceUpdate) {
      this.update()
    }
  }

  notifyPluginsEvent<
    K extends keyof PluginReturn<TData, TParams>,
    P extends Required<PluginReturn<TData, TParams>>,
  >(eventName: K, ...rest: Parameters<P[K]>) {
    const result = this.pluginImpls
      .map((pluginImpl) => {
        // 保证某个plugin报错，别的plugin可以正常进行
        try {
          // @ts-ignore
          return pluginImpl[eventName]?.(...rest)
        } catch (error) {
          console.log(error)
          return undefined
        }
      })
      .filter(Boolean)
    // Object.assign({}, ...[{ name: 1 }, { name: 2 }, { age: 3 }]) => {name: 2, age: 3}
    return Object.assign({}, ...result) as Exclude<
      ReturnType<P[K]>,
      undefined | void
    >
  }

  async runAsync(...params: TParams) {
    ++this.flagOfCount
    const curFlagCount = this.flagOfCount
    // plugin before
    const { stopNow, returnNow, ...state } = this.notifyPluginsEvent(
      'onBefore',
      params,
    )
    if (stopNow) return {}
    this.setState({
      loading: true,
      params,
      ...state,
    })
    if (returnNow) return { ...this.state.data }

    this.options.onBefore?.(this.state.params)

    // 替换service
    let { servicePromise } = this.notifyPluginsEvent(
      'onFetch',
      this.serviceRef.current,
      params,
    )
    if (!servicePromise) {
      servicePromise = this.serviceRef.current(...params)
    }
    try {
      const resData = (await servicePromise) as any
      // 取消了请求或者不是最后一次请求的结果
      if (curFlagCount !== this.flagOfCount) {
        return {}
      }

      const targetData = this.options.hasOwnProperty('formatData')
        ? (
            this.options as OptionsWithFormat<TData, TParams, TOriginData>
          ).formatData(resData)
        : resData

      this.setState({
        loading: false,
        error: undefined,
        data: targetData,
      })

      this.options.onSuccess?.(this.state.data!, this.state.params)
      this.notifyPluginsEvent('onSuccess', this.state.data!, this.state.params)

      this.options.onFinally?.(this.state.params, this.state.data, undefined)
      this.notifyPluginsEvent(
        'onFinally',
        this.state.params,
        this.state.data,
        undefined,
      )
    } catch (error: any) {
      const targetState = this.options.hasOwnProperty('errSetData')
        ? {
            loading: false,
            error,
            data: this.options.errSetData,
          }
        : {
            loading: false,
            error,
          }

      this.setState(targetState)

      this.notifyPluginsEvent('onError', error, this.state.params)
      this.options.onError?.(error, this.state.params)

      this.options.onFinally?.(this.state.params, undefined, error)
      this.notifyPluginsEvent('onFinally', this.state.params, undefined, error)
    }
  }

  /**
   * 重新发起请求，请求参数是上一次的
   */
  reFetch() {
    // @ts-ignore
    this.runAsync(...(this.state.params || []))
  }

  /**
   * 手动触发执行请求
   */
  run(...params: TParams) {
    this.runAsync(...params)
  }

  /**
   * 取消请求，并不会取消http请求，只是不在渲染本次请求的结果
   */
  cancel() {
    ++this.flagOfCount
    this.setState({
      loading: false,
    })
    this.notifyPluginsEvent('onCancel')
  }
}
