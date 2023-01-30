import { useVirtualList } from '@wa-dev/hooks'
import { Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

export default () => {
  const continerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [originalList, setOriginalList] = useState<number[]>([])

  const [list, scrollTo] = useVirtualList(originalList, {
    containerTarget: continerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 60,
  })

  useEffect(() => {
    setTimeout(() => {
      setOriginalList(Array.from(Array(10000).keys()))
    }, 1000)
  }, [])

  return (
    <div>
      <Button onClick={() => scrollTo(0)}>滚动到顶部</Button>
      <div
        ref={continerRef}
        style={{
          height: 300,
          overflow: 'auto',
          border: '1px solid #f0f',
        }}
      >
        <div ref={wrapperRef}>
          {list.map(({ data }) => (
            <div
              style={{
                height: 52,
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
    </div>
  )
}
