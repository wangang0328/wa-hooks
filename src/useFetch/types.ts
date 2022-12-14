import type Fetch from './Fetch'
/**
 * useFetch 返回的结果类型
 */
export interface BaseResult<TTData, TParams extends any[]> {
  loading: boolean
  error?: Error
  data: TTData
  params: TParams | []
  reFetch: Fetch<TTData, TParams>['reFetch']
  run: Fetch<TTData, TParams>['run']
  cancel: Fetch<TTData, TParams>['cancel']
}

export type Service<TData, TParams extends any[]> = (
  p: TParams,
) => Promise<TData>

export interface FetchState<
  TData,
  TParams extends any[],
  TFormatedData = TData,
> {
  loading: boolean
  error?: Error
  data?: TData | TFormatedData
  params?: TParams
}
/**
 * 请求配置项
 * FormatData 格式化后的data
 */
interface BaseOptions<TParams extends any[]> {
  /**
   * 是否手动触发，true mount时不会自动请求
   */
  manual?: boolean
  defaultParams?: TParams
  onBefore?: (params?: TParams) => void
  // onSuccess?: (d: TData) => void
  onError?: (e: Error, p?: TParams) => void
}

export interface OptionsWithoutFormat<TData, TParams extends any[]>
  extends BaseOptions<TParams> {
  defaultData?: TData
  /**
   *  报错时候设置的data
   */
  errSetData?: TData
  onSuccess?: (d: TData, p?: TParams) => void
  onFinally?: (p?: TParams, d?: TData, e?: Error) => void
}

/**
 * 请求配置项-有格式化Data函数
 * FormatData 格式化后的data
 */
export interface OptionsWithFormat<TData, TParams extends any[], TFormatedData>
  extends BaseOptions<TParams> {
  defaultData?: TFormatedData
  /**
   *  报错时候设置的data
   */
  errSetData?: TFormatedData
  onSuccess?: (d: TFormatedData, p?: TParams) => void
  onFinally?: (p?: TParams, d?: TFormatedData, e?: Error) => void
  /**
   * 格式化数据
   */
  formatData: (d: TData) => TFormatedData
}

export interface PluginReturn<TTData, TParams extends any[]> {
  onBefore?: (p: TParams) =>
    | undefined
    | void
    | ({
        stopNow?: boolean
        returnNow?: boolean
      } & Partial<FetchState<TTData, TParams>>)
  onFetch?: (
    service: Service<TTData, TParams>,
    p: TParams,
  ) => {
    servicePromise?: Promise<TTData>
  }

  onSuccess?: (d: TTData, p: TParams) => void
  onError?: (e: Error, p: TParams) => void
  onFinally?: (p: TParams, d?: TTData, e?: Error) => void
  onCancel?: () => void
  onMutate?: (d: TTData) => void
}

// TODO: 类型修改， 让format 继承 base
export type PluginFn<TData, TParmas extends any[], TFormatedData = TData> = {
  (
    instance: Fetch<TData, TParmas, TFormatedData>,
    options: Partial<OptionsWithFormat<TData, TParmas, TFormatedData>>,
  ): PluginReturn<TFormatedData, TParmas>
  onInit?: (
    options: Partial<OptionsWithFormat<TData, TParmas, TFormatedData>>,
  ) => FetchState<TFormatedData, TParmas>
}

export type ForceUpdate = () => void
