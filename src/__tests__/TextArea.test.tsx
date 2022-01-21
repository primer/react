import React from 'react'
import {TextArea} from '..'
import {behavesAsComponent, checkExports, renderStyles} from '../utils/testing'
import {render, cleanup} from '@testing-library/react'
import {toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

expect.extend(toHaveNoViolations)

describe('TextArea', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    cleanup()
  })
  behavesAsComponent({Component: TextArea})

  checkExports('TextArea', {
    default: TextArea
  })

  it('renders a valid textarea input', () => {
    const {getByRole} = render(<TextArea />)

    const textarea = getByRole('textbox')

    expect(textarea).toBeDefined()
  })

  it('renders an empty textarea by default', () => {
    const {getByRole} = render(<TextArea />)

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

      return <TextArea ref={ref} />
    }

    const {getByRole} = render(<MockComponent />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement.value).toBe(sideEffectValue)
  })

  it('renders an optional block prop correctly', () => {
    const expectedStyles = {
      width: '100%',
      display: 'flex'
    }
    const defaultStyles = renderStyles(<TextArea block />)
    const blockStyles = renderStyles(<TextArea />)

    expect(defaultStyles).toEqual(expect.objectContaining(expectedStyles))
    expect(blockStyles).not.toEqual(expect.objectContaining(expectedStyles))
  })

  it('renders default resize values correctly', () => {
    const defaultStyles = renderStyles(<TextArea />)

    expect(defaultStyles).toEqual(
      expect.objectContaining({
        resize: 'both'
      })
    )
  })

  it('renders none resize values correctly', () => {
    const defaultStyles = renderStyles(<TextArea resize="none" />)

    expect(defaultStyles).toEqual(
      expect.objectContaining({
        resize: 'none'
      })
    )
  })

  it('renders a value in the textarea', () => {
    const mockValue = 'mock value'
    const {getByRole} = render(<TextArea>{mockValue}</TextArea>)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement.value).toEqual(mockValue)
  })

  it('can render an inactive textarea', () => {
    const handleChange = jest.fn()
    const {getByRole, rerender} = render(<TextArea disabled onChange={handleChange} />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement
    expect(textareaElement.disabled).toEqual(true)
    expect(textareaElement).toHaveAttribute('disabled')

    userEvent.click(textareaElement)

    expect(handleChange).not.toHaveBeenCalled()

    // remove disabled attribute and retest
    rerender(<TextArea onChange={handleChange} />)

    expect(textareaElement.disabled).toEqual(false)
    expect(textareaElement).not.toHaveAttribute('disabled')
  })

  it('renders an aria-required attribute correctly', () => {
    const {getByRole} = render(<TextArea required />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement).toHaveAttribute('aria-required', 'true')
  })

  it('renders an invalid aria state when validation prop indicates an error', () => {
    const {getByRole, rerender} = render(<TextArea />)

    const textareaElement = getByRole('textbox') as HTMLTextAreaElement

    expect(textareaElement).toHaveAttribute('aria-invalid', 'false')

    rerender(<TextArea validationStatus="success" />)

    expect(textareaElement).toHaveAttribute('aria-invalid', 'false')

    rerender(<TextArea validationStatus="error" />)

    expect(textareaElement).toHaveAttribute('aria-invalid', 'true')
  })
})
