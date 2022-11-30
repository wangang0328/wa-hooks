---
title: useMount
nav:
  title: hooks
  path: /hooks
group:
  title: 生命周期
  order: 1
---

# useMount

在组件初始化的时候执行，只执行一次（直到组件销毁）

## 代码演示

### 基础用法

<code src="./demo/demo1.tsx"></code>

## API

```typescript
useMount(fn: () => void);
```

### 参数

| 参数 | 描述         | 类型         | 默认值 |
| ---- | ------------ | ------------ | ------ |
| fn   | 要执行的函数 | `() => void` | -      |
