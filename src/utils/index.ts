import { isString } from './validate'
/**
 * 获取从obj排除keys后对象
 * @param o
 * @param keys
 */
export const exclude = (o: Record<string, any>, keys: string | string[]) => {
  const target: typeof o = {}
  const excludeKeys = isString(keys) ? [keys] : keys
  for (const key in o) {
    if (!excludeKeys.includes(key)) {
      target[key] = o[key]
    }
  }
  return target
}
