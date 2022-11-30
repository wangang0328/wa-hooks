---
title: useUnmount
nav:
  path: /hooks
group:
  title: 生命周期
  order: 1
---

# useUnmount

组件销毁前调用

## 代码演示

### 基础用法

<code src="./demo/demo1.tsx"></code>

## API

```typescript
useUnmount(() => void): React.MutableRefObject<T>;
```

### 参数

| 参数 | 描述               | 类型         | 默认值 |
| ---- | ------------------ | ------------ | ------ |
| fn   | 销毁前要执行的函数 | `() => void` | -      |
