import { useEffect, useRef, useState } from 'react'
import useEventListener from '../useEventListener'
import useLatest from '../useLatest'
import useMemoFn from '../useMemoFn'
import type { Target } from '../utils/domTarget'
import { isFunction, isNumber, isUndefined } from '../utils/validate'
import { getTargetDom } from './../utils/domTarget'

type ItemHeight<T> = (index: number, data: T) => number

export interface Options<T> {
  /**
   * 外部容器
   */
  containerTarget: Target
  /**
   * 内部容器
   */
  wrapperTarget: Target
  /**
   * 视区上下渲染的数量
   */
  overscan?: number
  itemHeight?: number | ItemHeight<T>
}

const getMarginY = (dom: Element) => {
  if (!dom) {
    return 0
  }
  const { marginBottom, marginTop } = getComputedStyle(dom)

  return (
    Number(marginTop.slice(0, marginTop.length - 2)) +
    Number(marginBottom?.slice(0, marginBottom.length - 2))
  )
}

const useVirtualList = <T = any>(list: T[], options: Options<T>) => {
  const { containerTarget, wrapperTarget, overscan = 5 } = options
  const [targetList, setTargetList] = useState<{ index: number; data: T }[]>([])
  const itemHeightRef = useLatest(options.itemHeight)
  const triggerScrollByFuncRef = useRef(false)
  const renderedOffsetInfoRef = useRef({ start: -1, end: -1 })
  const realDomsHeightRef = useRef<{ [key: string]: number }>({})
  const totalHeightRef = useRef(0)
  // 动态可变高度的平均值
  const averageHeightRef = useRef(10)

  // 没有使用useMemo的原因：使用useMemo在commit的mutation之前触发，导致有可能条目没有获取到真实高度
  useEffect(() => {
    // 固定高度
    if (isNumber(itemHeightRef.current)) {
      totalHeightRef.current = list.length * itemHeightRef.current
      return
    }
    // 回调函数高度
    if (isFunction(itemHeightRef.current)) {
      totalHeightRef.current = list.reduce(
        (sum, item, i) =>
          sum + (itemHeightRef.current as ItemHeight<T>)(i, item),
        0,
      )
      return
    }
    // 可变高度
    const wrapperDom = getTargetDom(wrapperTarget) as HTMLElement
    if (wrapperDom) {
      const start = renderedOffsetInfoRef.current.start
      Array.from(wrapperDom.children).forEach((dom, i) => {
        if (!realDomsHeightRef.current[i + start]) {
          realDomsHeightRef.current[i + start] =
            dom.clientHeight + getMarginY(dom)
        }
      })
      const heightList = Object.values(realDomsHeightRef.current)
      averageHeightRef.current = heightList.length
        ? heightList.reduce((sum, item) => sum + item, 0) / heightList.length
        : 10
      totalHeightRef.current = averageHeightRef.current * list.length
    }
  }, [
    list,
    isUndefined(itemHeightRef.current) && renderedOffsetInfoRef.current,
  ])

  // 获取偏移数目
  const getOffset = (scrollTop: number) => {
    // 固定高度
    if (isNumber(itemHeightRef.current)) {
      return Math.floor(scrollTop / itemHeightRef.current) + 1
    }
    // 自定义高度
    if (isFunction(itemHeightRef.current)) {
      let totalHeight = 0
      let offset = 0
      for (let i = 0; i < list.length; i++) {
        const curHeight = itemHeightRef.current(i, list[i])
        totalHeight += curHeight
        if (totalHeight >= scrollTop) {
          offset = i
          break
        }
      }
      return offset + 1
    }

    // 不定高度
    let totalHeight = 0
    let offset = 0
    for (let i = 0; i < list.length; i++) {
      totalHeight += realDomsHeightRef.current[i] || averageHeightRef.current
      if (totalHeight >= scrollTop) {
        offset = i
        break
      }
    }
    return offset + 1
  }

  const getVisibleCount = (clientHeight: number, startIndex: number) => {
    if (isNumber(itemHeightRef.current)) {
      return Math.ceil(clientHeight / itemHeightRef.current)
    }
    // 回调函数高度
    if (isFunction(itemHeightRef.current)) {
      let totalHeight = 0
      let endIndex = startIndex
      for (let i = startIndex; i < list.length; i++) {
        const curHeight = itemHeightRef.current(i, list[i])
        totalHeight += curHeight
        endIndex = i
        if (totalHeight >= clientHeight) {
          break
        }
      }
      return endIndex - startIndex
    }

    // 不定高度
    let totalHeight = 0
    let endIndex = startIndex
    for (let i = startIndex; i < list.length; i++) {
      totalHeight += realDomsHeightRef.current[i] || averageHeightRef.current
      if (totalHeight >= clientHeight) {
        endIndex = i
        break
      }
    }
    return endIndex - startIndex
  }

  const getDistanceTop = (start: number) => {
    if (isNumber(itemHeightRef.current)) {
      return itemHeightRef.current * start
    }

    if (isFunction(itemHeightRef.current)) {
      return list
        .slice(0, start)
        .reduce(
          (total, item, i) =>
            total + (itemHeightRef.current as ItemHeight<T>)(i, item),
          0,
        )
    }

    return list
      .slice(0, start)
      .reduce(
        (sum, _, i) =>
          sum + (realDomsHeightRef.current[i] || averageHeightRef.current),
        0,
      )
  }

  // 计算可视范围
  const calculateRange = () => {
    const containerDom = getTargetDom(containerTarget) as HTMLElement
    const wrapperDom = getTargetDom(wrapperTarget) as HTMLElement

    if (containerDom && wrapperDom) {
      // 获取外部对象的高度
      const { scrollTop, clientHeight } = containerDom
      // 内部对象的高度
      // 根据偏移量获得当前是第几个条目，开始索引
      const offset = getOffset(scrollTop)
      const visibleCount = getVisibleCount(clientHeight, offset)
      const start = Math.max(0, offset - overscan)
      const end = Math.min(list.length, offset + visibleCount + overscan)

      if (
        start === renderedOffsetInfoRef.current.start &&
        end === renderedOffsetInfoRef.current.end
      ) {
        // 小优化，如果开始和结束的索引都不改变，不做处理
        return
      }

      // 直接赋值新对象是为了触发高度计算, 触发useMemo会后于下面的高度计算，不过只差一个条目，影响可以忽略
      renderedOffsetInfoRef.current = { start, end }
      const offsetTop = getDistanceTop(start)
      wrapperDom.style.marginTop = `${offsetTop}px`
      wrapperDom.style.height = `${totalHeightRef.current - offsetTop}px`
      setTargetList(
        list.slice(start, end).map((item, i) => ({
          index: start + i,
          data: item,
        })),
      )
    }
  }

  // TODO: 添加依赖项，监听尺寸大小
  useEffect(() => {
    calculateRange()
  }, [list])

  useEventListener(
    'scroll',
    (e) => {
      if (triggerScrollByFuncRef.current) {
        triggerScrollByFuncRef.current = false
        return
      }
      e.preventDefault()
      calculateRange()
    },
    {
      target: containerTarget,
    },
  )

  const scrollTo = (index = 0) => {
    const containerDom = getTargetDom(containerTarget) as HTMLElement
    if (containerDom) {
      triggerScrollByFuncRef.current = true
      containerDom.scrollTop = getDistanceTop(index)
      calculateRange()
    }
  }

  return [targetList, useMemoFn(scrollTo)] as const
}

export default useVirtualList
