import { renderHook } from '@testing-library/react-hooks'
import type { Options } from '../index'
import useDrag from '../index'

const setup = (data: any, target: any, options?: Options) =>
  renderHook(() => useDrag(data, target, options))

const events: Record<string, (event: any) => void> = {}

const mockTarget = {
  addEventListener: jest.fn((event, cb) => {
    events[event] = cb
  }),
  removeEventListener: jest.fn((event) => {
    Reflect.deleteProperty(events, event)
  }),
  setAttribute: jest.fn(),
}

describe('useDrag', () => {
  it('should add/remove listener on mount/unmount', () => {
    const hook = setup(1, mockTarget)
    expect(mockTarget.addEventListener).toBeCalled()
    // mockTarget.addEventListener.mock.calls
    // [['dragStart', [Function: dragStartCb]],]
    expect(mockTarget.addEventListener.mock.calls[0][0]).toBe('dragStart')
    expect(mockTarget.addEventListener.mock.calls[1][0]).toBe('dragEnd')
    expect(mockTarget.setAttribute).toBeCalledWith('draggable', 'true')
    hook.unmount()
    expect(mockTarget.removeEventListener).toBeCalled()
  })

  it('should trigger dragStart/dragEnd callBack', () => {
    const onDragStart = jest.fn()
    const onDragEnd = jest.fn()
    const mockEvent = {
      dataTransfer: {
        setData: jest.fn(),
      },
    }
    setup(1, mockTarget, { onDragEnd, onDragStart })

    events.dragStart(mockEvent)
    expect(onDragStart).toBeCalled()
    expect(mockEvent.dataTransfer.setData).toBeCalledWith('custom', '1')
    events.dragEnd(mockEvent)
    expect(onDragEnd).toBeCalled()
  })
})
