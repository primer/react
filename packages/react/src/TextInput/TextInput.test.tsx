import {SearchIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {render, fireEvent, screen, act} from '@testing-library/react'
import {describe, it, expect, vi, afterEach} from 'vitest'
import React, {createRef} from 'react'
import TextInput from '../TextInput'
import {FeatureFlags} from '../FeatureFlags'
import {implementsClassName} from '../utils/testing'
import {SCREEN_READER_DELAY} from '../utils/character-counter'
import {createRenderCounter} from '../utils/testing/profiler'
import type {LiveRegionElement} from '@primer/live-region-element'

function getPoliteAnnouncement(): string {
  const liveRegion = document.querySelector('live-region') as LiveRegionElement | null
  return liveRegion?.getMessage('polite') ?? ''
}

describe('TextInput', () => {
  implementsClassName(TextInput, 'TextInput-wrapper')

  it('renders', () => {
    render(<TextInput name="zipcode" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'zipcode')
  })

  it('renders small', () => {
    const {container} = render(<TextInput name="zipcode" size="small" />)
    expect(container.firstElementChild).toHaveAttribute('data-size', 'small')
  })

  it('renders large', () => {
    const {container} = render(<TextInput name="zipcode" size="large" />)
    expect(container.firstElementChild).toHaveAttribute('data-size', 'large')
  })

  it('renders block', () => {
    const {container} = render(<TextInput name="zipcode" block />)
    expect(container.firstElementChild).toHaveAttribute('data-block')
  })

  it('renders error', () => {
    expect(render(<TextInput name="zipcode" validationStatus="error" value="" />).container).toMatchSnapshot()
  })

  it('renders sets aria-invalid="true" on error', () => {
    render(<TextInput name="zipcode" validationStatus="error" data-testid="zipcodeInput" />)
    expect(screen.getByTestId('zipcodeInput')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders contrast', () => {
    expect(render(<TextInput name="zipcode" contrast value="" />).container).toMatchSnapshot()
  })

  it('renders monospace', () => {
    expect(render(<TextInput name="zipcode" monospace value="" />).container).toMatchSnapshot()
  })

  it('renders placeholder', () => {
    expect(render(<TextInput name="zipcode" placeholder={'560076'} value="" />).container).toMatchSnapshot()
  })

  it('renders leadingVisual', () => {
    function FunctionComponent() {
      return <SearchIcon data-testid="function-component" />
    }

    render(
      <>
        <TextInput name="search" placeholder="Search" leadingVisual={FunctionComponent} />
        <TextInput name="search" placeholder="Search" leadingVisual={<SearchIcon data-testid="jsx-element" />} />
        <TextInput
          name="search"
          placeholder="Search"
          leadingVisual={React.memo(() => (
            <div data-testid="memo">Trailing</div>
          ))}
        />
        <TextInput
          name="search"
          placeholder="Search"
          leadingVisual={React.forwardRef(() => (
            <div data-testid="forward-ref">Trailing</div>
          ))}
        />
      </>,
    )

    expect(screen.getByTestId('function-component')).toBeInTheDocument()
    expect(screen.getByTestId('jsx-element')).toBeInTheDocument()
    expect(screen.getByTestId('memo')).toBeInTheDocument()
    expect(screen.getByTestId('forward-ref')).toBeInTheDocument()
  })

  it('renders trailingVisual', () => {
    function FunctionComponent() {
      return <SearchIcon data-testid="function-component" />
    }

    render(
      <>
        <TextInput name="search" placeholder="Search" trailingVisual={FunctionComponent} />
        <TextInput name="search" placeholder="Search" trailingVisual={<SearchIcon data-testid="jsx-element" />} />
        <TextInput
          name="search"
          placeholder="Search"
          trailingVisual={React.memo(() => (
            <div data-testid="memo">Trailing</div>
          ))}
        />
        <TextInput
          name="search"
          placeholder="Search"
          trailingVisual={React.forwardRef(() => (
            <div data-testid="forward-ref">Trailing</div>
          ))}
        />
      </>,
    )

    expect(screen.getByTestId('function-component')).toBeInTheDocument()
    expect(screen.getByTestId('jsx-element')).toBeInTheDocument()
    expect(screen.getByTestId('memo')).toBeInTheDocument()
    expect(screen.getByTestId('forward-ref')).toBeInTheDocument()
  })

  it('renders trailingAction text button', () => {
    const handleAction = vi.fn()
    render(
      <TextInput
        name="search"
        placeholder={'Search'}
        trailingAction={<TextInput.Action onClick={handleAction}>Clear</TextInput.Action>}
      />,
    )
    expect(screen.getByRole('button', {name: 'Clear'})).toBeInTheDocument()
  })

  it('renders trailingAction text button with a tooltip', () => {
    const handleAction = vi.fn()
    render(
      <TextInput
        name="search"
        placeholder="Search"
        trailingAction={
          <TextInput.Action onClick={handleAction} aria-label="Clear input">
            Clear
          </TextInput.Action>
        }
      />,
    )

    expect(screen.getByRole('button', {name: 'Clear'})).toBeInTheDocument()
  })

  it('renders trailingAction icon button', () => {
    const handleAction = vi.fn()
    render(
      <TextInput
        name="search"
        placeholder="Search"
        trailingAction={<TextInput.Action onClick={handleAction} icon={SearchIcon} aria-label="Icon label" />}
      />,
    )

    expect(screen.getByRole('button', {name: 'Icon label'})).toBeInTheDocument()
  })

  it('focuses the text input if you do not click the input element', () => {
    const {container, getByLabelText} = render(
      <>
        <label htmlFor="testInput">Search</label>
        <TextInput id="testInput" name="search" placeholder={'Search'} trailingVisual={SearchIcon} />
      </>,
    )

    const icon = container.querySelector('svg')!

    expect(getByLabelText('Search')).not.toEqual(document.activeElement)
    fireEvent.click(icon)
    expect(getByLabelText('Search')).toEqual(document.activeElement)
  })

  it('indicates a busy status to assistive technology', () => {
    const {container} = render(
      <>
        <label htmlFor="loadingInput">Search</label>
        <TextInput loading id="loadingInput" />
      </>,
    )

    expect(container.querySelector('span[aria-busy=true]')).not.toBeNull()
  })

  it('should call onChange prop with input value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const {getByRole} = render(<TextInput onChange={onChange} value="" />)

    await user.type(getByRole('textbox'), 'test')

    expect(onChange).toHaveBeenCalled()
  })

  it('should render a password input', () => {
    expect(render(<TextInput name="password" type="password" value="" />).container).toMatchSnapshot()
  })

  it('should not override prop aria-invalid', () => {
    const onChange = vi.fn()
    const {getByRole} = render(<TextInput onChange={onChange} aria-invalid="true" value="" />)
    expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('should include the leadingVisual as part of the input accessible description', () => {
    const {getByRole} = render(<TextInput leadingVisual="Search" />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('Search')
  })

  it('should include the leadingVisual icon as part of the input accessible description', () => {
    const Icon = () => <SearchIcon aria-label="Search" />

    const {getByRole} = render(<TextInput leadingVisual={Icon} />)
    const icon = getByRole('img', {hidden: true})

    expect(getByRole('textbox')).toHaveAttribute('aria-describedby', icon.parentElement?.id)
    expect(icon).toHaveAccessibleName('Search')
  })

  it('should include the trailingVisual as part of the input accessible description', () => {
    const {getByRole} = render(<TextInput trailingVisual="Search" />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('Search')
  })

  it('should include the trailingVisual icon as part of the input accessible description', () => {
    const Icon = () => <SearchIcon aria-label="Search" />

    const {getByRole} = render(<TextInput trailingVisual={Icon} />)
    const icon = getByRole('img', {hidden: true})

    expect(getByRole('textbox')).toHaveAttribute('aria-describedby', icon.parentElement?.id)
    expect(icon).toHaveAccessibleName('Search')
  })

  it('should include both the leadingVisual and trailingVisual as part of the input accessible description', () => {
    const {getByRole} = render(<TextInput leadingVisual="$" trailingVisual="Currency" />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('$ Currency')
  })

  it('should keep the passed aria-describedby value', () => {
    const {getByRole} = render(
      <>
        <span id="passedValue">value</span>
        <TextInput leadingVisual="leading" trailingVisual="trailing" aria-describedby="passedValue" />
      </>,
    )
    expect(getByRole('textbox').getAttribute('aria-describedby')).toContain('passedValue')
    expect(getByRole('textbox')).toHaveAccessibleDescription('value leading trailing')
  })

  it('should include the loading indicator as part of the input accessible description', () => {
    const {getByRole} = render(<TextInput loading />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('Loading')
  })

  it('should include the leadingVisual and loading indicator as part of the input accessible description', () => {
    const {getByRole} = render(
      <TextInput loading loaderText="Loading search items" loaderPosition="trailing" leadingVisual="Search" />,
    )
    expect(getByRole('textbox')).toHaveAccessibleDescription('Search Loading search items')
  })

  it('should include the trailingVisual and loading indicator as part of the input accessible description', () => {
    const {getByRole} = render(<TextInput loading loaderPosition="leading" trailingVisual="Search" />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('Search Loading')
  })

  it('should not have an aria-describedby if there is no leadingVisual, trailingVisual, or loading indicator', () => {
    const {getByRole} = render(<TextInput />)
    expect(getByRole('textbox')).not.toHaveAttribute('aria-describedby')
  })

  describe('character counter', () => {
    afterEach(() => {
      // The announcement live region is shared and appended to the document, so
      // remove it between tests to avoid leaking messages across cases.
      document.querySelector('live-region')?.remove()
    })

    it('should render character counter when characterLimit is provided', () => {
      const {container} = render(<TextInput characterLimit={20} />)
      expect(container.textContent).toContain('20 characters remaining')
    })

    it('derives the counter and validation state from a controlled value', () => {
      const {rerender, container, getByRole} = render(
        <TextInput characterLimit={10} value="Hello" onChange={() => {}} />,
      )
      expect(container.textContent).toContain('5 characters remaining')
      expect(getByRole('textbox')).not.toHaveAttribute('aria-invalid', 'true')

      rerender(<TextInput characterLimit={10} value="Hello World!" onChange={() => {}} />)
      expect(container.textContent).toContain('2 characters over')
      expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('should update character count on input', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<TextInput characterLimit={20} />)
      const input = getByRole('textbox')

      await user.type(input, 'Hello')
      expect(container.textContent).toContain('15 characters remaining')
    })

    it('should show singular "character" when one character remains', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<TextInput characterLimit={5} />)
      const input = getByRole('textbox')

      await user.type(input, 'Test')
      expect(container.textContent).toContain('1 character remaining')
    })

    it('should show error state when character limit is exceeded', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<TextInput characterLimit={5} />)
      const input = getByRole('textbox')

      await user.type(input, 'Hello World')
      expect(container.textContent).toContain('6 characters over')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should show alert icon when character limit is exceeded', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<TextInput characterLimit={5} />)
      const input = getByRole('textbox')

      await user.type(input, 'Hello World')
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should clear error state when back under limit', async () => {
      const user = userEvent.setup()
      const {getByRole, container} = render(<TextInput characterLimit={10} defaultValue="Hello World!" />)
      const input = getByRole('textbox')

      expect(container.textContent).toContain('2 characters over')

      await user.clear(input)
      await user.type(input, 'Hello')

      expect(container.textContent).toContain('5 characters remaining')
      expect(input).not.toHaveAttribute('aria-invalid', 'true')
    })

    it('should have aria-describedby pointing to static message', () => {
      const {getByRole, container} = render(<TextInput characterLimit={20} />)
      const input = getByRole('textbox')
      const describedBy = input.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()

      const staticMessage = Array.from(container.querySelectorAll('[id]')).find(el =>
        el.textContent.includes('You can enter up to'),
      )
      expect(staticMessage).toBeTruthy()
      expect(describedBy).toContain(staticMessage?.id)
    })

    it('does not announce the counter on show', () => {
      render(<TextInput characterLimit={20} />)
      expect(getPoliteAnnouncement()).toBe('')
    })

    it('should have static screen reader message', () => {
      const {container} = render(<TextInput characterLimit={20} />)
      expect(container.textContent).toContain('You can enter up to 20 characters')
    })

    it('should show singular character in static message when limit is 1', () => {
      const {container} = render(<TextInput characterLimit={1} />)
      expect(container.textContent).toContain('You can enter up to 1 character')
    })

    it('should not announce on initial load', () => {
      render(<TextInput characterLimit={20} defaultValue="Hello" />)
      expect(getPoliteAnnouncement()).toBe('')
    })

    it('announces the updated remaining count after a change', async () => {
      // The remaining-count message is derived in render and announced (debounced)
      // through the shared live region. Uses fireEvent + fake timers because
      // userEvent deadlocks with fake timers in the browser test environment and
      // the announcement is debounced (real timers would be slow and flaky).
      vi.useFakeTimers()
      try {
        const {getByRole} = render(<TextInput characterLimit={20} />)

        fireEvent.change(getByRole('textbox'), {target: {value: 'Hello'}})
        // Nothing is announced until the debounce delay elapses.
        expect(getPoliteAnnouncement()).toBe('')

        await act(async () => {
          // Let the MutationObserver schedule the debounced announcement, then
          // advance past the delay so the live region updates.
          await Promise.resolve()
          await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
        })

        expect(getPoliteAnnouncement()).toBe('15 characters remaining')
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
          <TextInput characterLimit={20} />
        </Wrap>,
      )
      await act(async () => {})

      expect(counter.updateCount).toBe(0)
    })

    it('commits once per controlled value change without cascading', async () => {
      const [Wrap, counter] = createRenderCounter()
      const {rerender} = render(
        <Wrap>
          <TextInput characterLimit={20} value="Hello" onChange={() => {}} />
        </Wrap>,
      )
      await act(async () => {})
      counter.reset()

      rerender(
        <Wrap>
          <TextInput characterLimit={20} value="Hello World" onChange={() => {}} />
        </Wrap>,
      )
      await act(async () => {})

      expect(counter.updateCount).toBe(1)
    })
  })

  describe('data-component attributes', () => {
    it('renders TextInput with data-component attribute', () => {
      const {container} = render(<TextInput name="test" />)

      expect(container.querySelector('[data-component="TextInput"]')).toBeInTheDocument()
    })

    it('renders input with data-component attribute', () => {
      const {container} = render(<TextInput name="test" />)

      expect(container.querySelector('[data-component="input"]')).toBeInTheDocument()
    })

    it('renders TextInput.LeadingVisual with data-component attribute', () => {
      const {container} = render(<TextInput name="test" leadingVisual={SearchIcon} />)

      expect(container.querySelector('[data-component="TextInput.LeadingVisual"]')).toBeInTheDocument()
    })

    it('renders TextInput.TrailingVisual with data-component attribute', () => {
      const {container} = render(<TextInput name="test" trailingVisual={SearchIcon} />)

      expect(container.querySelector('[data-component="TextInput.TrailingVisual"]')).toBeInTheDocument()
    })

    it('renders TextInput.Action with data-component attribute', () => {
      const {container} = render(
        <TextInput name="test" trailingAction={<TextInput.Action aria-label="Clear">Clear</TextInput.Action>} />,
      )

      expect(container.querySelector('[data-component="TextInput.Action"]')).toBeInTheDocument()
    })

    it('renders TextInput.Icon with data-component attribute', () => {
      const {container} = render(<TextInput name="test" icon={SearchIcon} />)

      expect(container.querySelector('[data-component="TextInput.Icon"]')).toBeInTheDocument()
    })

    it('renders TextInput.CharacterCounter with data-component attribute', () => {
      const {container} = render(<TextInput name="test" characterLimit={100} />)

      expect(container.querySelector('[data-component="TextInput.CharacterCounter"]')).toBeInTheDocument()
    })
  })

  describe('data-no-* visual markers', () => {
    it('sets all data-no-* markers when no visuals or actions are provided', () => {
      const {container} = render(<TextInput name="test" />)
      const wrapper = container.querySelector('[data-component="TextInput"]')
      expect(wrapper).toHaveAttribute('data-no-leading-visual', 'true')
      expect(wrapper).toHaveAttribute('data-no-trailing-visual', 'true')
      expect(wrapper).toHaveAttribute('data-no-trailing-action', 'true')
    })

    it('drops data-no-leading-visual when leadingVisual is provided', () => {
      const {container} = render(<TextInput name="test" leadingVisual={SearchIcon} />)
      const wrapper = container.querySelector('[data-component="TextInput"]')
      expect(wrapper).not.toHaveAttribute('data-no-leading-visual')
      expect(wrapper).toHaveAttribute('data-leading-visual', 'true')
      expect(wrapper).toHaveAttribute('data-no-trailing-visual', 'true')
      expect(wrapper).toHaveAttribute('data-no-trailing-action', 'true')
    })

    it('drops data-no-trailing-visual when trailingVisual is provided', () => {
      const {container} = render(<TextInput name="test" trailingVisual={SearchIcon} />)
      const wrapper = container.querySelector('[data-component="TextInput"]')
      expect(wrapper).toHaveAttribute('data-no-leading-visual', 'true')
      expect(wrapper).not.toHaveAttribute('data-no-trailing-visual')
      expect(wrapper).toHaveAttribute('data-trailing-visual', 'true')
      expect(wrapper).toHaveAttribute('data-no-trailing-action', 'true')
    })

    it('drops data-no-trailing-action when trailingAction is provided', () => {
      const {container} = render(
        <TextInput name="test" trailingAction={<TextInput.Action aria-label="Clear">Clear</TextInput.Action>} />,
      )
      const wrapper = container.querySelector('[data-component="TextInput"]')
      expect(wrapper).toHaveAttribute('data-no-leading-visual', 'true')
      expect(wrapper).toHaveAttribute('data-no-trailing-visual', 'true')
      expect(wrapper).not.toHaveAttribute('data-no-trailing-action')
      expect(wrapper).toHaveAttribute('data-trailing-action', 'true')
    })
  })
})

describe('TextInput forwarded ref (primer_react_merged_forwarded_refs)', () => {
  for (const enabled of [true, false]) {
    describe(`with the flag ${enabled ? 'enabled' : 'disabled'}`, () => {
      it('forwards a ref object to the element', () => {
        const ref = createRef<HTMLInputElement>()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <TextInput ref={ref} />
          </FeatureFlags>,
        )
        expect(ref.current).toBeInstanceOf(HTMLInputElement)
      })

      it('calls a callback ref with the element', () => {
        const refCallback = vi.fn()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <TextInput ref={refCallback} />
          </FeatureFlags>,
        )
        expect(refCallback.mock.calls.some(([el]) => el instanceof HTMLInputElement)).toBe(true)
      })
    })
  }
})
