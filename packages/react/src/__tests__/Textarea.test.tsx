import React from 'react'
import {Textarea} from '..'
import {behavesAsComponent, checkExports, renderStyles} from '../utils/testing'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {DEFAULT_TEXTAREA_ROWS, DEFAULT_TEXTAREA_COLS, DEFAULT_TEXTAREA_RESIZE} from '../Textarea'

describe('Textarea', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  behavesAsComponent({
    Component: Textarea,
    options: {skipAs: true},
  })

  checkExports('Textarea', {
    default: Textarea,
    DEFAULT_TEXTAREA_ROWS,
    DEFAULT_TEXTAREA_COLS,
    DEFAULT_TEXTAREA_RESIZE,
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

  it('renders an optional block prop correctly', () => {
    const expectedStyles = {
      width: '100%',
      display: 'flex',
    }
    const defaultStyles = renderStyles(<Textarea block />)
    const blockStyles = renderStyles(<Textarea />)

    expect(defaultStyles).toEqual(expect.objectContaining(expectedStyles))
    expect(blockStyles).not.toEqual(expect.objectContaining(expectedStyles))
  })

  it('renders default resize values correctly', () => {
    const {getByRole} = render(<Textarea />)
    const textareaElement = getByRole('textbox')

    expect(textareaElement).toHaveStyle({
      resize: 'both',
    })
  })

  it('renders none resize values correctly', () => {
    const {getByRole} = render(<Textarea resize="none" />)
    const textareaElement = getByRole('textbox')

    expect(textareaElement).toHaveStyle({
      resize: 'none',
    })
  })

  it('renders a value in the textarea', () => {
    const mockValue = 'mock value'
    const onChange = jest.fn()
    const {getByRole} = render(<Textarea onChange={onChange} value={mockValue} />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement.value).toEqual(mockValue)
  })

  it('can render an inactive textarea', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
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
