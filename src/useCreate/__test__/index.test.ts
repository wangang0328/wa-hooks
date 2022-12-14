import { act, renderHook } from '@testing-library/react-hooks'
import { useState } from 'react'
import useCreate from '../index'

describe('useCreate', () => {
  class Factory {
    data: number
    constructor() {
      this.data = Math.random()
    }
  }

  const setUp = () =>
    renderHook(() => {
      const [deps, setDeps] = useState(0)
      const [, update] = useState({})
      const f = useCreate(() => new Factory(), [deps])
      return {
        factory: f,
        deps,
        setDeps,
        update,
      }
    })

  it('test useCreate', () => {
    const hook = setUp()
    const lastData = hook.result.current.factory.data
    expect(lastData).not.toBeUndefined()

    act(() => {
      hook.result.current.update({})
    })
    expect(hook.result.current.factory.data).toBe(lastData)

    act(() => {
      hook.result.current.setDeps(2)
    })
    expect(hook.result.current.factory.data).not.toBe(lastData)
  })
})
