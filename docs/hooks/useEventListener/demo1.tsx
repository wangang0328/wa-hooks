import useEventListener from '@wa-dev/hooks/useEventListener'
import { Button } from 'antd'
import React, { useRef, useState } from 'react'

export default () => {
  const [cnt, setCnt] = useState(0)
  const btnRef = useRef(null)
  useEventListener(
    'click',
    () => {
      setCnt(cnt + 1)
    },
    {
      target: btnRef,
    },
  )
  return (
    <div>
      <Button ref={btnRef}>点击</Button>
      <p>点击了{cnt}次</p>
    </div>
  )
}
