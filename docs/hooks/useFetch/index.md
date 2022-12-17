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
