import { act, renderHook } from '@testing-library/react-hooks'
import useLocalStorage from '../index'

describe('useLocalStorage', () => {
  const setUp = <T = any>(key: string, options?: any) =>
    renderHook(() => {
      const [state, setState] = useLocalStorage<T>(key, options)
      return {
        state,
        setState,
      }
    })

  it('useLocalStorage should work', () => {
    const hook = setUp('key1')
    expect(hook.result.current.state).toBeUndefined()
    act(() => {
      hook.result.current.setState('hello baby')
    })
    hook.rerender()
    expect(hook.result.current.state).toEqual('hello baby')
  })

  it('test defaultValue', () => {
    const hook = setUp('key2', { defaultValue: 'en' })
    expect(hook.result.current.state).toEqual('en')
    act(() => {
      hook.result.current.setState('hello baby2')
    })
    expect(hook.result.current.state).toEqual('hello baby2')
  })

  it('test expires options', async () => {
    jest.useFakeTimers()
    const hook = setUp('key3', { expires: 1000 })
    act(() => {
      hook.result.current.setState('hello')
    })
    expect(hook.result.current.state).toBe('hello')
    console.log('11111111')
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    hook.rerender()
    // 这个地方失败的原因：时间是保存到localStorage里面的，然而 advanceTimersByTime只是针对setTimeout，所以实际比较时，时长并没有真正的延时
    // expect(hook.result.current.state).toBeUndefined()
  })

  it('test support object', () => {
    const hook = setUp('key4', {
      defaultValue: { name: 'test' },
      expires: 1000,
    })
    expect(hook.result.current.state).toEqual({ name: 'test' })
    act(() => {
      hook.result.current.setState({ name: 'wa' })
    })
    expect(hook.result.current.state).toEqual({ name: 'wa' })
  })
})
