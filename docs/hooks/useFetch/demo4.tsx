import { useFetch } from '@wa-dev/hooks'
import React from 'react'

let count = 1
const fetchList = () => {
  const delay = Math.floor(Math.random() * 500) + 500
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // @ts-ignore
      resolve(count++)
    }, delay)
  })
}

const DebounceTest = () => {
  const { loading, data } = useFetch<string, any[]>(fetchList, {
    pollingInterval: 2000,
    pollingWhenHidden: false,
  })
  return <div>{loading ? <div>loading</div> : <div>data: {data}</div>}</div>
}

export default DebounceTest
