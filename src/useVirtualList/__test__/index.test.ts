import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks'
import useVirtualList from '../index'

describe('useVirtualList', () => {
  let containerDom: HTMLDivElement
  let wrapperDom: HTMLDivElement
  let hook: RenderHookResult<any, any>

  beforeEach(() => {
    containerDom = document.createElement('div')
    jest
      .spyOn(containerDom, 'clientHeight', 'get')
      .mockImplementation(() => 300)
    jest.spyOn(containerDom, 'clientWidth', 'get').mockImplementation(() => 300)
    wrapperDom = document.createElement('div')
    containerDom.appendChild(wrapperDom)
    document.body.appendChild(containerDom)
  })

  afterEach(() => {
    document.body.removeChild(containerDom)
    hook.unmount()
  })

  const setup = (list: any[], options: any) => {
    hook = renderHook(() => useVirtualList(list, options))
  }

  it('test scrollTo', () => {
    setup(Array.from(Array(10000).keys()), {
      containerTarget: containerDom,
      wrapperTarget: wrapperDom,
      itemHeight: 30,
    })
    act(() => {
      hook.result.current[1](20)
    })
    // overscan: 5 300/30 = 10, 10 + 5+5
    expect(hook.result.current[0].length).toBe(20)
    expect(containerDom.scrollTop).toBe(20 * 30)
  })

  it('test with fixed height', () => {
    setup(Array.from(Array(10000).keys()), {
      containerTarget: containerDom,
      wrapperTarget: wrapperDom,
      itemHeight: 30,
      overscan: 0,
    })
    act(() => {
      hook.result.current[1](20)
    })
    //  300/30 = 10
    expect(hook.result.current[0].length).toBe(10)
    expect(containerDom.scrollTop).toBe(20 * 30)
  })

  it('test with fixed callBack height', () => {
    const list = Array.from(Array(10000).keys())
    setup(list, {
      containerTarget: containerDom,
      wrapperTarget: wrapperDom,
      itemHeight: (i: number, data: any) => {
        // console.log(i, data)
        expect(list[i]).toBe(data)
        return i % 2 === 0 ? 30 : 60
      },
      overscan: 0,
    })
    act(() => {
      hook.result.current[1](20)
    })
    // 10 平均 45 300/45
    expect(hook.result.current[0].length).toBe(6)
    expect(hook.result.current[0][0].data).toBe(20)
    expect(hook.result.current[0][0].index).toBe(20)
    expect(hook.result.current[0][5].data).toBe(25)
    expect(hook.result.current[0][5].index).toBe(25)
    expect(wrapperDom.style.marginTop).toBe(20 * 45 + 'px')
    expect(wrapperDom.style.height).toBe((10000 - 20) * 45 + 'px')
  })

  // TODO: add测试可变高度
})
