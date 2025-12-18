import {SearchIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {render, fireEvent, screen} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import React from 'react'
import TextInput from '../TextInput'

describe('TextInput', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <TextInput className={'test-class-name'} />
    const {container} = render(<Element />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })

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
    expect(render(<TextInput name="zipcode" validationStatus="error" />).container).toMatchSnapshot()
  })

  it('renders sets aria-invalid="true" on error', () => {
    render(<TextInput name="zipcode" validationStatus="error" data-testid="zipcodeInput" />)
    expect(screen.getByTestId('zipcodeInput')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders contrast', () => {
    expect(render(<TextInput name="zipcode" contrast />).container).toMatchSnapshot()
  })

  it('renders monospace', () => {
    expect(render(<TextInput name="zipcode" monospace />).container).toMatchSnapshot()
  })

  it('renders placeholder', () => {
    expect(render(<TextInput name="zipcode" placeholder={'560076'} />).container).toMatchSnapshot()
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
    expect(render(<TextInput name="password" type="password" />).container).toMatchSnapshot()
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
    it('should render character counter when characterLimit is provided', () => {
      const {container} = render(<TextInput characterLimit={20} />)
      expect(container.textContent).toContain('20 characters remaining')
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

      // Initially over limit
      expect(container.textContent).toContain('2 characters over')

      // Clear some text
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

      // Find the static message element
      const staticMessage = Array.from(container.querySelectorAll('[id]')).find(el =>
        el.textContent.includes('You can enter up to'),
      )
      expect(staticMessage).toBeTruthy()
      expect(describedBy).toContain(staticMessage?.id)
    })

    it('should have screen reader announcement element', () => {
      const {container} = render(<TextInput characterLimit={20} />)
      const srElement = container.querySelector('[aria-live="polite"]')
      expect(srElement).toBeInTheDocument()
      expect(srElement).toHaveAttribute('role', 'status')
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
      const {container} = render(<TextInput characterLimit={20} defaultValue="Hello" />)
      const srElement = container.querySelector('[aria-live="polite"]')
      expect(srElement?.textContent).toBe('')
    })
  })
})
