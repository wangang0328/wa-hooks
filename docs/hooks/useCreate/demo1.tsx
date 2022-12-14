import { useCreate } from '@wa-dev/hooks'
import { Button, message } from 'antd'
import React, { useState } from 'react'

class User {
  name: string
  constructor(name: string) {
    this.name = name
    message.info('实例被构建了')
  }
}

export default function () {
  const [, update] = useState({})
  const user = useCreate(() => new User('hello'), [])
  return (
    <>
      <Button onClick={() => update({})}>reRender</Button>
      <div>user.name: {user.name}</div>
    </>
  )
}
