import { act, renderHook } from '@testing-library/react-hooks'
import useFetch from '../index'

const mockRequest = (seq: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (seq === 0) {
        reject(new Error('mock fail'))
      } else {
        resolve('mock success')
      }
    }, 1000)
  })
}

describe('useFetch', () => {
  const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    errSpy.mockRestore()
  })

  const setUp = (service: any, options: any) =>
    renderHook((o) => useFetch(service, o || options))

  it('test useFetch auto run', async () => {
    let success, process
    const successCb = (v: any) => {
      success = v
    }
    const errorCb = jest.fn()
    const beforeCb = () => {
      process = 'before'
    }
    const finallyCb = () => {
      process = 'finally'
    }

    let hook = setUp(mockRequest, {
      onSuccess: successCb,
      onError: errorCb,
      onFinally: finallyCb,
      onBefore: beforeCb,
    })

    expect(process).toBe('before')
    expect(success).toBeUndefined()
    expect(hook.result.current.loading).toBe(true)
    expect(hook.result.current.error).toBeUndefined()
    expect(hook.result.current.data).toBeUndefined()

    act(() => {
      jest.runOnlyPendingTimers()
    })
    await hook.waitForNextUpdate()
    expect(process).toBe('finally')
    expect(success).toBe('mock success')
    expect(hook.result.current.loading).toBe(false)
    expect(errorCb).toHaveBeenCalledTimes(0)
    expect(hook.result.current.data).toBe('mock success')

    // manual fetch fail
    act(() => {
      hook.result.current.run(0)
    })
    expect(hook.result.current.loading).toBe(true)

    act(() => {
      jest.runOnlyPendingTimers()
    })
    await hook.waitForNextUpdate()

    expect(process).toBe('finally')
    expect(success).toBe('mock success')
    expect(hook.result.current.loading).toBe(false)
    expect(errorCb).toHaveBeenCalledTimes(1)
    expect(hook.result.current.data).toBe('mock success')

    // manual fetch success
    act(() => {
      hook.result.current.run(1)
    })
    expect(hook.result.current.loading).toBe(true)
    act(() => {
      jest.runOnlyPendingTimers()
    })
    await hook.waitForNextUpdate()
    expect(process).toBe('finally')
    expect(success).toBe('mock success')
    expect(hook.result.current.loading).toBe(false)
    expect(errorCb).toHaveBeenCalledTimes(1)
    expect(hook.result.current.error).toBeUndefined()
    expect(hook.result.current.data).toBe('mock success')
    hook.unmount()
    success = undefined

    // auto fetch fail
    act(() => {
      hook = setUp(() => mockRequest(0), {
        onSuccess: successCb,
        onError: errorCb,
      })
    })
    expect(hook.result.current.loading).toBe(true)
    act(() => {
      jest.runOnlyPendingTimers()
    })
    await hook.waitForNextUpdate()
    expect(success).toBeUndefined()
    expect(errorCb).toBeCalledTimes(2)
    expect(hook.result.current.data).toBeUndefined()
    expect(hook.result.current.loading).toBe(false)
    hook.unmount()
  })

  it('test manual trigger', () => {})

  it('test defaultParams', () => {})

  it('test errSetData', () => {})

  it('test defaultData', () => {})

  it('test formatData', () => {})
})
