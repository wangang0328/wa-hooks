import useCreate from '../useCreate'
import useLatest from '../useLatest'
import useMemoFn from '../useMemoFn'
import useMount from '../useMount'
import useUnmount from '../useUnmount'
import useUpdate from '../useUpdate'
import Fetch from './Fetch'
import type { Options, OptionsWithFormat, PluginFn, Service } from './types'

function useFetchImplement<TData, TParams extends any[], TOriginData>(
  service: Service<TData, TParams>,
  options:
    | Options<TData, TParams>
    | OptionsWithFormat<TData, TParams, TOriginData> = {},
  plugins: PluginFn<TData, TParams>[] | PluginFn<TData, TParams>[] = [],
) {
  const update = useUpdate()
  const serviceRef = useLatest(service)
  const instance = useCreate(() => {
    const initialState = plugins
      .map((pluginFn) => pluginFn.onInit?.(options))
      .filter(Boolean)
    return new Fetch<TData, TParams>(
      serviceRef,
      options,
      update,
      Object.assign({}, { data: options.defaultData }, ...initialState),
    )
  }, [])
  // @ts-ignore
  instance.options = options
  instance.pluginImpls = plugins.map((plugin) => plugin(instance, options))

  useMount(() => {
    if (!options.manual) {
      const p = instance.state.params || options.defaultParams || []
      // @ts-ignore
      instance.run(...p)
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
