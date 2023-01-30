---
nav:
  title: hooks
group:
  title: dom相关
  order: 98
---

# useDrag & useDrop

优雅的使用拖拽

## 代码演示

<code src="./demo1.tsx"></code>

拖拽排序
<code src="./demo2.tsx"></code>

### 基础用法

### API

```typescript
useDrag<T=any>(
  data: T,
  target: Element | ()=> Element | MutableRefObject<Element>,
  options?: DragOptions
)
```

```typescript
useDrop(
  target: Element | ()=> Element | MutableRefObject<Element>,
  options?: DopOptions
)
```

### 参数

#### useDrag

| 参数    | 描述                                      | 类型                                              | 默认值 |
| ------- | ----------------------------------------- | ------------------------------------------------- | ------ |
| data    | 拖拽的内容                                | `<T = any>`                                       | -      |
| target  | 拖拽的目标节点                            | `Element\|()=>Element\|MutableRefObject<Element>` | -      |
| options | 可选，配置项，具体配置项见下`DragOptions` | `DragOptions`                                     | -      |

#### useDrop

| 参数    | 描述                                 | 类型                                              | 默认值 |
| ------- | ------------------------------------ | ------------------------------------------------- | ------ |
| target  | 拖拽释放的目标节点                   | `Element\|()=>Element\|MutableRefObject<Element>` | -      |
| options | 配置项，具体配置项见下 `DropOptions` | `DropOptions`                                     | -      |

### DragOptions

| 参数        | 描述                                   | 类型                     | 默认值 |
| ----------- | -------------------------------------- | ------------------------ | ------ |
| onDragStart | 可选，开始拖动元素或被选择的文本时调用 | `(e: DragEvent) => void` | -      |
| onDragEnd   | 可选，拖拽操作结束时调用               | `(e: DragEvent) => void` | -      |

### DropOtions

| 参数        | 描述                                       | 类型                                             | 默认值 |
| ----------- | ------------------------------------------ | ------------------------------------------------ | ------ |
| onFiles     | 可选，拖拽/粘贴文件时回调                  | `(files: File[], event?: DragEvent) => void`     | -      |
| onUri       | 可选，拖拽/粘贴 Uri 时回调                 | `(uri: string, event?: DragEvent) => void`       | -      |
| onDom       | 可选，拖拽/粘贴 自定义节点 时回调          | `(dom: any, event?: DragEvent) => void`          | -      |
| onText      | 可选，拖拽/粘贴文字时回调                  | `(text: string, event?: ClipboardEvent) => void` | -      |
| onDragEnter | 可选，进入放置目标时回调                   | `(event?: DragEvent) => void`                    | -      |
| onDragOver  | 可选，经过放置目标时回调                   | `(event?: DragEvent) => void`                    | -      |
| onDragLeave | 可选，离开放置目标时回调                   | `(event?: DragEvent) => void`                    | -      |
| onDrop      | 可选，元素或者选中的问呗放置在目标时的回调 | `(event?: DragEvent) => void`                    | -      |
| onPaste     | 可选，粘贴内容时回调                       | `(event?: ClipboardEvent) => void`               | -      |
