import { renderHook } from '@testing-library/react-hooks'
import useMount from '../index'


describe('useMount', () => {
  it('test mount', async () => {
    const fn = jest.fn(); // 返回一个可以检测的函数 是一种创建存根的方法，它允许您跟踪调用、定义返回值等...
    // 调用的时候渲染一个专门用来测试的 TestComponent 来使用我们的hook
    const hook = renderHook(() => useMount(fn))
    // 首次加载调用
    expect(fn).toBeCalledTimes(1)

    // 重新渲染不调用
    hook.rerender()
    expect(fn).toBeCalledTimes(1)

    hook.unmount()
    expect(fn).toBeCalledTimes(1)

    renderHook(() => useMount(fn)).unmount()
    expect(fn).toBeCalledTimes(2)
  })

  it('test useMount param is not a function console error', () => {
    // 它允许您将对象上的现有方法转换为间谍，它还允许您跟踪调用并重新定义原始方法实现。
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
    renderHook(() => useMount(1 as any))
    expect(errSpy).toBeCalledWith('expect parameter is a function, but got number')
    // 将console方法恢复正常
    errSpy.mockRestore()
  })
})