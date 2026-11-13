import {SearchIcon} from '@primer/octicons-react'
import {page, userEvent} from 'vitest/browser'
import {render, act} from '@testing-library/react'
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

  it('renders', async () => {
    render(<TextInput name="zipcode" />)
    await expect.element(page.getByRole('textbox')).toHaveAttribute('type', 'text')
    await expect.element(page.getByRole('textbox')).toHaveAttribute('name', 'zipcode')
  })

  it('renders small', async () => {
    const {container} = render(<TextInput name="zipcode" size="small" />)
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-size', 'small')
  })

  it('renders large', async () => {
    const {container} = render(<TextInput name="zipcode" size="large" />)
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-size', 'large')
  })

  it('renders block', async () => {
    const {container} = render(<TextInput name="zipcode" block />)
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-block')
  })

  it('renders error', () => {
    expect(render(<TextInput name="zipcode" validationStatus="error" value="" />).container).toMatchSnapshot()
  })

  it('renders sets aria-invalid="true" on error', async () => {
    render(<TextInput name="zipcode" validationStatus="error" data-testid="zipcodeInput" />)
    await expect.element(page.getByTestId('zipcodeInput')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders contrast', () => {
    expect(render(<TextInput name="zipcode" contrast value="" />).container).toMatchSnapshot()
  })

  it.each([
    {label: 'true', props: {contrast: true}},
    {label: 'false', props: {contrast: false}},
    {label: 'omitted', props: {}},
  ])('preserves deprecated contrast behavior when $label', async ({props}) => {
    const {container} = render(<TextInput name="zipcode" {...props} />)
    const root = container.querySelector<HTMLElement>(':first-child')
    const input = page.getByRole('textbox')

    if (props.contrast) {
      await expect.element(root).toHaveAttribute('data-contrast', 'true')
    } else {
      await expect.element(root).not.toHaveAttribute('data-contrast')
    }

    await expect.element(input).not.toHaveAttribute('contrast')
    await expect.element(input).toBeEnabled()
  })

  it('renders monospace', () => {
    expect(render(<TextInput name="zipcode" monospace value="" />).container).toMatchSnapshot()
  })

  it('renders placeholder', () => {
    expect(render(<TextInput name="zipcode" placeholder={'560076'} value="" />).container).toMatchSnapshot()
  })

  it('renders leadingVisual', async () => {
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

    await expect.element(page.getByTestId('function-component')).toBeInTheDocument()
    await expect.element(page.getByTestId('jsx-element')).toBeInTheDocument()
    await expect.element(page.getByTestId('memo')).toBeInTheDocument()
    await expect.element(page.getByTestId('forward-ref')).toBeInTheDocument()
  })

  it('renders trailingVisual', async () => {
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

    await expect.element(page.getByTestId('function-component')).toBeInTheDocument()
    await expect.element(page.getByTestId('jsx-element')).toBeInTheDocument()
    await expect.element(page.getByTestId('memo')).toBeInTheDocument()
    await expect.element(page.getByTestId('forward-ref')).toBeInTheDocument()
  })

  it('renders trailingAction text button', async () => {
    const handleAction = vi.fn()
    render(
      <TextInput
        name="search"
        placeholder={'Search'}
        trailingAction={<TextInput.Action onClick={handleAction}>Clear</TextInput.Action>}
      />,
    )
    await expect.element(page.getByRole('button', {name: 'Clear'})).toBeInTheDocument()
  })

  it('renders trailingAction text button with a tooltip', async () => {
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

    await expect.element(page.getByRole('button', {name: 'Clear'})).toBeInTheDocument()
  })

  it('renders trailingAction icon button', async () => {
    const handleAction = vi.fn()
    render(
      <TextInput
        name="search"
        placeholder="Search"
        trailingAction={<TextInput.Action onClick={handleAction} icon={SearchIcon} aria-label="Icon label" />}
      />,
    )

    await expect.element(page.getByRole('button', {name: 'Icon label'})).toBeInTheDocument()
  })

  it('focuses the text input if you do not click the input element', async () => {
    const {container} = render(
      <>
        <label htmlFor="testInput">Search</label>
        <TextInput id="testInput" name="search" placeholder={'Search'} trailingVisual={SearchIcon} />
      </>,
    )

    const iconElement = container.querySelector<SVGElement>('svg')
    if (!iconElement) throw new Error('Could not find the trailing icon')
    const icon = page.elementLocator(iconElement)

    await expect.element(page.getByLabelText('Search')).not.toHaveFocus()
    await userEvent.click(icon)
    await expect.element(page.getByLabelText('Search')).toHaveFocus()
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
    const onChange = vi.fn()
    render(<TextInput onChange={onChange} value="" />)

    await userEvent.type(page.getByRole('textbox'), 'test')

    expect(onChange).toHaveBeenCalled()
  })

  it('should render a password input', () => {
    expect(render(<TextInput name="password" type="password" value="" />).container).toMatchSnapshot()
  })

  it('should not override prop aria-invalid', async () => {
    const onChange = vi.fn()
    render(<TextInput onChange={onChange} aria-invalid="true" value="" />)
    await expect.element(page.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('should include the leadingVisual as part of the input accessible description', async () => {
    render(<TextInput leadingVisual="Search" />)
    await expect.element(page.getByRole('textbox')).toHaveAccessibleDescription('Search')
  })

  it('should include the leadingVisual icon as part of the input accessible description', async () => {
    const Icon = () => <SearchIcon aria-label="Search" />

    render(<TextInput leadingVisual={Icon} />)
    const icon = page.getByRole('img', {includeHidden: true})

    await expect
      .element(page.getByRole('textbox'))
      .toHaveAttribute('aria-describedby', icon.element().parentElement?.id)
    await expect.element(icon).toHaveAccessibleName('Search')
  })

  it('should include the trailingVisual as part of the input accessible description', async () => {
    render(<TextInput trailingVisual="Search" />)
    await expect.element(page.getByRole('textbox')).toHaveAccessibleDescription('Search')
  })

  it('should include the trailingVisual icon as part of the input accessible description', async () => {
    const Icon = () => <SearchIcon aria-label="Search" />

    render(<TextInput trailingVisual={Icon} />)
    const icon = page.getByRole('img', {includeHidden: true})

    await expect
      .element(page.getByRole('textbox'))
      .toHaveAttribute('aria-describedby', icon.element().parentElement?.id)
    await expect.element(icon).toHaveAccessibleName('Search')
  })

  it('should include both the leadingVisual and trailingVisual as part of the input accessible description', async () => {
    render(<TextInput leadingVisual="$" trailingVisual="Currency" />)
    await expect.element(page.getByRole('textbox')).toHaveAccessibleDescription('$ Currency')
  })

  it('should keep the passed aria-describedby value', async () => {
    render(
      <>
        <span id="passedValue">value</span>
        <TextInput leadingVisual="leading" trailingVisual="trailing" aria-describedby="passedValue" />
      </>,
    )
    expect(page.getByRole('textbox').element().getAttribute('aria-describedby')).toContain('passedValue')
    await expect.element(page.getByRole('textbox')).toHaveAccessibleDescription('value leading trailing')
  })

  it('should include the loading indicator as part of the input accessible description', async () => {
    render(<TextInput loading />)
    await expect.element(page.getByRole('textbox')).toHaveAccessibleDescription('Loading')
  })

  it('should include the leadingVisual and loading indicator as part of the input accessible description', async () => {
    render(<TextInput loading loaderText="Loading search items" loaderPosition="trailing" leadingVisual="Search" />)
    await expect.element(page.getByRole('textbox')).toHaveAccessibleDescription('Search Loading search items')
  })

  it('should include the trailingVisual and loading indicator as part of the input accessible description', async () => {
    render(<TextInput loading loaderPosition="leading" trailingVisual="Search" />)
    await expect.element(page.getByRole('textbox')).toHaveAccessibleDescription('Search Loading')
  })

  it('should not have an aria-describedby if there is no leadingVisual, trailingVisual, or loading indicator', async () => {
    render(<TextInput />)
    await expect.element(page.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
  })

  describe('character counter', () => {
    afterEach(() => {
      // The announcement live region is shared and appended to the document, so
      // remove it between tests to avoid leaking messages across cases.
      document.querySelector('live-region')?.remove()
    })

    it('should render character counter when characterLimit is provided', async () => {
      render(<TextInput characterLimit={20} />)
      await expect
        .element(document.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toHaveTextContent('20 characters remaining')
    })

    it('derives the counter and validation state from a controlled value', async () => {
      const {rerender} = render(<TextInput characterLimit={10} value="Hello" onChange={() => {}} />)
      await expect
        .element(document.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toHaveTextContent('5 characters remaining')
      await expect.element(page.getByRole('textbox')).not.toHaveAttribute('aria-invalid', 'true')

      rerender(<TextInput characterLimit={10} value="Hello World!" onChange={() => {}} />)
      await expect
        .element(document.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toHaveTextContent('2 characters over')
      await expect.element(page.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('should update character count on input', async () => {
      render(<TextInput characterLimit={20} />)
      const input = page.getByRole('textbox')

      await userEvent.type(input, 'Hello')
      await expect
        .element(document.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toHaveTextContent('15 characters remaining')
    })

    it('should show singular "character" when one character remains', async () => {
      render(<TextInput characterLimit={5} />)
      const input = page.getByRole('textbox')

      await userEvent.type(input, 'Test')
      await expect
        .element(document.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toHaveTextContent('1 character remaining')
    })

    it('should show error state when character limit is exceeded', async () => {
      render(<TextInput characterLimit={5} />)
      const input = page.getByRole('textbox')

      await userEvent.type(input, 'Hello World')
      await expect
        .element(document.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toHaveTextContent('6 characters over')
      await expect.element(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should show alert icon when character limit is exceeded', async () => {
      const {container} = render(<TextInput characterLimit={5} />)
      const input = page.getByRole('textbox')

      await userEvent.type(input, 'Hello World')
      const icon = container.querySelector<SVGElement>('svg')
      await expect.element(icon).toBeInTheDocument()
    })

    it('should clear error state when back under limit', async () => {
      render(<TextInput characterLimit={10} defaultValue="Hello World!" />)
      const input = page.getByRole('textbox')

      await expect
        .element(document.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toHaveTextContent('2 characters over')

      await userEvent.clear(input)
      await userEvent.type(input, 'Hello')

      await expect
        .element(document.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toHaveTextContent('5 characters remaining')
      await expect.element(input).not.toHaveAttribute('aria-invalid', 'true')
    })

    it('should have aria-describedby pointing to static message', async () => {
      render(<TextInput characterLimit={20} />)
      const input = page.getByRole('textbox')
      const describedBy = input.element().getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()

      const staticMessage = page.getByText('You can enter up to 20 characters')
      await expect.element(staticMessage).toBeInTheDocument()
      expect(describedBy).toContain(staticMessage.element().id)
    })

    it('does not announce the counter on show', () => {
      render(<TextInput characterLimit={20} />)
      expect(getPoliteAnnouncement()).toBe('')
    })

    it('should have static screen reader message', async () => {
      render(<TextInput characterLimit={20} />)
      await expect.element(page.getByText('You can enter up to 20 characters')).toBeInTheDocument()
    })

    it('should show singular character in static message when limit is 1', async () => {
      render(<TextInput characterLimit={1} />)
      await expect.element(page.getByText('You can enter up to 1 character')).toBeInTheDocument()
    })

    it('should not announce on initial load', () => {
      render(<TextInput characterLimit={20} defaultValue="Hello" />)
      expect(getPoliteAnnouncement()).toBe('')
    })

    it('announces the updated remaining count after a change', async () => {
      // Use fake timers to advance the debounced live-region announcement.
      vi.useFakeTimers()
      try {
        render(<TextInput characterLimit={20} />)

        await userEvent.fill(page.getByRole('textbox'), 'Hello')
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
      await act(() => {})

      expect(counter.updateCount).toBe(0)
    })

    it('commits once per controlled value change without cascading', async () => {
      const [Wrap, counter] = createRenderCounter()
      const {rerender} = render(
        <Wrap>
          <TextInput characterLimit={20} value="Hello" onChange={() => {}} />
        </Wrap>,
      )
      await act(() => {})
      counter.reset()

      rerender(
        <Wrap>
          <TextInput characterLimit={20} value="Hello World" onChange={() => {}} />
        </Wrap>,
      )
      await act(() => {})

      expect(counter.updateCount).toBe(1)
    })
  })

  describe('data-component attributes', () => {
    it('renders TextInput with data-component attribute', async () => {
      const {container} = render(<TextInput name="test" />)

      await expect.element(container.querySelector<HTMLElement>('[data-component="TextInput"]')).toBeInTheDocument()
    })

    it('renders input with data-component attribute', async () => {
      const {container} = render(<TextInput name="test" />)

      await expect.element(container.querySelector<HTMLInputElement>('[data-component="input"]')).toBeInTheDocument()
    })

    it('renders TextInput.LeadingVisual with data-component attribute', async () => {
      const {container} = render(<TextInput name="test" leadingVisual={SearchIcon} />)

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="TextInput.LeadingVisual"]'))
        .toBeInTheDocument()
    })

    it('renders TextInput.TrailingVisual with data-component attribute', async () => {
      const {container} = render(<TextInput name="test" trailingVisual={SearchIcon} />)

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="TextInput.TrailingVisual"]'))
        .toBeInTheDocument()
    })

    it('renders TextInput.Action with data-component attribute', async () => {
      const {container} = render(
        <TextInput name="test" trailingAction={<TextInput.Action aria-label="Clear">Clear</TextInput.Action>} />,
      )

      await expect
        .element(container.querySelector<HTMLButtonElement>('[data-component="TextInput.Action"]'))
        .toBeInTheDocument()
    })

    it('renders TextInput.Icon with data-component attribute', async () => {
      const {container} = render(<TextInput name="test" icon={SearchIcon} />)

      await expect.element(container.querySelector<SVGElement>('[data-component="TextInput.Icon"]')).toBeInTheDocument()
    })

    it('renders TextInput.CharacterCounter with data-component attribute', async () => {
      const {container} = render(<TextInput name="test" characterLimit={100} />)

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="TextInput.CharacterCounter"]'))
        .toBeInTheDocument()
    })
  })

  describe('data-no-* visual markers', () => {
    it('sets all data-no-* markers when no visuals or actions are provided', async () => {
      const {container} = render(<TextInput name="test" />)
      const wrapper = container.querySelector<HTMLElement>('[data-component="TextInput"]')
      await expect.element(wrapper).toHaveAttribute('data-no-leading-visual', 'true')
      await expect.element(wrapper).toHaveAttribute('data-no-trailing-visual', 'true')
      await expect.element(wrapper).toHaveAttribute('data-no-trailing-action', 'true')
    })

    it('drops data-no-leading-visual when leadingVisual is provided', async () => {
      const {container} = render(<TextInput name="test" leadingVisual={SearchIcon} />)
      const wrapper = container.querySelector<HTMLElement>('[data-component="TextInput"]')
      await expect.element(wrapper).not.toHaveAttribute('data-no-leading-visual')
      await expect.element(wrapper).toHaveAttribute('data-leading-visual', 'true')
      await expect.element(wrapper).toHaveAttribute('data-no-trailing-visual', 'true')
      await expect.element(wrapper).toHaveAttribute('data-no-trailing-action', 'true')
    })

    it('drops data-no-trailing-visual when trailingVisual is provided', async () => {
      const {container} = render(<TextInput name="test" trailingVisual={SearchIcon} />)
      const wrapper = container.querySelector<HTMLElement>('[data-component="TextInput"]')
      await expect.element(wrapper).toHaveAttribute('data-no-leading-visual', 'true')
      await expect.element(wrapper).not.toHaveAttribute('data-no-trailing-visual')
      await expect.element(wrapper).toHaveAttribute('data-trailing-visual', 'true')
      await expect.element(wrapper).toHaveAttribute('data-no-trailing-action', 'true')
    })

    it('drops data-no-trailing-action when trailingAction is provided', async () => {
      const {container} = render(
        <TextInput name="test" trailingAction={<TextInput.Action aria-label="Clear">Clear</TextInput.Action>} />,
      )
      const wrapper = container.querySelector<HTMLElement>('[data-component="TextInput"]')
      await expect.element(wrapper).toHaveAttribute('data-no-leading-visual', 'true')
      await expect.element(wrapper).toHaveAttribute('data-no-trailing-visual', 'true')
      await expect.element(wrapper).not.toHaveAttribute('data-no-trailing-action')
      await expect.element(wrapper).toHaveAttribute('data-trailing-action', 'true')
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
