import { act, renderHook } from '@testing-library/react-hooks'
import useUpdate from '../index'

describe('useUpdate', () => {
  test('useUpdate is update', () => {
    const fn = jest.fn()
    const hook = renderHook(() => {
      fn()
      const update = useUpdate()
      return update
    })
    expect(fn).toBeCalledTimes(1)
    act(hook.result.current)
    expect(fn).toBeCalledTimes(2)
  })
})
