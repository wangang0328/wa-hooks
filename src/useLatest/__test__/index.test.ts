import { renderHook } from '@testing-library/react-hooks'
import useLatest from '../index'

const setUp = (val: any) => renderHook((props) => useLatest(props), { initialProps: val })

describe('useLatest', () => {
  it('test useLatest with basic variable', () => {
    const { result, rerender } = setUp(0)
    expect(result.current.current).toBe(0)

    rerender(2)
    expect(result.current.current).toBe(2)

    rerender(3)
    expect(result.current.current).toBe(3)
  })

  it('test useLatest with reference variable', () => {
    const { result, rerender } = setUp({})
    expect(result.current.current).toEqual({})

    rerender({ name: 'wa' })
    expect(result.current.current).toEqual({ name: 'wa' })
  })
})
