import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {ActionList} from '../../deprecated/ActionList'

describe('ActionList', () => {
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
