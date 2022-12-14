---
nav:
  title: hooks
group:
  title: 高级
---

# useMemoFn

我们在使用 hooks 时存在着**闭包陷阱**
如下代码

```jsx
function Chat() {
  const [text, setText] = useState('')

  const onClick = useCallback(() => {
    sendMessage(text)
  }, [])

  return <SendButton onClick={onClick} />
}
```

我们期望点击获取最新的 text， 但是回调函数被缓存，形成闭包， 导致每次获取的都是最初的值。

如果 onClick 函数不用 useCallback 包裹，或者依赖 text，如下代码

```jsx
function Chat() {
  const [text, setText] = useState('')

  const onClick = useCallback(() => {
    sendMessage(text)
  }, [text])
  // const onClick = () => sendMessage(text);
  return <SendButton onClick={onClick} />
}
```

那么每次 re-render 时，这个 onClick 函数都是不同的引用地址， 会导致一些不必要的 reRender。

`useMemoFn` 其实是缓存函数的 hook

- 组件多次 render 时保持引用一致
- 函数始终能够获取最新的 props 和 state

在 React18 中会使用 Concurrent 模式，组件 render 的次数和时机都是不确定的，可能会有潜在的风险

## 代码演示

### 基础用法

<code src="./demo1.tsx"> </code>

### API

`const fn = useMemoFn<T = (...args: any[]) => void>(fn: T)`

### 参数

| 参数 | 描述         | 类型                       | 默认值 |
| ---- | ------------ | -------------------------- | ------ |
| fn   | 要执行的函数 | `(...args: any[]) => void` | -      |
