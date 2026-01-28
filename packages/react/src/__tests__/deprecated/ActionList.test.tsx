import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {ActionList} from '../../deprecated/ActionList'
import {implementsClassName} from '../../utils/testing'
import classes from '../../deprecated/ActionList/List.module.css'
import itemClasses from '../../deprecated/ActionList/Item.module.css'

describe('ActionList', () => {
  implementsClassName(props => <ActionList {...props} items={[]} />, classes.List)
  implementsClassName(ActionList.Group)
  implementsClassName(ActionList.Item, itemClasses.Item)
  it('should render ActionList with items', () => {
    const {getByText} = render(<ActionList items={[{text: 'New file'}]} />)
    expect(getByText('New file')).toBeInTheDocument()
  })
})

describe('ActionList.Item', () => {
  it('should render ActionList.Item', () => {
    const {getByText} = render(<ActionList.Item>Test Item</ActionList.Item>)
    expect(getByText('Test Item')).toBeInTheDocument()
  })
})
