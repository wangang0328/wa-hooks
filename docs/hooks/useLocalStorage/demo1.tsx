import { useLocalStorage } from '@wa-dev/hooks'
import { Button, Input } from 'antd'
import React from 'react'

export default function () {
  const [val, setVal] = useLocalStorage<string>('inputVal')

  return (
    <>
      <Input value={val} onChange={(e) => setVal(e.target.value)} />
      <Button onClick={() => setVal()}>重置</Button>
    </>
  )
}
