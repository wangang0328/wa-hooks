import SparkMD5 from 'spark-md5'

export function processFileHash(
  fileChunkList: Blob[],
  onProgress?: (
    status: 'executing' | 'done' | 'error',
    value: number | string,
  ) => void,
) {
  const spark = new SparkMD5.ArrayBuffer()
  let cur = 0
  const len = fileChunkList.length
  let progress = 0

  // TODO: 验证只创建一个fileReader
  // TODO: 计算进度
  const fileReader = new FileReader()
  const loadNext = () => {
    fileReader.readAsArrayBuffer(fileChunkList[cur])
  }

  fileReader.onload = (e: any) => {
    try {
      spark.append(e.target.result)
      if (cur === len - 1) {
        const hash = spark.end()
        onProgress?.('done', hash)
      } else {
        ++cur
        progress = Math.floor((cur / len) * 100)
        onProgress?.('executing', progress)
        loadNext()
      }
    } catch (error) {
      onProgress?.('error', 'splice error')
    }
  }
  loadNext()
  return {
    onProgress: () => {},
  }
}
