import { useDrag, useDrop } from '@wa-dev/hooks'
import React, { useRef } from 'react'

const list = [
  {
    key: '1',
    value: 'dom1',
  },
  {
    key: '2',
    value: 'dom2',
  },
  {
    key: '3',
    value: 'dom3',
  },
]

const DragItem = ({ item }: any) => {
  const targetRef = useRef(null)
  useDrag({ ...item }, targetRef, {
    onDragStart: (e) => {
      console.log('start', e)
    },
  })
  return (
    <div
      ref={targetRef}
      style={{
        width: '200px',
        height: '30px',
        border: '1px solid #000',
        marginBottom: '10px',
      }}
    >
      {item.value}
    </div>
  )
}

export default () => {
  const listRef = useRef(null)
  useDrop(listRef, {
    onDragOver(e) {
      console.log(e?.target)
    },
    onDrop(e) {
      console.log('drop---', e)
    },
  })

  return (
    <div ref={listRef}>
      {list.map((item) => (
        <DragItem key={item.key} item={{ ...item }} />
      ))}
    </div>
  )
}
