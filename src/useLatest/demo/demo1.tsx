import React, { Button, message } from 'antd'
import { useEffect, useState } from 'react'

const MyComponent = () => {
  const [count, setCount] = useState(0)
  const fn = () => {
    console.log(count)
    message.info(`销毁时候获取到的count：${count}`)
  }
  useEffect(() => {
    // 此时已经是个闭包，fn拿到的数据其实是第一次的数据
    return () => fn()
  }, [])

  return (
    <>
      <Button onClick={() => setCount(count + 1)}>增加</Button>
      <div>{count}</div>
    </>
  )
}

export default () => {
  const [state, setState] = useState(false)

  return (
    <>
      <Button onClick={() => setState(!state)}>
        {state ? 'unmount' : 'mount'}
      </Button>
      <div>----------华丽的分割线-------------</div>
      {state && <MyComponent />}
    </>
  )
}
