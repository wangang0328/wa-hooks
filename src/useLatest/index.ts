import { useRef } from 'react'

const useLatest = <T = any>(v: T) => {
  const vRef = useRef<T>(v)
  vRef.current = v
  return vRef
}

export default useLatest
