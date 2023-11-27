import { useUpload } from '@wa-dev/hooks'
import React, { useRef } from 'react'

const App = () => {
  const ref = useRef(null)
  useUpload(ref)
  return <input type="file" ref={ref} />
}

export default App
