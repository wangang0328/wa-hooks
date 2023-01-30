import type { ClipboardEvent, DragEvent } from 'react'
import { useRef } from 'react'
import useEffectWithTarget from '../useEffectWithTarget'
import useLatest from '../useLatest'
import type { Target } from '../utils/domTarget'
import { getTargetDom } from '../utils/domTarget'

export interface Options {
  onFiles?: (files: File[], event?: DragEvent) => void
  onUri?: (uri: string, event?: DragEvent) => void
  onDom?: (dom: any, event?: DragEvent) => void
  // 裁剪事件
  onText?: (text: string, event?: ClipboardEvent) => void
  onDragEnter?: (event?: DragEvent) => void
  onDragOver?: (event?: DragEvent) => void
  onDragLeave?: (event?: DragEvent) => void
  onDrop?: (event?: DragEvent) => void
  onPaste?: (event?: ClipboardEvent) => void
}

const useDrop = (target: Target<Element>, options: Options = {}) => {
  const optionsRef = useLatest(options)
  const lastEnterRef = useRef<any>()

  useEffectWithTarget(
    () => {
      const targetDom = getTargetDom(target)
      if (!targetDom) {
        return
      }

      const onData = (
        transfer: DataTransfer,
        e: DragEvent | ClipboardEvent,
      ) => {
        const dom = transfer.getData('custom')
        const uri = transfer.getData('text/uri-list')
        if (dom) {
          let dataTarget = dom
          try {
            dataTarget = JSON.parse(dataTarget)
          } catch (e) {
            // do nothing
          }
          optionsRef.current.onDom?.(dataTarget, e as DragEvent)
          return
        }

        if (uri) {
          optionsRef.current.onUri?.(uri, e as DragEvent)
          return
        }

        if (transfer.files.length) {
          optionsRef.current.onFiles?.(
            Array.from(transfer.files),
            e as DragEvent,
          )
          return
        }

        if (transfer.items?.length) {
          transfer.items[0].getAsString((text) => {
            optionsRef.current.onText?.(text, e as ClipboardEvent)
          })
        }
      }

      const onDragEnter = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        lastEnterRef.current = e.target
        optionsRef.current.onDragEnter?.(e)
      }
      const onDragOver = (e: DragEvent) => {
        e.preventDefault()
        optionsRef.current.onDragOver?.(e)
      }
      const onDragLeave = (e: DragEvent) => {
        // TODO: 校验的目的？
        if (lastEnterRef.current === e.target) {
          optionsRef.current.onDragLeave?.(e)
        }
      }
      const onDrop = (e: DragEvent) => {
        console.log('drop')
        onData(e.dataTransfer, e)
        optionsRef.current.onDrop?.(e)
      }
      const onPaste = (e: ClipboardEvent) => {
        onData(e.clipboardData, e)
        optionsRef.current.onPaste?.(e)
      }

      targetDom.addEventListener('dragEnter', onDragEnter as any)
      targetDom.addEventListener('dragOver', onDragOver as any)
      targetDom.addEventListener('dragLeave', onDragLeave as any)
      targetDom.addEventListener('drop', onDrop as any)
      targetDom.addEventListener('paste', onPaste as any)

      return () => {
        targetDom.removeEventListener('dragEnter', onDragEnter as any)
        targetDom.removeEventListener('dragOver', onDragOver as any)
        targetDom.removeEventListener('dragLeave', onDragLeave as any)
        targetDom.removeEventListener('drop', onDrop as any)
        targetDom.removeEventListener('paste', onPaste as any)
      }
    },
    [],
    target,
  )
}

export default useDrop
