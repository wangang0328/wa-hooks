---
nav:
  title: hooks
group:
  title: state
---

# useLocalStorage

将状态存储在`localSotrage`里，默认时长永久

## 代码演示

### 基础用法

#### 将 state 存储到 localSotrage

你可以下刷新下页面，数据会持久化保存
<code src="./demo1.tsx"></code>

#### 设置有效时长

有效时长 1000ms， 不再输入的 3s 后刷新页面值会被清空
<code src="./demo2.tsx"></code>

### API

```typescript
const [state, setState]: [state: T | undefined, setState: ((v: T, options?: Options) => void)] = useLocalStorage<T = any>(key: string, options?: Options)
```

### 参数

| 参数    | 描述                        | 类型                 | 默认值      |
| ------- | --------------------------- | -------------------- | ----------- |
| key     | 存储到`localStorage`的`key` | `string`             | -           |
| options | 配置项，具体配置项见下      | `Options\|undefined` | `undefined` |

#### Options

| 参数         | 描述                                     | 类型                                                                          | 默认值       |
| ------------ | ---------------------------------------- | ----------------------------------------------------------------------------- | ------------ |
| defaultValue | 如果没有获取到值或已过期，要显示的默认值 | `T`                                                                           | -            |
| expires      | 有效时长                                 | `number`                                                                      | `undefined`  |
| expiresUnit  | 有效时长的单位                           | `day\|Day\|hour\|Hour\|minute\|Minute\|second\|Second\millsecond\|Millsecond` | `millsecond` |
