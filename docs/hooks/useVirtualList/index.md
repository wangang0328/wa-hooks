---
nav:
  title: hooks
group:
  title: 高级
---

# useVirtualList

提供虚拟列表能力的 hook，解决海量数据情况下首屏渲染缓慢和滚动卡顿问题。
可以自动获取列表条目，TODO：支持下拉更新上拉加载（努力实现中）

## 代码演示

### 固定高度

<code src="./demo1.tsx"> </code>

### 回调函数设置高度

<code src="./demo2.tsx"> </code>

### 动态高度

<code src="./demo3.tsx"> </code>

### 基础用法

### API

```typescript
const [list, scrollTo] = useVirtualList<T=any>(
  dataSource: T,
  options: {
    containerTarget: Element | (() => Element) | MutableRefObject<Element>,
    wrapperTarget: Element | (() => Element) | MutableRefObject<Element>,
    overscan?: number
    itemHeight?: number | ((index, data: T) => number)
  }
  )
```

### 参数

| 参数       | 描述                                  | 类型        | 默认值 |
| ---------- | ------------------------------------- | ----------- | ------ |
| dataSource | 要渲染的列表数据源                    | `<T=any>[]` | -      |
| options    | 配置项，具体配置项参考下方的`Options` | `Options`   | -      |

### Options

| 参数            | 描述                                             | 类型                                              | 默认值 |
| --------------- | ------------------------------------------------ | ------------------------------------------------- | ------ |
| containerTarget | 外部容器，支持传入 Dom 或者 ref                  | `Element\|()=>Element\|MutableRefObject<Element>` | -      |
| wrapperTarget   | 内部容器，支持传入 Dom 或者 ref                  | `Element\|()=>Element\|MutableRefObject<Element>` | -      |
| overscan        | 可视区域上下渲染的数量                           | `number`                                          | 5      |
| itemHeight      | 可选，条目的高度，可以是静态的，也可以是动态高度 | `number \| (index: number, data: T) => number`    | -      |

### Result

| 参数     | 描述             | 类型                  | 默认值 |
| -------- | ---------------- | --------------------- | ------ |
| list     | 要遍历渲染的数据 | `<T=any>[]`           | -      |
| scrollTo | 滚动到第几个条目 | `(index = 0) => void` | -      |
