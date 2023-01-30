import type { DependencyList, EffectCallback } from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import useUnmount from '../useUnmount'
import depsAreEqual from '../utils/depsAreEqual'
import type { Target, TargetType, TargetValue } from '../utils/domTarget'
import { getTargetDom } from '../utils/domTarget'

/**
 * 创建带有比较dom的useEffect或useLayoutEffect
 */
const createEffectWithTarget = (
  effectFn: typeof useEffect | typeof useLayoutEffect,
) => {
  const useLayoutEffectWithTarget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: Target | Target[] | undefined,
  ) => {
    const isMountRef = useRef(true)

    const lastDepsRef = useRef<DependencyList>([])
    const lastElsRef = useRef<TargetType<TargetValue>[]>([])
    const unMountFnRef = useRef<ReturnType<EffectCallback>>()

    effectFn(() => {
      const targets = Array.isArray(target) ? target : [target]
      const eleList = targets.map((item) => getTargetDom(item))

      if (isMountRef.current) {
        // 首次挂载执行
        isMountRef.current = false
        lastDepsRef.current = deps
        lastElsRef.current = eleList
        unMountFnRef.current = effect()
        return
      }

      // 依赖和dom对比
      if (
        !depsAreEqual(lastDepsRef.current, deps) ||
        !depsAreEqual(lastElsRef, eleList)
      ) {
        // 执行unMount
        unMountFnRef.current?.()

        // update
        lastDepsRef.current = deps
        lastElsRef.current = eleList
        unMountFnRef.current = effect()
      }
    })

    useUnmount(() => {
      unMountFnRef.current?.()
      // TODO: react 源码确认 react-refresh
      isMountRef.current = true
    })
  }

  return useLayoutEffectWithTarget
}

export default createEffectWithTarget
