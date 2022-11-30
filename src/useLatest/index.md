---
title: useLatest
nav:
  title: hooks
  path: /hooks
group:
  title: 高级
  order: 100
---

# useLatest

每次调用都是返回当前最新的 hook，避免闭包问题.
<code src="./demo/demo1.tsx"> </code>

## 代码演示

### 基础用法

<code src="./demo/demo2.tsx"></code>

## API

```typescript
const vRef = useLatest<T>(v: T): React.MutableRefObject<T>
```

### 参数

| 参数 | 描述     | 类型  | 默认值 |
| ---- | -------- | ----- | ------ |
| v    | 传入的值 | `any` | -      |
