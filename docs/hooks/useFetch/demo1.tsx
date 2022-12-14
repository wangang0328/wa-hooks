import { useFetch } from '@wa-dev/hooks'
import Mock from 'mockjs'
import React from 'react'

const fetchLoginInfo = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = Mock.mock({
        'flag|1': true,
        name: '@name',
        'age|20-80': 1,
      })
      // console.log('data---', data)
      if (data.flag) {
        resolve(data)
      } else {
        reject(new Error('mock error'))
      }
    }, 2000)
  })

const AutoFetchTest = () => {
  const { loading, error, data } = useFetch<any>(fetchLoginInfo)
  if (loading) {
    return <div>loading...</div>
  }
  if (error) {
    return <div>获取数据出现了错误{error.message}</div>
  }
  return <div>获取到了信息：name: {data?.name}</div>
}

export default AutoFetchTest
