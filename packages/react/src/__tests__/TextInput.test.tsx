import {SearchIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {render as HTMLRender, fireEvent, screen} from '@testing-library/react'
import axe from 'axe-core'
import React from 'react'
import {TextInput} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {FeatureFlags} from '../FeatureFlags'

describe('TextInput', () => {
  behavesAsComponent({Component: TextInput, options: {skipAs: true}})

  checkExports('TextInput', {
    default: TextInput,
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <TextInput className={'test-class-name'} />
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_staff: true,
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
    expect(HTMLRender(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<TextInput aria-label="Zipcode" name="zipcode" variant="small" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders', () => {
    expect(render(<TextInput name="zipcode" />)).toMatchSnapshot()
  })

  it('renders small', () => {
    expect(render(<TextInput name="zipcode" size="small" />)).toMatchSnapshot()
  })

  it('renders large', () => {
    expect(render(<TextInput name="zipcode" size="large" />)).toMatchSnapshot()
  })

  it('renders block', () => {
    expect(render(<TextInput name="zipcode" block />)).toMatchSnapshot()
  })

  it('renders error', () => {
    expect(render(<TextInput name="zipcode" validationStatus="error" />)).toMatchSnapshot()
  })

  it('renders sets aria-invalid="true" on error', () => {
    HTMLRender(<TextInput name="zipcode" validationStatus="error" data-testid="zipcodeInput" />)
    expect(screen.getByTestId('zipcodeInput')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders contrast', () => {
    expect(render(<TextInput name="zipcode" contrast />)).toMatchSnapshot()
  })

  it('renders monospace', () => {
    expect(render(<TextInput name="zipcode" monospace />)).toMatchSnapshot()
  })

  it('renders placeholder', () => {
    expect(render(<TextInput name="zipcode" placeholder={'560076'} />)).toMatchSnapshot()
  })

  it('renders leadingVisual', () => {
    expect(render(<TextInput name="search" placeholder={'Search'} leadingVisual={SearchIcon} />)).toMatchSnapshot()
    expect(render(<TextInput name="search" placeholder={'Search'} leadingVisual={<SearchIcon />} />)).toMatchSnapshot()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          leadingVisual={React.memo(() => (
            <div>Trailing</div>
          ))}
        />,
      ),
    ).toMatchSnapshot()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          leadingVisual={React.forwardRef(() => (
            <div>Trailing</div>
          ))}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('renders trailingVisual', () => {
    expect(render(<TextInput name="search" placeholder={'Search'} trailingVisual={SearchIcon} />)).toMatchSnapshot()
    expect(render(<TextInput name="search" placeholder={'Search'} trailingVisual={<SearchIcon />} />)).toMatchSnapshot()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          trailingVisual={React.memo(() => (
            <div>Trailing</div>
          ))}
        />,
      ),
    ).toMatchSnapshot()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          trailingVisual={React.forwardRef(() => (
            <div>Trailing</div>
          ))}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('renders trailingAction text button', () => {
    const handleAction = jest.fn()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          trailingAction={<TextInput.Action onClick={handleAction}>Clear</TextInput.Action>}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('renders trailingAction text button with a tooltip', () => {
    const handleAction = jest.fn()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          trailingAction={
            <TextInput.Action onClick={handleAction} aria-label="Clear input">
              Clear
            </TextInput.Action>
          }
        />,
      ),
    ).toMatchSnapshot()
  })

  it('renders trailingAction icon button', () => {
    const handleAction = jest.fn()
    expect(
      render(
        <TextInput
          name="search"
          placeholder={'Search'}
          trailingAction={<TextInput.Action onClick={handleAction} icon={SearchIcon} aria-label="Icon label" />}
        />,
      ),
    ).toMatchSnapshot()
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
    expect(
      render(
        <>
          <TextInput loading />

          <TextInput loading loaderPosition="leading" />

          <TextInput loading loaderPosition="trailing" />

          <TextInput loading leadingVisual={SearchIcon} />

          <TextInput loading leadingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput loading leadingVisual={SearchIcon} loaderPosition="trailing" />

          <TextInput loading trailingVisual={SearchIcon} />

          <TextInput loading trailingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput loading trailingVisual={SearchIcon} loaderPosition="trailing" />

          <TextInput loading size="small" leadingVisual={SearchIcon} trailingVisual={SearchIcon} />

          <TextInput loading leadingVisual={SearchIcon} trailingVisual={SearchIcon} loaderPosition="leading" />

          <TextInput
            loading
            size="large"
            leadingVisual={SearchIcon}
            trailingVisual={SearchIcon}
            loaderPosition="trailing"
          />
        </>,
      ),
    ).toMatchSnapshot()
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
    expect(render(<TextInput name="password" type="password" />)).toMatchSnapshot()
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
