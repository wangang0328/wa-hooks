import { useUpdate } from '@wa-dev/hooks'
import { Button, message } from 'antd'
import React from 'react'

export default function () {
  const update = useUpdate()
  message.info('俺render了')
  return (
    <>
      <Button onClick={update}>点击更新</Button>
    </>
  )
}
