/**
 * 处理父组件传来的value
 */
import type { SetStateAction } from 'react'
import { useRef } from 'react'
import useMemoFn from '../useMemoFn'
import useUpdate from '../useUpdate'
import depsAreEqual from '../utils/depsAreEqual'
import { isFunction } from '../utils/validate'

export interface UsePropsValueProp<T> {
  value?: T
  defaultValue?: T
  onChange?: (v: T | undefined) => void
}

export type SetValue<T> = (
  v: SetStateAction<T | undefined>,
  forceTriggerOnChange?: boolean,
) => void

function usePropsValue<T = any>(props: {
  onChange?: (v: T) => void
}): [v: T | undefined, setValue: SetValue<T>]

function usePropsValue<T = any>(props: {
  value: T
  onChange?: (v: T) => void
}): [v: T, setValue: SetValue<T>]

function usePropsValue<T = any>(props: {
  defaultValue: T
  onChange?: (v: T) => void
}): [v: T, setValue: SetValue<T>]

function usePropsValue<T = any>(props: {
  value: T
  defaultValue: T
  onChange?: (v: T) => void
}): [v: T, setValue: SetValue<T>]

function usePropsValue<T = any>(props: UsePropsValueProp<T>) {
  const areHaveValueProp = () => 'value' in props
  const update = useUpdate()
  const valueRef = useRef<T | undefined>(
    areHaveValueProp() ? props.value : props.defaultValue,
  )

  if (areHaveValueProp()) {
    valueRef.current = props.value
  }

  const setValue = useMemoFn(
    (v: SetStateAction<T | undefined>, forceTriggerOnChange = false) => {
      const nextValue = isFunction(v) ? v(valueRef.current) : v
      // forceTriggerOnChange 是否强制触发onChange，不论值是否改变
      if (
        depsAreEqual([nextValue], [valueRef.current]) &&
        !forceTriggerOnChange
      ) {
        return
      }
      props.onChange?.(nextValue)
      valueRef.current = nextValue
      // 因为用ref记录的value，需要手动触发
      update()
    },
  )
  return [valueRef.current, setValue] as const
}

export default usePropsValue
