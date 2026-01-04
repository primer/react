import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {Combobox} from '../Combobox'

describe('Combobox', () => {
  it('should support `className` on the root element', () => {
    const Element = () => <Combobox className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders with label', () => {
    const {getByText} = render(<Combobox label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })

  it('renders Combobox.Input with correct role', () => {
    const {container} = render(<Combobox.Input />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('role', 'combobox')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
  })

  it('renders Combobox.List with correct role', () => {
    const {container} = render(
      <Combobox.List>
        <Combobox.Option>Option 1</Combobox.Option>
      </Combobox.List>,
    )
    const list = container.querySelector('ul')
    expect(list).toHaveAttribute('role', 'listbox')
  })

  it('renders Combobox.Option with correct role', () => {
    const {getByRole} = render(<Combobox.Option>Test Option</Combobox.Option>)
    expect(getByRole('option')).toBeInTheDocument()
    expect(getByRole('option')).toHaveTextContent('Test Option')
  })

  it('renders selected option with aria-selected', () => {
    const {getByRole} = render(<Combobox.Option selected>Selected Option</Combobox.Option>)
    expect(getByRole('option')).toHaveAttribute('aria-selected', 'true')
  })

  it('renders complete combobox structure', () => {
    const {container, getByPlaceholderText} = render(
      <Combobox label="Test">
        <Combobox.Input placeholder="Search..." />
        <Combobox.List>
          <Combobox.Option>Option 1</Combobox.Option>
          <Combobox.Option>Option 2</Combobox.Option>
        </Combobox.List>
      </Combobox>,
    )
    expect(getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(2)
  })

  it('renders grouped options', () => {
    const {getByText} = render(
      <Combobox.List>
        <Combobox.Group groupLabel="Group 1">
          <Combobox.Option>Option 1</Combobox.Option>
        </Combobox.Group>
      </Combobox.List>,
    )
    expect(getByText('Group 1')).toBeInTheDocument()
  })
})
