import useCreate from '../useCreate'
import useLatest from '../useLatest'
import useMemoFn from '../useMemoFn'
import useMount from '../useMount'
import useUnmount from '../useUnmount'
import useUpdate from '../useUpdate'
import Fetch from './Fetch'
import type {
  OptionsWithFormat,
  OptionsWithoutFormat,
  PluginFn,
  Service,
} from './types'

function useFetchImplement<TData, TParams extends any[], TFormatData = TData>(
  service: Service<TData, TParams>,
  options:
    | OptionsWithoutFormat<TData, TParams>
    | OptionsWithFormat<TData, TParams, TFormatData> = {},
  plugins: PluginFn<TData, TParams>[] | PluginFn<TFormatData, TParams>[] = [],
) {
  const update = useUpdate()
  const serviceRef = useLatest(service)
  const instance = useCreate(() => {
    // @ts-ignore
    const initialState = plugins
      .map((pluginFn) => pluginFn.onInit?.(options))
      .filter(Boolean)
    return new Fetch<TData, TParams, TFormatData>(
      // @ts-ignore
      serviceRef,
      options,
      update,
      Object.assign({}, ...initialState, { data: options.defaultData }),
    )
  }, [])
  // @ts-ignore
  instance.options = options
  // @ts-ignore
  instance.pluginImpls = plugins.map((plugin) => plugin(instance, options))

  useMount(() => {
    if (!options.manual) {
      // @ts-ignore
      instance.run(instance.state.params || options.defaultParams || [])
    }
  })

  useUnmount(() => {
    instance.cancel()
  })

  return {
    loading: instance.state.loading,
    error: instance.state.error,
    data: instance.state.data,
    params: instance.state.params,
    cancel: useMemoFn(instance.cancel.bind(instance)),
    reFetch: useMemoFn(instance.reFetch.bind(instance)),
    run: useMemoFn(instance.run.bind(instance)),
  }
}
export default useFetchImplement
