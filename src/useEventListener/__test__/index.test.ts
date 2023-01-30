import { renderHook } from '@testing-library/react-hooks'
import useEventListener from '../index'

describe('useEventListener', () => {
  let divDom: HTMLDivElement

  beforeEach(() => {
    divDom = document.createElement('div')
    document.body.appendChild(divDom)
  })

  afterEach(() => {
    document.body.removeChild(divDom)
  })

  it('should work', () => {
    const cb = jest.fn()
    const hook = renderHook(() => {
      return useEventListener('click', cb, { target: divDom })
    })

    divDom.click()
    expect(cb).toBeCalled()
    hook.rerender()
    divDom.click()
    expect(cb).toBeCalled()
  })
})
