import React from 'react'
import Textarea from '../Textarea'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi, beforeEach} from 'vitest'
import classes from './TextArea.module.css'
import {implementsClassName} from '../utils/testing'
import textInputClasses from '../internal/components/TextInputWrapper.module.css'

function getCSSRules(selector: string): Array<CSSStyleRule> {
  return Array.from(document.styleSheets).flatMap(sheet => {
    return Array.from(sheet.cssRules).filter((rule): rule is CSSStyleRule => {
      if (rule instanceof CSSStyleRule) {
        return rule.selectorText === selector
      }
      return false
    })
  })
}

describe('Textarea', () => {
  implementsClassName(Textarea, textInputClasses.TextInputBaseWrapper)
  beforeEach(() => {
    vi.resetAllMocks()
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

  it('renders an optional block prop correctly', () => {
    const {container} = render(<Textarea block />)
    const style = window.getComputedStyle(container.firstElementChild!)
    expect(style.display).toBe('flex')

    const rules = getCSSRules(`.${classes.TextArea}`)
    const has100PercentWidth = rules.some(rule => {
      return rule.style.width && rule.style.width === '100%'
    })
    expect(has100PercentWidth).toBe(true)
  })

  it('renders default resize values correctly', () => {
    render(<Textarea />)
    const textareaElement = screen.getByRole('textbox')

    expect(textareaElement).toBeInTheDocument()
    const rules = getCSSRules(`.${classes.TextArea}`)
    const hasResizeDeclaration = rules.some(rule => {
      return rule.style.resize && rule.style.resize === 'both'
    })
    expect(hasResizeDeclaration).toBe(true)
  })

  it('renders none resize values correctly', () => {
    render(<Textarea resize="none" />)
    const textareaElement = screen.getByRole('textbox')

    expect(textareaElement).toBeInTheDocument()
    const rules = getCSSRules(`.${classes.TextArea}[data-resize="none"]`)
    const hasResizeDeclaration = rules.some(rule => {
      return rule.style.resize && rule.style.resize === 'none'
    })
    expect(hasResizeDeclaration).toBe(true)
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

  it('renders textarea with minHeight and maxHeight styles', () => {
    const minHeight = 100
    const maxHeight = 200
    render(<Textarea minHeight={minHeight} maxHeight={maxHeight} />)

    const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement
    const style = window.getComputedStyle(textareaElement)

    expect(style.minHeight).toBe(`${minHeight}px`)
    expect(style.maxHeight).toBe(`${maxHeight}px`)
  })
})
