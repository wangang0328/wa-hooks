---
nav:
  title: hooks
group:
  title: state
---

# usePropsValue

用来管理父组件传过来的`value`、`defaultValue`、`onChange`, 根据传入的值来判断是否受控组件、更优雅的进行值的管理

## 代码演示

### 基础用法

受控
<code src="./demo1.tsx"></code>

非受控
<code src="./demo2.tsx"></code>

### API

`usePropsValue<T>({ value?: T, defaultValue?: T, onChante?: (v: T) => void}): [v: T | undefined, setV: (v: SetStateAction<T | undefined>, forceTriggerOnChange: boolean) => void] `

### 参数

| 参数         | 描述                                                                                   | 类型                          | 默认值      |
| ------------ | -------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| value        | 要传递的 value 值                                                                      | `T` 默认`any`                 | `undefined` |
| defaultValue | 默认值，如果传了 value 参数，该参数无效， 如果不传 value，是非受控的，首次默认值为该值 | `T` 默认`any`                 | `undefined` |
| onChange     | 默认值，如果传了 value 参数，该参数无效， 如果不传 value，是非受控的，首次默认值为该值 | `(v: T \| undefined) => void` | `undefined` |
