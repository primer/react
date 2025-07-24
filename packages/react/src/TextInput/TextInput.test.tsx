import {SearchIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {render as HTMLRender, fireEvent, screen} from '@testing-library/react'
import axe from 'axe-core'
import React from 'react'
import {TextInput} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'

describe('TextInput', () => {
  behavesAsComponent({Component: TextInput, options: {skipAs: true}})

  checkExports('TextInput', {
    default: TextInput,
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <TextInput className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it.skip('should have no axe violations', async () => {
    const {container} = HTMLRender(<TextInput aria-label="Zipcode" name="zipcode" variant="small" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders', () => {
    const {getByRole} = HTMLRender(<TextInput name="zipcode" />)
    const input = getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'zipcode')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders small', () => {
    const {getByRole} = HTMLRender(<TextInput name="zipcode" size="small" />)
    expect(getByRole('textbox')).toHaveAttribute('name', 'zipcode')
  })

  it('renders large', () => {
    const {container, getByRole} = HTMLRender(<TextInput name="zipcode" size="large" />)
    const input = getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'zipcode')
    // Verify wrapper is rendered properly
    expect(container.querySelector('.TextInputWrapper')).toBeInTheDocument()
  })

  it('renders block', () => {
    const {getByRole} = HTMLRender(<TextInput name="zipcode" block />)
    const input = getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'zipcode')
  })

  it('renders error', () => {
    const {getByRole} = HTMLRender(<TextInput name="zipcode" validationStatus="error" />)
    const input = getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders sets aria-invalid="true" on error', () => {
    HTMLRender(<TextInput name="zipcode" validationStatus="error" data-testid="zipcodeInput" />)
    expect(screen.getByTestId('zipcodeInput')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders contrast', () => {
    const {getByRole} = HTMLRender(<TextInput name="zipcode" contrast />)
    const input = getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'zipcode')
  })

  it('renders monospace', () => {
    const {getByRole} = HTMLRender(<TextInput name="zipcode" monospace />)
    const input = getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'zipcode')
  })

  it('renders placeholder', () => {
    const {getByRole} = HTMLRender(<TextInput name="zipcode" placeholder={'560076'} />)
    const input = getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', '560076')
  })

  it('renders leadingVisual', () => {
    // Test with icon component
    const {container: container1} = HTMLRender(
      <TextInput name="search" placeholder={'Search'} leadingVisual={SearchIcon} />,
    )
    expect(container1.querySelector('[data-component="leadingVisual"]')).toBeInTheDocument()

    // Test with icon element
    const {container: container2} = HTMLRender(
      <TextInput name="search" placeholder={'Search'} leadingVisual={<SearchIcon />} />,
    )
    expect(container2.querySelector('[data-component="leadingVisual"]')).toBeInTheDocument()

    // Test with custom memo component
    const {container: container3} = HTMLRender(
      <TextInput
        name="search"
        placeholder={'Search'}
        leadingVisual={React.memo(() => (
          <div>Leading</div>
        ))}
      />,
    )
    expect(container3.querySelector('[data-component="leadingVisual"]')).toBeInTheDocument()

    // Test with forwardRef component
    const {container: container4} = HTMLRender(
      <TextInput
        name="search"
        placeholder={'Search'}
        leadingVisual={React.forwardRef(() => (
          <div>Leading</div>
        ))}
      />,
    )
    expect(container4.querySelector('[data-component="leadingVisual"]')).toBeInTheDocument()
  })

  it('renders trailingVisual', () => {
    // Test with icon component
    const {container: container1} = HTMLRender(
      <TextInput name="search" placeholder={'Search'} trailingVisual={SearchIcon} />,
    )
    expect(container1.querySelector('[data-component="trailingVisual"]')).toBeInTheDocument()

    // Test with icon element
    const {container: container2} = HTMLRender(
      <TextInput name="search" placeholder={'Search'} trailingVisual={<SearchIcon />} />,
    )
    expect(container2.querySelector('[data-component="trailingVisual"]')).toBeInTheDocument()

    // Test with memo component
    const {container: container3} = HTMLRender(
      <TextInput
        name="search"
        placeholder={'Search'}
        trailingVisual={React.memo(() => (
          <div>Trailing</div>
        ))}
      />,
    )
    expect(container3.querySelector('[data-component="trailingVisual"]')).toBeInTheDocument()

    // Test with forwardRef component
    const {container: container4} = HTMLRender(
      <TextInput
        name="search"
        placeholder={'Search'}
        trailingVisual={React.forwardRef(() => (
          <div>Trailing</div>
        ))}
      />,
    )
    expect(container4.querySelector('[data-component="trailingVisual"]')).toBeInTheDocument()
  })

  it('renders trailingAction text button', () => {
    const handleAction = jest.fn()
    const {container} = HTMLRender(
      <TextInput
        name="search"
        placeholder={'Search'}
        trailingAction={<TextInput.Action onClick={handleAction}>Clear</TextInput.Action>}
      />,
    )
    expect(container.querySelector('button')).toBeInTheDocument()
    expect(container.querySelector('button')).toHaveTextContent('Clear')
  })

  it('renders trailingAction text button with a tooltip', () => {
    const handleAction = jest.fn()
    const {container} = HTMLRender(
      <TextInput
        name="search"
        placeholder={'Search'}
        trailingAction={
          <TextInput.Action onClick={handleAction} aria-label="Clear input">
            Clear
          </TextInput.Action>
        }
      />,
    )
    expect(container.querySelector('button')).toBeInTheDocument()
    expect(container.querySelector('button')).toHaveAttribute('aria-label', 'Clear input')
  })

  it('renders trailingAction icon button', () => {
    const handleAction = jest.fn()
    const {container} = HTMLRender(
      <TextInput
        name="search"
        placeholder={'Search'}
        trailingAction={<TextInput.Action onClick={handleAction} icon={SearchIcon} aria-label="Icon label" />}
      />,
    )
    expect(container.querySelector('button')).toBeInTheDocument()
    expect(container.querySelector('button')).toHaveAttribute('aria-label', 'Icon label')
  })

  it('focuses the text input if you do not click the input element', () => {
    const {container, getByLabelText} = HTMLRender(
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

  it('renders with a loading indicator', () => {
    // Test basic loading indicator
    const {container: container1} = HTMLRender(<TextInput loading />)
    expect(container1.querySelector('[data-component="Spinner"]')).toBeInTheDocument()

    // Test loading with different positions
    const {container: container2} = HTMLRender(<TextInput loading loaderPosition="leading" />)
    expect(container2.querySelector('[data-component="Spinner"]')).toBeInTheDocument()

    const {container: container3} = HTMLRender(<TextInput loading loaderPosition="trailing" />)
    expect(container3.querySelector('[data-component="Spinner"]')).toBeInTheDocument()

    // Test loading with visuals
    const {container: container4} = HTMLRender(<TextInput loading leadingVisual={SearchIcon} />)
    expect(container4.querySelector('[data-component="Spinner"]')).toBeInTheDocument()
  })

  it('indicates a busy status to assistive technology', () => {
    const {container} = HTMLRender(
      <>
        <label htmlFor="loadingInput">Search</label>
        <TextInput loading id="loadingInput" />
      </>,
    )

    expect(container.querySelector('span[aria-busy=true]')).not.toBeNull()
  })

  it('should call onChange prop with input value', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const {getByRole} = HTMLRender(<TextInput onChange={onChange} value="" />)

    await user.type(getByRole('textbox'), 'test')

    expect(onChange).toHaveBeenCalled()
  })

  it('should render a password input', () => {
    const {getByRole} = HTMLRender(<TextInput name="password" type="password" />)
    expect(getByRole('textbox')).toHaveAttribute('type', 'password')
  })

  it('should not override prop aria-invalid', () => {
    const onChange = jest.fn()
    const {getByRole} = HTMLRender(<TextInput onChange={onChange} aria-invalid="true" value="" />)
    expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('should include the leadingVisual as part of the input accessible description', () => {
    const {getByRole} = HTMLRender(<TextInput leadingVisual="Search" />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('Search')
  })

  it('should include the leadingVisual icon as part of the input accessible description', () => {
    const Icon = () => <SearchIcon aria-label="Search" />

    const {getByRole} = HTMLRender(<TextInput leadingVisual={Icon} />)
    const icon = getByRole('img', {hidden: true})

    expect(getByRole('textbox')).toHaveAttribute('aria-describedby', icon.parentElement?.id)
    expect(icon).toHaveAccessibleName('Search')
  })

  it('should include the trailingVisual as part of the input accessible description', () => {
    const {getByRole} = HTMLRender(<TextInput trailingVisual="Search" />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('Search')
  })

  it('should include the trailingVisual icon as part of the input accessible description', () => {
    const Icon = () => <SearchIcon aria-label="Search" />

    const {getByRole} = HTMLRender(<TextInput trailingVisual={Icon} />)
    const icon = getByRole('img', {hidden: true})

    expect(getByRole('textbox')).toHaveAttribute('aria-describedby', icon.parentElement?.id)
    expect(icon).toHaveAccessibleName('Search')
  })

  it('should include both the leadingVisual and trailingVisual as part of the input accessible description', () => {
    const {getByRole} = HTMLRender(<TextInput leadingVisual="$" trailingVisual="Currency" />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('$ Currency')
  })

  it('should keep the passed aria-describedby value', () => {
    const {getByRole} = HTMLRender(
      <>
        <span id="passedValue">value</span>
        <TextInput leadingVisual="leading" trailingVisual="trailing" aria-describedby="passedValue" />
      </>,
    )
    expect(getByRole('textbox').getAttribute('aria-describedby')).toContain('passedValue')
    expect(getByRole('textbox')).toHaveAccessibleDescription('value leading trailing')
  })

  it('should include the loading indicator as part of the input accessible description', () => {
    const {getByRole} = HTMLRender(<TextInput loading />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('Loading')
  })

  it('should include the leadingVisual and loading indicator as part of the input accessible description', () => {
    const {getByRole} = HTMLRender(
      <TextInput loading loaderText="Loading search items" loaderPosition="trailing" leadingVisual="Search" />,
    )
    expect(getByRole('textbox')).toHaveAccessibleDescription('Search Loading search items')
  })

  it('should include the trailingVisual and loading indicator as part of the input accessible description', () => {
    const {getByRole} = HTMLRender(<TextInput loading loaderPosition="leading" trailingVisual="Search" />)
    expect(getByRole('textbox')).toHaveAccessibleDescription('Search Loading')
  })

  it('should not have an aria-describedby if there is no leadingVisual, trailingVisual, or loading indicator', () => {
    const {getByRole} = HTMLRender(<TextInput />)
    expect(getByRole('textbox')).not.toHaveAttribute('aria-describedby')
  })
})
