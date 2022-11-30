import { useMount } from '@wa-dev/hooks'
import { Button, message } from 'antd'
import React, { useState } from 'react'

const MyComponent = () => {
  useMount(() => {
    message.info('执行 useMount')
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
