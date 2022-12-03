import { useUnmount } from '@wa-dev/hooks'
import { Button, message } from 'antd'
import React, { useState } from 'react'

const MyComponent = () => {
  useUnmount(() => {
    message.info('执行 useUnmount')
  })
  return <div>mount 组件</div>
}

export default () => {
  const [state, setState] = useState(false)

  return (
    <>
      <Button onClick={() => setState(!state)}>
        {state ? 'unmount' : 'mount'}
      </Button>
      {state && <MyComponent />}
    </>
  )
}
