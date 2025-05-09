import React from 'react'
import {Textarea} from '..'
import {DEFAULT_TEXTAREA_ROWS, DEFAULT_TEXTAREA_COLS, DEFAULT_TEXTAREA_RESIZE} from '../Textarea'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, beforeEach, vi} from 'vitest'

describe('Textarea', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should support `className` on the outermost element', () => {
    expect(render(<Textarea className={'test-class-name'} />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a valid textarea input', () => {
    const {getByRole} = render(<Textarea />)

    const textarea = getByRole('textbox')

    expect(textarea).toBeDefined()
  })

  it('renders an empty textarea by default', () => {
    const {getByRole} = render(<Textarea />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement.value).toEqual('')
  })

  it('renders an uncontrolled component correctly', () => {
    const sideEffectValue = 'mock value 2'

    const MockComponent = () => {
      const ref = React.useRef<HTMLTextAreaElement>(null)

      React.useEffect(() => {
        if (ref.current) {
          ref.current.value = sideEffectValue
        }
      }, [ref])

      return <Textarea ref={ref} />
    }

    const {getByRole} = render(<MockComponent />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement.value).toBe(sideEffectValue)
  })

  it.skip('renders an optional block prop correctly', () => {
    // Skipping style tests as mentioned in original file
  })

  // Skip until we have a better way to test styles
  it.skip('renders default resize values correctly', () => {
    // Skipping style tests as mentioned in original file
  })

  // Skip until we have a better way to test styles
  it.skip('renders none resize values correctly', () => {
    // Skipping style tests as mentioned in original file
  })

  it('renders a value in the textarea', () => {
    const mockValue = 'mock value'
    const onChange = vi.fn()
    const {getByRole} = render(<Textarea onChange={onChange} value={mockValue} />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement.value).toEqual(mockValue)
  })

  it('can render an inactive textarea', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const {getByRole, rerender} = render(<Textarea disabled onChange={handleChange} />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement
    expect(textareaElement.disabled).toEqual(true)
    expect(textareaElement).toHaveAttribute('disabled')

    await user.click(textareaElement)

    expect(handleChange).not.toHaveBeenCalled()

    // remove disabled attribute and retest
    rerender(<Textarea onChange={handleChange} />)

    expect(textareaElement.disabled).toEqual(false)
    expect(textareaElement).not.toHaveAttribute('disabled')
  })

  it('renders an aria-required attribute correctly', () => {
    const {getByRole} = render(<Textarea required />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement).toHaveAttribute('aria-required', 'true')
  })

  it('renders an invalid aria state when validation prop indicates an error', () => {
    const {getByRole, rerender} = render(<Textarea />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement).toHaveAttribute('aria-invalid', 'false')

    rerender(<Textarea validationStatus="success" />)

    expect(textareaElement).toHaveAttribute('aria-invalid', 'false')

    rerender(<Textarea validationStatus="error" />)

    expect(textareaElement).toHaveAttribute('aria-invalid', 'true')
  })
})
