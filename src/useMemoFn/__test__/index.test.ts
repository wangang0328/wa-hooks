import { act, renderHook } from '@testing-library/react-hooks'
import { useState } from 'react'
import useMemoFn from '../index'

const useCount = () => {
  const [count, setCount] = useState(0)

  const addCount = () => {
    setCount((c: any) => c + 1)
  }

  const memoizedFn = useMemoFn(() => count)

  return { addCount, memoizedFn }
}

describe('useMemoFn', () => {
  it('test useMemoFn', () => {
    // 函数引用没有改
    const hook = renderHook(() => useCount())
    const fn1 = hook.result.current.memoizedFn
    expect(hook.result.current.memoizedFn()).toBe(0)
    hook.rerender()
    expect(hook.result.current.memoizedFn).toEqual(fn1)

    act(() => {
      hook.result.current.addCount()
    })
    expect(hook.result.current.memoizedFn()).toBe(1)
  })

  it('tst useMemoFn param is not a function console error', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    renderHook(() => useMemoFn(1 as any))
    expect(errSpy).toBeCalledWith(
      'useMemoFn expect parameter is a function but got number',
    )
    errSpy.mockRestore()
  })
})
