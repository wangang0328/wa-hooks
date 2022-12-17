import { usePropsValue } from '@wa-dev/hooks'
import { Input } from 'antd'
import React, { useState } from 'react'

const ChildCmp = (props: any) => {
  const [v, setV] = usePropsValue(props)

  return (
    <div>
      <div>受控子组件值: {v}</div>
      <Input value={v} onChange={(e) => setV(e.target.value)} />
    </div>
  )
}

const ParentCmp = () => {
  const [value, setValue] = useState('')
  return <ChildCmp value={value} onChange={(v: any) => setValue(v)} />
}

export default ParentCmp
