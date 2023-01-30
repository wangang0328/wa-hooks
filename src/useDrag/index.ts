// import React, { } from 'react'
import type { DragEvent } from 'react'
import useEffectWithTarget from '../useEffectWithTarget'
import useLatest from '../useLatest'
import type { Target } from '../utils/domTarget'
import { getTargetDom } from '../utils/domTarget'

export interface Options {
  onDragStart?: (e: DragEvent) => void
  onDragEnd?: (e: DragEvent) => void
}

const useDrag = <T = any>(
  data: T,
  target: Target<Element>,
  options: Options = {},
) => {
  const optionsRef = useLatest(options)
  const dataRef = useLatest(data)

  useEffectWithTarget(
    () => {
      const targetDom = getTargetDom(target)
      if (!targetDom) {
        return
      }

      targetDom.setAttribute('draggable', 'true')
      // 将data值挂载到dom属性上
      targetDom.setAttribute('__drag_data__', JSON.stringify(dataRef.current))
      const dragStartCb = (e: DragEvent) => {
        optionsRef.current.onDragStart?.(e)
        e.dataTransfer.setData('custom', JSON.stringify(dataRef.current))
      }
      const dragEndFnCb = (e: DragEvent) => {
        optionsRef.current.onDragEnd?.(e)
      }
      targetDom.setAttribute('draggable', 'true')
      targetDom.addEventListener('dragStart', dragStartCb as any)
      targetDom.addEventListener('dragEnd', dragEndFnCb as any)

      return () => {
        targetDom.removeEventListener('dragStart', dragStartCb as any)
        targetDom.removeEventListener('dragEnd', dragEndFnCb as any)
      }
    },
    [],
    target,
  )
}

export default useDrag
