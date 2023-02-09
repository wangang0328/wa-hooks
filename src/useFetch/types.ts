import type Fetch from './Fetch'
/**
 * useFetch 返回的结果类型
 */
export interface Result<TData, TParams extends any[]> {
  loading: boolean
  error: Error | undefined
  data: TData
  params: TParams | []
  reFetch: Fetch<TData, TParams>['reFetch']
  run: Fetch<TData, TParams>['run']
  cancel: Fetch<TData, TParams>['cancel']
}

export type Service<TData, TParams extends any[]> = (
  ...p: TParams
) => Promise<TData>

export interface FetchState<TData, TParams extends any[]> {
  loading: boolean
  error?: Error
  data?: TData
  params?: TParams
}

/**
 * 请求配置项
 * FormatData 格式化后的data
 */
export interface Options<TData, TParams extends any[]> {
  /**
   * 是否手动触发，true mount时不会自动请求
   */
  manual?: boolean
  defaultParams?: TParams
  defaultData?: TData

  /**
   * debounce 等待时长
   */
  debounceDelay?: number
  /**
   * 防抖是否首次立即执行
   * 默认true
   */
  debounceImmediate?: boolean

  // 错误重试
  /**
   * 错误重试的次数
   */
  retryCount?: number
  /**
   * 请求错误时，多久再发起请求，如果不传retryCount，该项失效
   * 默认使用简易的指数退避算法： 1000 * 2 * retryCount
   */
  retryDelay?: number

  // 轮询
  /**
   * 轮询间隔时长
   */
  pollingInterval?: number
  /**
   * document 隐藏时，是否轮询，默认：是
   */
  pollingWhenHidden?: boolean
  /**
   * 发生错误时， 轮询重试次数
   */
  pollingRetryCount?: number

  /**
   *  报错时候设置的data
   */
  errSetData?: TData | undefined
  onBefore?: (params?: TParams) => void
  onError?: (e: Error, p?: TParams) => void
  onSuccess?: (d: TData, p?: TParams) => void
  onFinally?: (p?: TParams, d?: TData, e?: Error) => void
}

/**
 * 请求配置项-有格式化Data函数
 * FormatData 格式化后的data
 */
export interface OptionsWithFormat<
  TData,
  TParams extends any[],
  TOriginData = any,
> extends Options<TData, TParams> {
  /**
   * 格式化数据
   */
  formatData: (d: TOriginData) => TData
}

export interface PluginReturn<TTData, TParams extends any[]> {
  onBefore?: (
    p: TParams | undefined,
  ) =>
    | void
    | ({ stopNow?: boolean; returnNow?: boolean } & Partial<
        FetchState<TTData, TParams>
      >)

  onFetch?: (
    service: Service<TTData, TParams>,
    p: TParams | undefined,
  ) => {
    servicePromise?: Promise<TTData>
  }

  onSuccess?: (d: TTData, p: TParams | undefined) => void
  onError?: (e: Error, p: TParams | undefined) => void
  onFinally?: (p: TParams | undefined, d?: TTData, e?: Error) => void
  onCancel?: () => void
  onMutate?: (d: TTData) => void
}

// TODO: 类型修改， 让format 继承 base
export type PluginFn<TData, TParmas extends any[]> = {
  (
    instance: Fetch<TData, TParmas>,
    options: Partial<Options<TData, TParmas>>,
  ): PluginReturn<TData, TParmas>
  onInit?: (
    options: Partial<OptionsWithFormat<TData, TParmas>>,
  ) => FetchState<TData, TParmas>
}

export type ForceUpdate = () => void
