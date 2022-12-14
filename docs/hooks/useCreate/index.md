---
nav:
  title: hooks
group:
  title: 高级
---

# useCreate

用于创建一些实例，依赖不改变 reRender 时不会重复创建

## 代码演示

### 基础用法

<code src="./demo1.tsx"></code>

### API

`const instance = useCreate<T>(factory: () => T, deeps?: readonly unknown[]): T`

### 参数

| 参数 | 描述     | 类型                                                                         | 默认值      |
| ---- | -------- | ---------------------------------------------------------------------------- | ----------- |
| v    | 传入的值 | `any`                                                                        | -           |
| deps | 依赖     | `readonly unknown[]` or `undefined` 如果不传依赖项，每次 render 都会执行回调 | `undefined` |
