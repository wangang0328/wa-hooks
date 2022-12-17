import { usePropsValue } from '@wa-dev/hooks'
import { Input } from 'antd'
import React, { useState } from 'react'

const ChildCmp = (props: any) => {
  const [v, setV] = usePropsValue(props)

  return (
    <>
      <div>非受控子组件值: {v}</div>
      <Input value={v} onChange={(e) => setV(e.target.value)} />
    </>
  )
}

const ParentCmp = () => {
  const [value] = useState('1')

  return (
    <>
      父组件的值: {value}
      <div>-----分割-----</div>
      <ChildCmp defaultValue={value} />
    </>
  )
}

export default ParentCmp
