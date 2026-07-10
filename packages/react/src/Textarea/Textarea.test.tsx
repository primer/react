import React from 'react'
import Textarea from '../Textarea'
import {render, screen, fireEvent, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import classes from './TextArea.module.css'
import {implementsClassName} from '../utils/testing'
import textInputClasses from '../internal/components/TextInputWrapper.module.css'
import {SCREEN_READER_DELAY} from '../utils/character-counter'
import {createRenderCounter} from '../utils/testing/profiler'
import type {LiveRegionElement} from '@primer/live-region-element'

function getPoliteAnnouncement(): string {
  const liveRegion = document.querySelector('live-region') as LiveRegionElement | null
  return liveRegion?.getMessage('polite') ?? ''
}

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

  it('renders data-component attribute', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toHaveAttribute('data-component', 'Textarea')
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

  describe('character counter', () => {
    afterEach(() => {
      // The announcement live region is shared and appended to the document, so
      // remove it between tests to avoid leaking messages across cases.
      document.querySelector('live-region')?.remove()
    })

    it('should render character counter when characterLimit is provided', () => {
      const {container} = render(<Textarea characterLimit={100} />)
      expect(container.textContent).toContain('100 characters remaining')
    })

    it('derives the counter and validation state from a controlled value', () => {
      const {rerender, container, getByRole} = render(
        <Textarea characterLimit={10} value="Hello" onChange={() => {}} />,
      )
      expect(container.textContent).toContain('5 characters remaining')
      expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'false')

      rerender(<Textarea characterLimit={10} value="Hello World!" onChange={() => {}} />)
      expect(container.textContent).toContain('2 characters over')
      expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('should update character count on input', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<Textarea characterLimit={100} />)
      const textarea = getByRole('textbox')

      await user.type(textarea, 'Hello World')
      expect(container.textContent).toContain('89 characters remaining')
    })

    it('should show singular "character" when one character remains', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<Textarea characterLimit={5} />)
      const textarea = getByRole('textbox')

      await user.type(textarea, 'Test')
      expect(container.textContent).toContain('1 character remaining')
    })

    it('should show error state when character limit is exceeded', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<Textarea characterLimit={10} />)
      const textarea = getByRole('textbox')

      await user.type(textarea, 'This is a very long text')
      expect(container.textContent).toContain('characters over')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })

    it('should show alert icon when character limit is exceeded', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<Textarea characterLimit={10} />)
      const textarea = getByRole('textbox')

      await user.type(textarea, 'This is too long')
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should clear error state when back under limit', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<Textarea characterLimit={10} />)
      const textarea = getByRole('textbox')

      await user.type(textarea, 'This is a very long text')
      expect(container.textContent).toContain('characters over')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')

      await user.clear(textarea)
      await user.type(textarea, 'Short text')

      expect(container.textContent).toContain('characters remaining')
      expect(textarea).toHaveAttribute('aria-invalid', 'false')
    })

    it('should have aria-describedby pointing to static message', () => {
      const {getByRole, container} = render(<Textarea characterLimit={100} />)
      const textarea = getByRole('textbox')
      const describedBy = textarea.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()

      const staticMessage = Array.from(container.querySelectorAll('[id]')).find(el =>
        el.textContent.includes('You can enter up to'),
      )
      expect(staticMessage).toBeTruthy()
      expect(describedBy).toContain(staticMessage?.id)
    })

    it('does not announce the counter on show', () => {
      render(<Textarea characterLimit={100} />)
      expect(getPoliteAnnouncement()).toBe('')
    })

    it('should have static screen reader message', () => {
      const {container} = render(<Textarea characterLimit={100} />)
      expect(container.textContent).toContain('You can enter up to 100 characters')
    })

    it('should show singular character in static message when limit is 1', () => {
      const {container} = render(<Textarea characterLimit={1} />)
      expect(container.textContent).toContain('You can enter up to 1 character')
    })

    it('should not announce on initial load', () => {
      render(<Textarea characterLimit={100} defaultValue="Hello World" />)
      expect(getPoliteAnnouncement()).toBe('')
    })

    it('announces the updated remaining count after a change', async () => {
      // The remaining-count message is derived in render and announced (debounced)
      // through the shared live region. Uses fireEvent + fake timers because
      // userEvent deadlocks with fake timers in the browser test environment and
      // the announcement is debounced (real timers would be slow and flaky).
      vi.useFakeTimers()
      try {
        const {getByRole} = render(<Textarea characterLimit={100} />)

        fireEvent.change(getByRole('textbox'), {target: {value: 'Hello'}})
        // Nothing is announced until the debounce delay elapses.
        expect(getPoliteAnnouncement()).toBe('')

        await act(async () => {
          // Let the MutationObserver schedule the debounced announcement, then
          // advance past the delay so the live region updates.
          await Promise.resolve()
          await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
        })

        expect(getPoliteAnnouncement()).toBe('95 characters remaining')
      } finally {
        vi.useRealTimers()
      }
    })

    it('derives the character counter without an extra commit on mount', async () => {
      // The counter/validation are derived during render. The previous effect-synced
      // implementation forced an extra commit after mount to populate the counter, so
      // assert mount produces no follow-up update renders.
      const [Wrap, counter] = createRenderCounter()
      render(
        <Wrap>
          <Textarea characterLimit={100} />
        </Wrap>,
      )
      await act(async () => {})

      expect(counter.updateCount).toBe(0)
    })

    it('commits once per controlled value change without cascading', async () => {
      const [Wrap, counter] = createRenderCounter()
      const {rerender} = render(
        <Wrap>
          <Textarea characterLimit={100} value="Hello" onChange={() => {}} />
        </Wrap>,
      )
      await act(async () => {})
      counter.reset()

      rerender(
        <Wrap>
          <Textarea characterLimit={100} value="Hello World" onChange={() => {}} />
        </Wrap>,
      )
      await act(async () => {})

      expect(counter.updateCount).toBe(1)
    })
  })
})
