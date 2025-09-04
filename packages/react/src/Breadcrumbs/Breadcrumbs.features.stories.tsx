import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import {useState} from 'react'
import type {ComponentProps} from '../utils/types'
import Breadcrumbs from './Breadcrumbs'
import TextInput from '../TextInput'
import {FeatureFlags} from '../FeatureFlags'

export default {
  title: 'Components/Breadcrumbs/Features',
  component: Breadcrumbs,
} as Meta<ComponentProps<typeof Breadcrumbs>>

export const OverflowWrap = () => (
  <Breadcrumbs overflow="wrap">
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuFeatureFlagEnabled = () => (
  <FeatureFlags flags={{primer_react_breadcrumbs_overflow_menu: true}}>
    <Breadcrumbs overflow="menu">
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Current Page
      </Breadcrumbs.Item>
    </Breadcrumbs>
  </FeatureFlags>
)

export const OverflowMenuFeatureFlagDisabled = () => (
  <Breadcrumbs overflow="menu">
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuShowRootFeatureFlagDisabled = () => (
  <Breadcrumbs overflow="menu-with-root">
    <Breadcrumbs.Item href="#">github</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Teams</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Engineering</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">core-productivity</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">collaboration-workflows-flex</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      global-navigation-reviewers
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuShowRootFeatureFlagEnabled = () => (
  <FeatureFlags flags={{primer_react_breadcrumbs_overflow_menu: true}}>
    <Breadcrumbs overflow="menu-with-root">
      <Breadcrumbs.Item href="#">github</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Teams</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Engineering</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">core-productivity</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">collaboration-workflows-flex</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        global-navigation-reviewers
      </Breadcrumbs.Item>
    </Breadcrumbs>
  </FeatureFlags>
)

export const WithEditableNameInput = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Documents</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Project Alpha</Breadcrumbs.Item>
    <Breadcrumbs.Item>
      <TextInput
        defaultValue="Untitled Document"
        size="small"
        sx={{
          minWidth: '120px',
          maxWidth: '180px',
          fontSize: 'inherit',
          border: '1px dashed var(--borderColor-muted)',
          '&:focus': {
            border: '1px solid var(--borderColor-accent-emphasis)',
          },
        }}
        aria-label="Edit document name"
      />
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
        <h4 id="dynamic-breadcrumbs-heading" style={{margin: '0 0 8px 0'}}>
          Dynamic breadcrumbs
        </h4>
        <Breadcrumbs overflow="menu-with-root">
          {items.map((item, index) => (
            <Breadcrumbs.Item key={item.id} href={item.href} selected={index === items.length - 1}>
              {item.name}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
      </div>

      <div style={{marginTop: '16px', fontSize: '12px'}}>
        Current items: {items.length} | Try adding/removing items to see how overflow behavior changes
      </div>
    </div>
  )
}

export const SpaciousVariantWithOverflowMenu = () => (
  <FeatureFlags flags={{primer_react_breadcrumbs_overflow_menu: true}}>
    <Breadcrumbs overflow="menu" variant="spacious">
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Current Page
      </Breadcrumbs.Item>
    </Breadcrumbs>
  </FeatureFlags>
)

export const SpaciousVariantWithOverflowWrap = () => (
  <Breadcrumbs variant="spacious">
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
