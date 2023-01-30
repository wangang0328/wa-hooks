---
nav:
  title: hooks
group:
  title: dom相关
  order: 99
---

# useEventListener

更优雅的处理 eventListener

## 代码演示

### 基础用法

<code src="./demo1.tsx"></code>

### API

```typescript
useEventListener(
  eventName: string,
  listener: (ev: Event) => void,
  options?: Options
): void
```

### 参数

| 参数      | 描述                         | 类型                 | 默认值 |
| --------- | ---------------------------- | -------------------- | ------ |
| eventName | 存储到`localStorage`的`key`  | `string`             | -      |
| listener  | 事件响应回调                 | `(ev: Event)=> void` | -      |
| options   | 配置项，具体配置项见下(可选) | `Options\|undefined` | -      |

### Options

| 参数    | 描述                                                               | 类型                                                                                                        | 默认值   |
| ------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | -------- |
| target  | 可选，事件目标元素                                                 | `() => Element` \|`React.MutableRefObject<Element>` \| `Element` \| `Window` \| `Document` \| `HTMLElement` | `window` |
| capture | 可选，事件捕获阶段触发                                             | `boolean`                                                                                                   | -        |
| once    | 可选，最多只调用一次                                               | `boolean`                                                                                                   | -        |
| passive | 可选，设置为 true 时，表示 listener 永远不会调用`preventDefault()` | `boolean`                                                                                                   | -        |

Options 的详情请参考[addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
