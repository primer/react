import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {ActionList} from '../../deprecated/ActionList'
import {implementsClassName} from '../../utils/testing'
import classes from '../../deprecated/ActionList/List.module.css'
import itemClasses from '../../deprecated/ActionList/Item.module.css'

describe('ActionList', () => {
  it('renders with the custom className', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const {container} = render(<ActionList className="test-class" items={[]} />)

    expect(container.firstElementChild).toHaveClass(classes.List)
    expect(container.firstElementChild).toHaveClass('test-class')
    const messages = consoleError.mock.calls.map(args => args.map(String).join(' '))
    expect(messages).toHaveLength(1)
    expect(messages[0]).toContain('React does not recognize')
    expect(messages[0]).toContain('groupId')
    consoleError.mockRestore()
  })
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
