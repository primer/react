import {describe, it, expect, beforeEach, vi} from 'vitest'
import Radio from '.'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {implementsClassName} from '../utils/testing'
import classes from './Radio.module.css'

describe('Radio', () => {
  implementsClassName(props => <Radio name="mock" {...props} />, classes.Radio)
  const defaultProps = {
    name: 'mock',
    value: 'mock value',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders a valid radio input', async () => {
    render(<Radio {...defaultProps} />)

    const radio = page.getByRole('radio')

    await expect.element(radio).toBeInTheDocument()
  })

  it('renders data-component attribute', async () => {
    render(<Radio {...defaultProps} />)

    await expect.element(page.getByRole('radio')).toHaveAttribute('data-component', 'Radio')
  })

  it('renders an unchecked radio by default', async () => {
    render(<Radio {...defaultProps} />)

    const radio = page.getByRole('radio')

    await expect.element(radio).not.toBeChecked()
  })

  it('accepts and applies value and name attributes', async () => {
    render(<Radio {...defaultProps} />)

    const radio = page.getByRole('radio')

    await expect.element(radio).toHaveAttribute('name', defaultProps.name)
    await expect.element(radio).toHaveAttribute('value', defaultProps.value)
  })

  it('renders an active radio when checked attribute is passed', async () => {
    const handleChange = vi.fn()
    render(<Radio {...defaultProps} checked onChange={handleChange} />)

    const radio = page.getByRole('radio')

    await expect.element(radio).toBeChecked()
  })

  it('accepts a change handler that can alter a single radio state', async () => {
    const handleChange = vi.fn()
    render(<Radio {...defaultProps} onChange={handleChange} />)

    const radio = page.getByRole('radio')

    await expect.element(radio).not.toBeChecked()

    await userEvent.click(radio)
    expect(handleChange).toHaveBeenCalled()
    await expect.element(radio).toBeChecked()
  })

  it('renders correct behavior for multiple radio buttons in a group', async () => {
    const handleChange = vi.fn()
    const RadioGroup = () => (
      <form>
        <Radio {...defaultProps} value="radio-one" aria-label="Radio one" onChange={handleChange} />
        <Radio {...defaultProps} value="radio-two" aria-label="Radio two" onChange={handleChange} />
      </form>
    )
    render(<RadioGroup />)

    const radioOne = page.getByRole('radio', {name: 'Radio one'})
    const radioTwo = page.getByRole('radio', {name: 'Radio two'})

    await expect.element(radioOne).not.toBeChecked()
    await expect.element(radioTwo).not.toBeChecked()

    await userEvent.click(radioOne)

    await expect.element(radioOne).toBeChecked()
    await expect.element(radioTwo).not.toBeChecked()

    await userEvent.click(radioTwo)

    await expect.element(radioOne).not.toBeChecked()
    await expect.element(radioTwo).toBeChecked()
  })

  it('renders an inactive radio state correctly', async () => {
    const handleChange = vi.fn()
    const {rerender} = render(<Radio {...defaultProps} disabled onChange={handleChange} />)

    const radio = page.getByRole('radio')

    await expect.element(radio).toBeDisabled()
    await expect.element(radio).not.toBeChecked()

    await userEvent.click(radio, {force: true})

    await expect.element(radio).toBeDisabled()
    await expect.element(radio).not.toBeChecked()

    // remove disabled attribute and retest
    rerender(<Radio {...defaultProps} onChange={handleChange} />)
  })

  it('renders an uncontrolled component correctly', async () => {
    render(<Radio {...defaultProps} defaultChecked />)

    const radio = page.getByRole('radio')

    await expect.element(radio).toBeChecked()
  })

  it('renders an aria-checked attribute correctly', async () => {
    const handleChange = vi.fn()
    const {rerender} = render(<Radio {...defaultProps} checked={false} onChange={handleChange} />)

    const radio = page.getByRole('radio')

    await expect.element(radio).toHaveAttribute('aria-checked', 'false')

    rerender(<Radio {...defaultProps} checked={true} onChange={handleChange} />)

    await expect.element(radio).toHaveAttribute('aria-checked', 'true')
  })
})
