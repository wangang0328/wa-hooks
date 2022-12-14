import type { DependencyList } from 'react'
import { useRef } from 'react'
import depsAreEqual from '../utils/depsAreEqual'
import { isDev, isFunction } from '../utils/validate'

const useCreate = <T>(factory: () => T, deps?: DependencyList) => {
  if (isDev && !isFunction(factory)) {
    console.error(
      `useCreate expect first param is a function but got ${typeof factory}`,
    )
  }
  const factoryRef = useRef<{
    deps: DependencyList | undefined
    isMount: boolean
    instance: undefined | T
  }>({
    deps,
    isMount: true,
    instance: undefined,
  })

  if (
    factoryRef.current.isMount ||
    !depsAreEqual(factoryRef.current.deps, deps)
  ) {
    factoryRef.current.instance = factory?.()
    factoryRef.current.isMount = false
  }

  return factoryRef.current.instance as T
}

export default useCreate
