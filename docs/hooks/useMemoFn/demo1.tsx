import { useMemoFn } from '@wa-dev/hooks'
import { Button, Input, message } from 'antd'
import React, { useState } from 'react'

export default function () {
  const [text, setText] = useState('')

  const onClick = useMemoFn(() => {
    message.info(`发送的信息内容为: ${text}`)
  })

  return (
    <>
      <Input value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={onClick}>发送信息</Button>
    </>
  )
}
