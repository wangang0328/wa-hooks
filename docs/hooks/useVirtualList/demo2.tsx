import { useVirtualList } from '@wa-dev/hooks'
import React, { useMemo, useRef } from 'react'

export default () => {
  const continerRef = useRef(null)
  const wrapperRef = useRef(null)
  const originalList = useMemo(() => {
    return Array.from(Array(10000).keys())
  }, [])

  const [list] = useVirtualList(originalList, {
    containerTarget: continerRef,
    wrapperTarget: wrapperRef,
    itemHeight: (index) => {
      if (index === 0) {
        return 200
      }
      return index % 2 === 0 ? 60 : 100
    },
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
              height: index === 0 ? 200 : index % 2 === 0 ? 60 : 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #ccc',
              marginBottom: '8px',
            }}
            key={data}
          >
            {data}
          </div>
        ))}
      </div>
    </div>
  )
}
