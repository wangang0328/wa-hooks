import React, { useRef } from 'react'

const list = [
  {
    key: '1',
    value: 'dom1',
  },
  {
    key: '2',
    value: 'dom2',
  },
  {
    key: '3',
    value: 'dom3',
  },
]

const DragItem = ({ item }: any) => (
  <div
    onDragStart={(e) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      // setData 的值 会被toString，所以要保存字符串类型
      e.dataTransfer.setData('custom', JSON.stringify(item))
      console.log('dragStart')
    }}
    onDragEnd={() => {
      console.log('dragEnd')
    }}
    style={{
      width: '200px',
      height: '30px',
      border: '1px solid #000',
      marginBottom: '10px',
    }}
    draggable
  >
    {item.value}
  </div>
)

export default () => {
  const listRef = useRef(null)
  return (
    <div
      ref={listRef}
      onDrop={(e) => {
        e.preventDefault()
        let target: any
        let custom = e.dataTransfer.getData('custom')
        try {
          target = JSON.parse(custom)
        } catch (error) {
          target = custom
        }
        console.log('释放了==', target)
      }}
      onDragEnter={(e) => {
        console.log('enter', e.target)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        console.log('drag over')
      }}
      onPaste={() => {
        console.log('past')
      }}
      onDragLeave={() => {
        console.log('dragLeave')
      }}
    >
      {list.map((item) => (
        <DragItem key={item.key} item={{ ...item }} />
      ))}
    </div>
  )
}
