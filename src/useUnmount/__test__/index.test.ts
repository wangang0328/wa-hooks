import { renderHook } from '@testing-library/react-hooks'
import useUnmount from '../index'


describe('useUnmount', () => {
  it('test useUnmount', () => {
    const fn = jest.fn()
    const hook = renderHook(() => useUnmount(fn))
    expect(fn).toBeCalledTimes(0)
    hook.rerender()
    expect(fn).toBeCalledTimes(0)
    hook.unmount()
    expect(fn).toBeCalledTimes(1)
    renderHook(() => useUnmount(fn)).unmount()
    expect(fn).toBeCalledTimes(2)
  })

  it('test useUnmount param is not a function should log error', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
    renderHook(() => useUnmount('1' as any))
    expect(errSpy).toBeCalledWith('expect parameter is a function, but got string')
    errSpy.mockRestore()
  })
})