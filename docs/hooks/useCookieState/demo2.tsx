import { useCookieState } from '@wa-dev/hooks'
import { Button, Input } from 'antd'
import React from 'react'

export default function () {
  const [val, setVal] = useCookieState<string>('inputVal2', {
    expires: 3000,
    path: '/',
  })

  return (
    <>
      <Input value={val} onChange={(e) => setVal(e.target.value)} />
      <Button onClick={() => setVal()}>重置</Button>
    </>
  )
}
