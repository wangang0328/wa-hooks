import { useVirtualList } from '@wa-dev/hooks'
import React, { useMemo, useRef } from 'react'

const generatorRandomStr = (i: number) => {
  const len = (i % 5) * 50 + 10
  return new Array(len).fill(`汪${i}`).toString()
}

export default () => {
  const continerRef = useRef(null)
  const wrapperRef = useRef(null)
  const originalList = useMemo(() => {
    return Array.from(Array(10000).keys())
  }, [])

  const [list] = useVirtualList(originalList, {
    containerTarget: continerRef,
    wrapperTarget: wrapperRef,
  })

  return (
    <div
      ref={continerRef}
      style={{
        height: 300,
        overflow: 'auto',
        border: '1px solid #f0f',
      }}
    >
      <div ref={wrapperRef}>
        {list.map(({ data, index }) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #ccc',
              marginBottom: '8px',
            }}
            key={data}
          >
            {generatorRandomStr(index)}
          </div>
        ))}
      </div>
    </div>
  )
}
