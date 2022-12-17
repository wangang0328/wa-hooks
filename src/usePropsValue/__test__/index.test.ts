import { act, renderHook } from '@testing-library/react-hooks'
import usePropsValue from '../index'

describe('usePropsValue', () => {
  const fn = jest.fn()
  const setup = (props: any) =>
    renderHook(() => {
      const [state, setState] = usePropsValue(props)
      fn()
      return {
        parentData: usePropsValue(props),
        setValue: setState,
        value: state,
      }
    })

  it('test usePropsValue is unControlled', () => {
    const hook = setup({})
    expect(hook.result.current.value).toBeUndefined()
    act(() => {
      hook.result.current.setValue(2)
    })
    expect(hook.result.current.value).toBe(2)
    act(() => {
      hook.result.current.setValue(3)
    })
    expect(hook.result.current.value).toBe(3)
    hook.unmount()
  })

  it('test usePropsValue is controlled', () => {
    const hook = setup({ value: undefined })
    expect(hook.result.current.value).toBeUndefined()
    act(() => {
      hook.result.current.setValue(2)
    })
    expect(hook.result.current.value).toBeUndefined()
    hook.unmount()
  })

  it('test defaultValue', () => {
    const hook = setup({ defaultValue: 10 })
    expect(hook.result.current.value).toBe(10)
    act(() => {
      hook.result.current.setValue(2)
    })
    expect(hook.result.current.value).toBe(2)
    hook.unmount()
  })

  it('test forceUpdate', () => {
    const hook = setup({ defaultValue: 10 })
    expect(hook.result.current.value).toBe(10)
    expect(fn).toBeCalledTimes(1)
    act(() => {
      hook.result.current.setValue(10)
    })
    expect(fn).toBeCalledTimes(1)
    act(() => {
      hook.result.current.setValue(10, true)
    })
    expect(fn).toBeCalledTimes(2)
    hook.unmount()
  })
})
