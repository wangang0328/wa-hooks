---
nav:
  title: hooks
group:
  title: state
---

# useCookieState

将状态存储到`state`里，推荐一般的状态值不要放到 cookie 里，因为每次发送请求，请求头会自动携带 cookie，减少请求体积

## 代码演示

### 基础用法

#### 基本使用

<code src="./demo1.tsx"></code>

#### 使用 options 配置

<code src="./demo2.tsx"></code>

### API

```typescript
const [state, setState]: [state: T | undefined, setState: ((v: T, options?: Options) => void)] = useCookieState<T = any>(key: string, options?: Options)
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
| path         | cookie 可用路径                          | `string`                                                                      | `/`          |

备注： options 的参数和设置 cookie 的参数一致,参考[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
