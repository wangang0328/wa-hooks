import { useRef } from 'react'
import useCreate from '../useCreate'
import useEffectWithTarget from '../useEffectWithTarget'
import { getTargetDom, Target } from '../utils/domTarget'
import { isUndefined } from '../utils/validate'
import { AsyncPool } from './AsyncPool'
import { processFileHash } from './processFileHash'
import { request } from './request'
// 状态值 status， uploading done pending error

// 大文件上传不支持多选，
export interface Options {
  /**
   * 切片配置项
   */

  /**
   * 切片大小，单位 mb
   * TODO: 兼容string, 单位B,KB,MB,G 转换
   */
  sliceSize?: number
  onSliceSuccess?: (fileHash: string) => void
  onSliceError?: (err: unknown) => void

  /**
   * 最大上传并发数，http1.1 chrome 同一域名下维持的最多tcp连接为6个
   * 默认 4
   */
  uploadConcurrency?: number
  retryCount?: number

  /**
   * 文件后缀限制
   */
  extensionLimit?: number
  /**
   * 文件最大值限制
   * TODO: 兼容string, 单位Byte,KB,MB,GB 转换
   */
  maxSize?: number
  /**
   * 最小限制
   */
  minSize?: number

  /**
   * 设置请求头
   */
  headers?: Record<string, any>

  /**
   * 校验是否上传配置项
   */
  /**
   * 校验是否需要重新上传
   * 支持校验上传url，或者上传函数，如果返回的是空字符串或者null， 认为是需要上传
   */
  verifyAction?:
    | string
    | ((fileHash: string, file: File) => Promise<string | null>)
  // 默认GET请求
  verifyMethod?: string
  // 校验的请求头，如果设置了该headers，会和options的header进行合并
  verifyHeaders?: Record<string, any>
  onVerifySuccess?: (url: string | null) => void
  onVerifyError?: (e: unknown) => void

  /**
   * 发起请求合并请求的地址或者异步请求函数
   */
  mergeAction?: string | ((fileHash: string, file: File) => Promise<boolean>)

  // 不返回值，认为不做校验， 返回true 校验成功， 返回false 校验失败
  onFileChange?: (file: HTMLInputEvent) => void | boolean
  // TODO: target属性
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

// TODO: 支持带单位的转换
const formatSizeToByte = (slize: number) => slize * 1024 * 1024

// 切片
const getFileChunkList = (file: File, sliceSize: number) => {
  // const reader = new FileReader().read
  const stepSize = formatSizeToByte(sliceSize)
  const fileChunkList: Blob[] = []

  let cur = 0
  while (cur < file.size) {
    const fileChunk = file.slice(cur, cur + stepSize)
    fileChunkList.push(fileChunk)
    cur += stepSize
  }
  return fileChunkList
}

const uploadSliceData = (
  data: FormData,
  onProgress: (ev: ProgressEvent<EventTarget>) => any,
) => {
  return request('http://localhost:3000', {
    method: 'post',
    // headers: {
    //   'content-type': ''
    // },
    data,
    onProgress,
  })
}

const useUpload = (target: Target<any>, options: Options = {}) => {
  const {
    sliceSize = 5,
    uploadConcurrency = 4,
    retryCount = 2,
    onFileChange,
    onSliceSuccess,
    onSliceError,
  } = options
  // 要返回的值
  // status: 'sliceing' | 'uploading' | 'mergeing' | 'done'
  // error: New Error('错误信息')
  // progress: 进度
  // uploadList: { status: '', progress: '', index: '', ...}
  const asyncPool = useCreate(() => {
    return new AsyncPool(uploadConcurrency, retryCount)
  }, [])

  const lastFileRef = useRef<File | null>(null)

  useEffectWithTarget(
    () => {
      // 获取target
      const inputEle = getTargetDom(target)

      const onFileChangeHandler = async (e: HTMLInputEvent) => {
        const target = e.target
        const file = target.files?.[0] || null

        // --- 文件切换后触发钩子，开发者可以自行判断是否进行下一步操作
        const isLegal = onFileChange?.(e)
        target.value = ''

        if ((!isUndefined(isLegal) && !isLegal) || file === null) {
          // 校验不合法
          lastFileRef.current = null
          return
        }
        lastFileRef.current = file

        const chunkList = getFileChunkList(file, sliceSize)

        let fileHash: string | null = null
        try {
          fileHash = await new Promise((resolve, reject) => {
            processFileHash(chunkList, (status, val) => {
              console.log('valu----', status, val)
              switch (status) {
                case 'done':
                  resolve(val as string)
                  break
                case 'executing':
                  // TODO:
                  break
                default:
                  // error
                  reject(val)
                  break
              }
            })
          })
          onSliceSuccess?.(fileHash!)
        } catch (error) {
          onSliceError?.(error)
        }

        // 切片失败
        if (!fileHash) {
          return
        }

        //TODO: 秒传校验， 接口请求错误，给开发者一个钩子，来决定终止流程还是 继续切片上传
        // 校验是否有数据
        // verifyUpload()
        console.log('fileHash', fileHash)
        // TODO: 文件上传
        // generatorUploadFn
        // 构造请求数据
        const enqueueRequestPool = () => {
          const chunkInfos: any[] = []
          const totalCount = chunkList.length
          chunkList.forEach((chunk, index) => {
            // 'uploading' | 'pending' | 'success' | 'error'
            const requestInfo = {
              status: 'pending',
              progress: 0,
              index,
              hash: fileHash,
              key: `${index}_${fileHash}`,
            }
            chunkInfos.push(requestInfo)

            const formData = new FormData()
            formData.append('chunk', chunk)
            formData.append('totalCount', totalCount + '')
            formData.append('hash', `${fileHash}-${index}`)
            formData.append('fileHash', fileHash!)
            formData.append('filename', 'filename.zip')

            const fn = async () => {
              console.log('runing----')
              requestInfo.status = 'uploading'
              try {
                const res = await uploadSliceData(formData, (ev) => {
                  requestInfo.progress = Math.floor(
                    (ev.loaded / ev.total) * 100,
                  )
                })
                console.log('res-', res)
                requestInfo.progress = 100
                requestInfo.status = 'success'
                // if (res?.status === 200) {
                //   requestInfo.status = 'success'
                // } else {
                //   console.log('error----else', res)
                //   throw new Error(res.status)
                // }
              } catch (error) {
                console.log('err', error)
                requestInfo.progress = 100
                requestInfo.status = 'error'
                // TODO: 终止后续请求
              } finally {
                // TODO: 更新
              }
              return null
            }
            // 调用执行
            asyncPool.callManual(fn)
          })
        }
        enqueueRequestPool()
        // hello---
        asyncPool.onSuccess(() => {
          console.log('上传成功了，准备发起merge') // 发起merge
        })
        asyncPool.runAsync()
      }

      inputEle?.addEventListener('change', onFileChangeHandler)

      return () => {
        inputEle?.removeEventListener('change', onFileChangeHandler)
      }
    },
    [],
    target,
  )

  throw new Error('暂时未实现')
}

export default useUpload
