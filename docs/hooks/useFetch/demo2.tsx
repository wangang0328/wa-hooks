import { useFetch } from '@wa-dev/hooks'
import { Button } from 'antd'
import Mock from 'mockjs'
import React from 'react'

interface LoginInfo {
  flag: boolean
  name: string
  age: number
}

const fetchLoginInfo = () =>
  new Promise<LoginInfo>((resolve, reject) => {
    setTimeout(() => {
      const data = Mock.mock({
        'flag|1': true,
        name: '@name',
        'age|20-80': 1,
      })
      // console.log('data---', data)
      if (!data.flag) {
        resolve(data)
      } else {
        reject(new Error('mock error'))
      }
    }, 2000)
  })

const ManualFetchTest = () => {
  const { loading, error, data, run, params } = useFetch<
    LoginInfo,
    any[],
    LoginInfo
  >(fetchLoginInfo, {
    manual: true,
    formatData: (data) => data,
    onError: (err) => {
      console.log('错误监听：', err.message)
    },
  })

  const ResultData = () => {
    if (error) {
      return <div>获取数据出现了错误{error.message}</div>
    }
    if (data) {
      return <div>获取到了信息：name: {data?.name}</div>
    }
    return null
  }

  return (
    <div>
      <Button
        onClick={() => {
          run(params)
        }}
      >
        {loading ? 'loading' : '获取数据'}
      </Button>
      <ResultData />
    </div>
  )
}

export default ManualFetchTest
