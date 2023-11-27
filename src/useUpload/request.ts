// 因为fetch不支持进度，所以选择使用xmlhttprequest

const INITIAL_HEADERS = {
  // 'content-type': 'application/json'
}

export type Method =
  | 'GET'
  | 'get'
  | 'post'
  | 'POST'
  | 'PUT'
  | 'put'
  | 'delete'
  | 'DELETE'

export const request = (
  url: string,
  options?: {
    method?: Method
    headers?: Record<string, string>
    data?: Record<string, any> | any
    onProgress?: (ev: ProgressEvent<EventTarget>) => any
  },
) => {
  return new Promise<any>((resolve, reject) => {
    const {
      method = 'get',
      headers = {},
      data = {},
      onProgress = () => {},
    } = options || {}

    const headersResult: Record<string, string> = {
      ...INITIAL_HEADERS,
      ...headers,
    }
    const xhr = new XMLHttpRequest()

    xhr.onprogress = onProgress
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(`${xhr.status}: ${xhr.statusText}`)
      }
    }
    xhr.onerror = () => {
      reject(`${xhr.status}: ${xhr.statusText}`)
    }

    const methodResult = method.toLocaleUpperCase()
    let urlResult = new URL(url)
    let dataResult = data
    if (methodResult === 'GET') {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          urlResult.searchParams.append(key, data[key])
        }
      }
      dataResult = {}
    }
    xhr.open(methodResult, url)
    // 设置请求头
    for (const key in headersResult) {
      if (Object.prototype.hasOwnProperty.call(headersResult, key)) {
        xhr.setRequestHeader(key, headersResult[key])
      }
    }
    xhr.send(dataResult)
  })
}
