import { useFetch } from '@wa-dev/hooks'
import { Input } from 'antd'
import Mock from 'mockjs'
import React from 'react'

interface List {
  list: string[]
}

const fetchList = (search?: string) => {
  console.log('search', search)
  const delay = Math.floor(Math.random() * 500)
  return new Promise<List>((resolve) => {
    setTimeout(() => {
      const data = Mock.mock({
        'list|5-10': ['@email'],
      })
      resolve(data)
    }, delay)
  })
}

const DebounceTest = () => {
  const { loading, data, run } = useFetch<List, any[]>(fetchList, {
    manual: false,
  })
  return (
    <div>
      <Input onChange={(e) => run(e.target.value)} />
      {loading ? (
        <div>loading</div>
      ) : (
        data?.list?.map((item) => <div key={item}>{item}</div>)
      )}
    </div>
  )
}

export default DebounceTest
