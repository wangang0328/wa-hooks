---
title: 简介
nav:
  title: hooks
group:
  title: useFetch
  order: 0
---

# useFetch

该 hook 借鉴了`ahooks`的`useRequest`, 采用了微内核的架构，便于后期的维护和功能扩展。
用于 http 请求。
支持的功能有:

- 自动/手动请求，多次同一个请求会展示最后一次请求
- 取消请求
- 防抖 (暂未实现)
- 节流 (暂未实现)

## 基础用法

### 自动请求

```javascript
const { loading, error, data } = useFetch(fetchLoginInfo)
```

获取登录信息
<code src="./demo1.tsx"> </code>

### 手动请求

<code src="./demo2.tsx"> </code>

### 防抖-debounce

<code src="./demo3.tsx"> </code>

### 轮询

<code src="./demo4.tsx"> </code>

### API

```typescript
const result: Result<TData, TParams extends any[]> = useFetch<TData = any, TParams extends any[] = [], TOriginData = any>(
  service:  Service<TData, TParams>,
  options?: | Options<TData, TParams>
    | OptionsWithFormat<TData, TParams, TOriginData>,
  plugins: PluginFn<TData, TParams>[] = []
)
```

**备注**：`Result` `Service` `Options` `OptionsWithFormat` `PluginFn`说明见下
泛型说明：

- `<TData>`: 接口返回的数据类型
- `<TParams>`: 请求参数类型
- `<TOriginParams>`: 接口返回的源数据类型，用于格式化 formatData 的函数使用，`<TData>` 也可以任务格式化后的数据 ， 如果定义了该泛型，需要传`formatData`项

### 参数

| 参数    | 描述                   | 类型                                | 默认值 |
| ------- | ---------------------- | ----------------------------------- | ------ |
| service | 请求函数               | `(...p: TParams) => Promise<TData>` | -      |
| options | 非必填，配置项         | `any`                               | -      |
| plugins | 非必填，用户自定的插件 | `any`                               | -      |

### Options

| 参数              | 描述                                                                                     | 类型                                          | 默认值  |
| ----------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------- | ------- |
| manual            | 非必填，是否手动请求，如果是，mount 时不会自动请求                                       | `boolean`                                     | -       |
| defaultParams     | 非必填，默认请求参数                                                                     | 泛型`<TParams=any[]>`                         | -       |
| defaultData       | 非必填，默认返回值                                                                       | 泛型`<TData=any>`                             | -       |
| debounceDelay     | 非必填，防抖延时的时长，单位时 ms， 设置该项时，会开启防抖，否则不开启                   | 泛型`number`                                  | -       |
| debounceImmediate | 非必填，防抖,是否首次立即执行                                                            | `boolean`                                     | `true`  |
| retryCount        | 非必填，错误重试的次数                                                                   | `number`                                      | -       |
| retryDelay        | 非必填，请求错误时，多久再发起请求, 默认使用简易的指数退避算法： 1000 \* 2 \* retryCount | `boolean`                                     | `true`  |
| pollingInterval   | 非必填，轮询间隔时长,单位 ms                                                             | `number`                                      | -       |
| pollingRetryCount | 非必填，发生错误时， 轮询重试次数                                                        | `number`                                      | `0`     |
| pollingWhenHidden | 非必填，隐藏时，是否轮询                                                                 | `boolean`                                     | `false` |
| errSetData        | 非必填，请求失败时，设置的 data                                                          | `<TData=any>`                                 | -       |
| onBefore          | 非必填，请求之前的钩子函数                                                               | `(params?: TParams) => void`                  | -       |
| onError           | 非必填，错误时触发的钩子                                                                 | `(e: Error, p?: TParams) => void`             | -       |
| onSuccess         | 非必填，成功时触发的钩子                                                                 | `(d: TData, p?: TParams) => void`             | -       |
| onFinally         | 非必填，请求完成时触发的钩子，成功或者失败都会触发                                       | `(p?: TParams, d?: TData, e?: Error) => void` | -       |

### OptionsWithFormat

继承自 Options

| 参数       | 描述             | 类型                                    | 默认值 |
| ---------- | ---------------- | --------------------------------------- | ------ |
| FormatData | 格式化 data 用的 | `formatData: (d: TOriginData) => TData` | -      |

### Result

| 参数    | 描述                                               | 类型                           | 默认值 |
| ------- | -------------------------------------------------- | ------------------------------ | ------ |
| loading | 正在加载中                                         | `boolean`                      | -      |
| error   | 请求失败                                           | ``                             | -      |
| data    | 请求成功时，返回的数据                             | `TData`                        | -      |
| params  | 请求的参数                                         | `TParams`                      | -      |
| reFetch | 调用，重新发起请求                                 | `() => void`                   | -      |
| run     | 手动调用                                           | `(...params: TParams) => void` | -      |
| cancel  | 取消调用，并没有取消该次请求，只是不返回本次的数据 | `() => void`                   | -      |

### PluginFn

### PluginReturn
