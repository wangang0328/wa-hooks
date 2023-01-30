import type {
  BaseResult,
  OptionsWithFormat,
  OptionsWithoutFormat,
  PluginFn,
  Service,
} from './types'
import useFetchImplement from './useFetchImplement'

function useFetch<TData, TParams extends any[], TFormatData>(
  service: Service<TData, TParams>,
  Options?: OptionsWithFormat<TData, TParams, TFormatData>,
  plugins?: PluginFn<TFormatData, TParams>[],
): BaseResult<TFormatData, TParams>

function useFetch<TData = any, TParams extends any[] = any>(
  service: Service<TData, TParams>,
  Options?: OptionsWithoutFormat<TData, TParams>,
  plugins?: PluginFn<TData, TParams>[],
): BaseResult<TData, TParams>

function useFetch<TData = any, TParams extends any[] = [], TFormatData = any>(
  service: Service<TData, TParams>,
  options?:
    | OptionsWithoutFormat<TData, TParams>
    | OptionsWithFormat<TData, TParams, TFormatData>,
  plugins?: PluginFn<TData, TParams>[] | PluginFn<TFormatData, TParams>[],
) {
  return useFetchImplement<TData, TParams, TFormatData>(
    service,
    options,
    plugins,
  )
}

export default useFetch
