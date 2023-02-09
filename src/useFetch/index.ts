import useDebouncePlugin from './plugins/useDebouncePlugin'
import usePollingPlugin from './plugins/usePollingPlugin'
import useRetryPlugin from './plugins/useRetryPlugin'
import type {
  Options,
  OptionsWithFormat,
  PluginFn,
  Result,
  Service,
} from './types'
import useFetchImplement from './useFetchImplement'

function useFetch<TData, TParams extends any[], TOriginData>(
  service: Service<TData, TParams>,
  Options?: OptionsWithFormat<TData, TParams, TOriginData>,
  plugins?: PluginFn<TData, TParams>[],
): Result<TData, TParams>

function useFetch<TData = any, TParams extends any[] = any>(
  service: Service<TData, TParams>,
  Options?: Options<TData, TParams>,
  plugins?: PluginFn<TData, TParams>[],
): Result<TData, TParams>

function useFetch<TData = any, TParams extends any[] = [], TOriginData = any>(
  service: Service<TData, TParams>,
  options?:
    | Options<TData, TParams>
    | OptionsWithFormat<TData, TParams, TOriginData>,
  plugins: PluginFn<TData, TParams>[] = [],
) {
  return useFetchImplement<TData, TParams, TOriginData>(service, options, [
    ...plugins,
    useDebouncePlugin,
    useRetryPlugin,
    usePollingPlugin,
  ])
}

export default useFetch
