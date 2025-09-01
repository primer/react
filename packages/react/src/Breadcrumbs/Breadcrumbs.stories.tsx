import type {Meta} from '@storybook/react-vite'
import React, {useState} from 'react'
import type {ComponentProps} from '../utils/types'
import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
} as Meta<ComponentProps<typeof Breadcrumbs>>

export const Default = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Team
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const DynamicChildren = () => {
  const [items, setItems] = useState([
    {id: 1, href: '#', name: 'Home'},
    {id: 2, href: '#', name: 'Docs'},
    {id: 3, href: '#', name: 'Components'},
  ])

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1
    const names = ['Advanced', 'Examples', 'Guides', 'API', 'Tutorials', 'Reference']
    const randomName = names[Math.floor(Math.random() * names.length)]
    setItems([...items, {id: newId, href: '#', name: `${randomName}-${newId}`}])
  }

  const removeItem = () => {
    if (items.length > 1) {
      setItems(items.slice(0, -1))
    }
  }

  const addMultipleItems = () => {
    const newItems = [
      {id: Date.now() + 1, href: '#', name: 'Category'},
      {id: Date.now() + 2, href: '#', name: 'Subcategory'},
      {id: Date.now() + 3, href: '#', name: 'Item'},
      {id: Date.now() + 4, href: '#', name: 'Details'},
      {id: Date.now() + 5, href: '#', name: 'Specifications'},
    ]
    setItems([...items, ...newItems])
  }

  const reset = () => {
    setItems([
      {id: 1, href: '#', name: 'Home'},
      {id: 2, href: '#', name: 'Docs'},
      {id: 3, href: '#', name: 'Components'},
    ])
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
        <button type="button" onClick={addItem} style={{padding: '4px 8px'}}>
          Add Item
        </button>
        <button type="button" onClick={removeItem} style={{padding: '4px 8px'}}>
          Remove Item
        </button>
        <button type="button" onClick={addMultipleItems} style={{padding: '4px 8px'}}>
          Add Many Items
        </button>
        <button type="button" onClick={reset} style={{padding: '4px 8px'}}>
          Reset
        </button>
      </div>

      <div>
        <h4 style={{margin: '0 0 8px 0'}}>Overflow: wrap (default)</h4>
        <Breadcrumbs overflow="wrap">
          {items.map((item, index) => (
            <Breadcrumbs.Item key={item.id} href={item.href} selected={index === items.length - 1}>
              {item.name}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
      </div>

      <div>
        <h4 style={{margin: '16px 0 8px 0'}}>Overflow: menu</h4>
        <Breadcrumbs overflow="menu">
          {items.map((item, index) => (
            <Breadcrumbs.Item key={item.id} href={item.href} selected={index === items.length - 1}>
              {item.name}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
      </div>

      <div>
        <h4 style={{margin: '16px 0 8px 0'}}>Overflow: menu</h4>
        <Breadcrumbs overflow="menu-with-root">
          {items.map((item, index) => (
            <Breadcrumbs.Item key={item.id} href={item.href} selected={index === items.length - 1}>
              {item.name}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
      </div>

      <div style={{marginTop: '16px', fontSize: '12px', color: '#666'}}>
        Current items: {items.length} | Try adding/removing items to see how overflow behavior changes
      </div>
    </div>
  )
}
