import { documentIsVisible, isBrowser } from './validate'

type Listener = () => void

const listenerList: Listener[] = []

const subscribe = (listener: Listener) => {
  listenerList.push(listener)
  return () => {
    const index = listenerList.findIndex((item) => item === listener)
    listenerList.splice(index, 1)
  }
}

if (isBrowser) {
  document.addEventListener('visibilitychange', () => {
    if (!documentIsVisible()) {
      return
    }
    listenerList.forEach((listener) => listener?.())
  })
}

export default subscribe
