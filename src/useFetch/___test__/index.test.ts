import {
  act,
  Renderer,
  renderHook,
  RenderHookResult,
} from '@testing-library/react-hooks'
import useFetch from '../index'
import { BaseResult } from '../types'

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

  let hook: RenderHookResult<
    unknown,
    BaseResult<unknown, any[]>,
    Renderer<unknown>
  >
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

    hook = setUp(mockRequest, {
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

  it('test manual trigger', async () => {
    act(() => {
      hook = setUp(mockRequest, {
        manual: true,
      })
    })
    expect(hook.result.current.loading).toBe(false)

    act(() => {
      hook.result.current.run(1)
    })
    expect(hook.result.current.loading).toBe(true)

    act(() => {
      jest.runOnlyPendingTimers()
    })

    await hook.waitForNextUpdate()
    expect(hook.result.current.loading).toBe(false)
    expect(hook.result.current.error).toBeUndefined()
    expect(hook.result.current.data).toBe('mock success')

    act(() => {
      hook.result.current.run(0)
    })
    expect(hook.result.current.loading).toBe(true)

    act(() => {
      jest.runOnlyPendingTimers()
    })

    await hook.waitForNextUpdate()
    expect(hook.result.current.loading).toBe(false)
    expect(hook.result.current.error).toEqual(new Error('mock fail'))
    expect(hook.result.current.data).toBe('mock success')
    hook.unmount()
  })

  it('test defaultParams', async () => {
    act(() => {
      hook = setUp(mockRequest, {
        defaultParams: ['a', 1, 2],
      })
    })
    expect(hook.result.current.params).toEqual(['a', 1, 2])
    act(() => {
      jest.runOnlyPendingTimers()
    })
    await hook.waitForNextUpdate()
    expect(hook.result.current.params).toEqual(['a', 1, 2])
    hook.unmount()
  })

  it('test errSetData', async () => {
    act(() => {
      hook = setUp(mockRequest, {
        defaultParams: [0],
        errSetData: 'error data',
      })
    })
    expect(hook.result.current.params).toEqual([0])
    act(() => {
      jest.runOnlyPendingTimers()
    })
    await hook.waitForNextUpdate()
    expect(hook.result.current.data).toEqual('error data')
    hook.unmount()
  })

  it('test defaultData', async () => {
    act(() => {
      hook = setUp(mockRequest, {
        defaultParams: [1],
        defaultData: 'default data',
      })
    })
    expect(hook.result.current.data).toEqual('default data')
    act(() => {
      jest.runOnlyPendingTimers()
    })
    await hook.waitForNextUpdate()
    expect(hook.result.current.data).toEqual('mock success')
    hook.unmount()
  })

  it('test formatData', async () => {
    act(() => {
      hook = setUp(mockRequest, {
        defaultParams: [1],
        formatData: () => 'format data',
      })
    })
    expect(hook.result.current.data).toBeUndefined()
    act(() => {
      jest.runOnlyPendingTimers()
    })
    await hook.waitForNextUpdate()
    expect(hook.result.current.data).toEqual('format data')
    hook.unmount()
  })
})
