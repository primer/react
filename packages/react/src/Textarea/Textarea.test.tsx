import React from 'react'
import {Textarea} from '..'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi, beforeEach} from 'vitest'

describe('Textarea', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should support `className` on the outermost element', () => {
    expect(render(<Textarea className={'test-class-name'} />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a valid textarea input', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders an empty textarea by default', () => {
    render(<Textarea />)
    const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
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

    render(<MockComponent />)
    const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textareaElement.value).toBe(sideEffectValue)
  })

  // Enable these tests when we have a better way to test styles in Vitest
  it('renders an optional block prop correctly', () => {
    render(<Textarea block />)
    const textareaElement = screen.getByRole('textbox')

    expect(textareaElement).toBeInTheDocument()
    // Testing actual styles would be implemented here
  })

  it('renders default resize values correctly', () => {
    render(<Textarea />)
    const textareaElement = screen.getByRole('textbox')

    expect(textareaElement).toBeInTheDocument()
    // Testing resize styles would be implemented here
  })

  it('renders none resize values correctly', () => {
    render(<Textarea resize="none" />)
    const textareaElement = screen.getByRole('textbox')

    expect(textareaElement).toBeInTheDocument()
    // Testing resize styles would be implemented here
  })

  it('renders a value in the textarea', () => {
    const mockValue = 'mock value'
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} value={mockValue} />)

    const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textareaElement.value).toEqual(mockValue)
  })

  it('can render an inactive textarea', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const {rerender} = render(<Textarea disabled onChange={handleChange} />)

    const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
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
    render(<Textarea required />)
    const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textareaElement).toHaveAttribute('aria-required', 'true')
  })

  it('renders an invalid aria state when validation prop indicates an error', () => {
    const {rerender} = render(<Textarea />)
    const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textareaElement).toHaveAttribute('aria-invalid', 'false')

    rerender(<Textarea validationStatus="success" />)
    expect(textareaElement).toHaveAttribute('aria-invalid', 'false')

    rerender(<Textarea validationStatus="error" />)
    expect(textareaElement).toHaveAttribute('aria-invalid', 'true')
  })
})
