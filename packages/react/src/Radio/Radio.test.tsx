import {describe, it, expect, beforeEach, vi} from 'vitest'
import {Radio} from '..'
import {render, fireEvent} from '@testing-library/react'

describe('Radio', () => {
  const defaultProps = {
    name: 'mock',
    value: 'mock value',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Radio {...defaultProps} className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a valid radio input', () => {
    const {getByRole} = render(<Radio {...defaultProps} />)

    const radio = getByRole('radio')

    expect(radio).toBeDefined()
  })

  it('renders an unchecked radio by default', () => {
    const {getByRole} = render(<Radio {...defaultProps} />)

    const radio = getByRole('radio') as HTMLInputElement

    expect(radio.checked).toEqual(false)
  })

  it('accepts and applies value and name attributes', () => {
    const {getByRole} = render(<Radio {...defaultProps} />)

    const radio = getByRole('radio') as HTMLInputElement

    expect(radio).toHaveAttribute('name', defaultProps.name)
    expect(radio).toHaveAttribute('value', defaultProps.value)
  })

  it('renders an active radio when checked attribute is passed', () => {
    const handleChange = vi.fn()
    const {getByRole} = render(<Radio {...defaultProps} checked onChange={handleChange} />)

    const radio = getByRole('radio') as HTMLInputElement

    expect(radio.checked).toEqual(true)
  })

  it('accepts a change handler that can alter a single radio state', () => {
    const handleChange = vi.fn()
    const {getByRole} = render(<Radio {...defaultProps} onChange={handleChange} />)

    const radio = getByRole('radio') as HTMLInputElement

    expect(radio.checked).toEqual(false)

    fireEvent.click(radio)
    expect(handleChange).toHaveBeenCalled()
    expect(radio.checked).toEqual(true)
  })

  it('renders correct behavior for multiple radio buttons in a group', () => {
    const handleChange = vi.fn()
    const RadioGroup = () => (
      <form>
        <Radio {...defaultProps} value="radio-one" onChange={handleChange} />
        <Radio {...defaultProps} value="radio-two" onChange={handleChange} />
      </form>
    )
    const {getByDisplayValue} = render(<RadioGroup />)

    const radioOne = getByDisplayValue('radio-one') as HTMLInputElement
    const radioTwo = getByDisplayValue('radio-two') as HTMLInputElement

    expect(radioOne).not.toBeChecked()
    expect(radioTwo).not.toBeChecked()

    fireEvent.click(radioOne)

    expect(radioOne).toBeChecked()
    expect(radioTwo).not.toBeChecked()

    fireEvent.click(radioTwo)

    expect(radioOne).not.toBeChecked()
    expect(radioTwo).toBeChecked()
  })

  it('renders an inactive radio state correctly', () => {
    const handleChange = vi.fn()
    const {getByRole, rerender} = render(<Radio {...defaultProps} disabled onChange={handleChange} />)

    const radio = getByRole('radio') as HTMLInputElement

    expect(radio.disabled).toEqual(true)
    expect(radio).not.toBeChecked()

    fireEvent.change(radio)

    expect(radio.disabled).toEqual(true)
    expect(radio).not.toBeChecked()

    // remove disabled attribute and retest
    rerender(<Radio {...defaultProps} onChange={handleChange} />)
  })

  it('renders an uncontrolled component correctly', () => {
    const {getByRole} = render(<Radio {...defaultProps} defaultChecked />)

    const radio = getByRole('radio') as HTMLInputElement

    expect(radio.checked).toEqual(true)
  })

  it('renders an aria-checked attribute correctly', () => {
    const handleChange = vi.fn()
    const {getByRole, rerender} = render(<Radio {...defaultProps} checked={false} onChange={handleChange} />)

    const radio = getByRole('radio') as HTMLInputElement

    expect(radio).toHaveAttribute('aria-checked', 'false')

    rerender(<Radio {...defaultProps} checked={true} onChange={handleChange} />)

    expect(radio).toHaveAttribute('aria-checked', 'true')
  })
})
